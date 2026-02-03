import { createClient } from "@supabase/supabase-js";
import seedData from "./seed-data.json";

// Este script deve ser rodado com ts-node ou similar, fora do Next.js
// Ex: npx ts-node lib/seed.ts
// Certifique-se de configurar as variáveis de ambiente antes

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// OBS: Em produção/real, melhor usar a SERVICE_ROLE_KEY para ignorar RLS,
// mas aqui vamos assumir que o usuário vai logar primeiro ou usar a anon key temporariamente.

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Faltam variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
    console.log("🎬 Iniciando importação do catálogo...");

    // 1. Precisamos de um usuário para associar os filmes
    // Vou pegar o primeiro usuário que encontrar, ou você pode hardcodar um ID específico
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    // Como não temos a service role key exposta facilmente no client, vamos instruir o usuário
    // a rodar isso de outra forma ou criar uma API route temporária.
    // Vou criar uma API Route no Next.js que é mais fácil para você rodar!

    console.log("⚠️ Este script é apenas um modelo. Use a rota /api/seed para rodar a importação!");
}

seed();
