# 🎬 CineCouple - Guia de Início

Bem-vindo ao projeto CineCouple! Aqui está o guia passo a passo para colocar tudo para rodar.

## 1. Configuração do Banco de Dados (Supabase)

O projeto precisa de um backend para funcionar. Vamos usar o Supabase (gratuito).

1. Acesse [database.new](https://database.new) e crie um novo projeto.
2. Aguarde alguns minutos até o banco ser criado.
3. No painel do projeto, vá em **Project Settings (ícone de engrenagem) > API**.
4. Você vai precisar de duas informações:
   - **Project URL**
   - **anon public** (API Key)

## 2. Configurando o Projeto Local

1. Abra o arquivo `.env.local` na raiz deste projeto.
2. Substitua os valores placeholder pelas suas chaves reais:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## 3. Criando as Tabelas (Schema)

Para o sistema funcionar, precisamos criar a tabela de filmes no banco.

1. No Supabase, vá em **SQL Editor** (ícone de terminal/código na barra lateral).
2. Cole o código abaixo e clique em **RUN**:

```sql
-- Criação da tabela de filmes
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('netflix', 'disney', 'hbo')),
  type TEXT NOT NULL CHECK (type IN ('movie', 'series', 'saga')),
  status TEXT NOT NULL DEFAULT 'watchlist' CHECK (status IN ('watchlist', 'watched', 'abandoned')),
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  watched_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices e Segurança
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_user ON movies(user_id);
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Cada casal vê apenas seus filmes)
CREATE POLICY "Users can view own movies" ON movies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own movies" ON movies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own movies" ON movies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own movies" ON movies FOR DELETE USING (auth.uid() = user_id);
```

## 4. Rodando o Projeto

Agora sim! No terminal do VS Code:

```bash
npm run dev
```

O projeto estará rodando em: [http://localhost:3000](http://localhost:3000)

## 5. Importando Filmes Iniciais

1. Crie uma conta no site (Registre-se).
2. Depois de logado, acesse no navegador: `http://localhost:3000/api/seed`
3. Isso vai carregar os 88 títulos iniciais automaticamente!

---

**Dúvidas?** Consulte este arquivo sempre que precisar.
