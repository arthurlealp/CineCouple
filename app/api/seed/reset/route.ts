import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Limpa TODOS os filmes do usuário atual
 * Use com cuidado!
 */
export async function GET() {
    const supabase = createClient();

    // Verifica se usuário está logado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Você precisa estar logado!" }, { status: 401 });
    }

    try {
        // Deleta todos os filmes do usuário
        const { error } = await supabase
            .from('movies')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "Catálogo limpo! Agora você pode acessar /api/seed para reimportar."
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
