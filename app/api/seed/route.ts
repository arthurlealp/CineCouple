import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import seedData from "@/lib/seed-data.json";

export async function GET() {
    const supabase = createClient();

    // Segurança: Permitir apenas em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({
            error: "Esta rota está desabilitada em produção por motivos de segurança."
        }, { status: 403 });
    }

    // Verifica se usuário está logado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Você precisa estar logado para importar os dados!" }, { status: 401 });
    }

    try {
        // Verifica se já existem dados para este usuário
        const { data: existingMovies } = await supabase
            .from('movies')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

        if (existingMovies && existingMovies.length > 0) {
            return NextResponse.json({
                error: "Você já tem filmes cadastrados! Para reimportar, use /api/seed/reset primeiro."
            }, { status: 400 });
        }

        const moviesToInsert = [];

        // Prepara os dados
        for (const platformData of seedData) {
            for (const item of platformData.list) {
                moviesToInsert.push({
                    title: item.title,
                    platform: platformData.platform,
                    type: item.type,
                    status: 'watchlist', // Padrão
                    rating: null,
                    user_id: user.id,
                    added_at: new Date().toISOString()
                });
            }
        }

        // Insere em lotes
        const { error } = await supabase.from('movies').insert(moviesToInsert);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Importados ${moviesToInsert.length} títulos com sucesso para o usuário ${user.email}!`
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
