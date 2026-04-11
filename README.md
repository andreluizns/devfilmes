# DevFilme

Site de catálogo de filmes construído com React. Exibe filmes por categoria usando a API do TMDB, com autenticação de usuários, sistema de favoritos, comentários por filme e carrossel de opiniões.

---

## Funcionalidades

- Listagem de filmes em 9 categorias: Lançamentos, Populares, Ação, Drama, Comédia, Terror, Policial, Ficção Científica e Animação
- Página de detalhes do filme com sinopse, elenco principal (com fotos), gêneros, avaliação e link para trailer
- Autenticação de usuários via Supabase Auth (cadastro e login)
- Favoritos: salvar e remover filmes (requer login)
- Comentários por filme (requer login)
- Carrossel de opiniões sobre o site (com moderação)
- Rotas protegidas que redirecionam para login quando não autenticado

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + Vite |
| Estilização | Tailwind CSS + Shadcn/ui |
| API de filmes | TMDB (The Movie Database) |
| Autenticação | Supabase Auth |
| Banco de dados | Supabase (PostgreSQL) |
| HTTP Client | Axios |
| Roteamento | React Router DOM v6 |
| Testes | Vitest + React Testing Library |

---

## Pré-requisitos

- Node.js 18 ou superior
- Conta no [Supabase](https://supabase.com) com projeto criado
- Chave de API do [TMDB](https://www.themoviedb.org/settings/api)

---

## Configuração do banco de dados (Supabase)

Acesse seu projeto no Supabase → **SQL Editor** → execute os três blocos abaixo em sequência.

### 1. Criar as tabelas

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  city text,
  state text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  film_id integer not null,
  film_title text,
  film_poster text,
  created_at timestamp with time zone default now(),
  unique(user_id, film_id)
);

create table film_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  film_id integer not null,
  comment text not null,
  created_at timestamp with time zone default now()
);

create table site_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  comment text not null,
  approved boolean default false,
  created_at timestamp with time zone default now()
);
```

### 2. Habilitar RLS e criar políticas

```sql
alter table profiles enable row level security;
alter table favorites enable row level security;
alter table film_comments enable row level security;
alter table site_reviews enable row level security;

create policy "Leitura pública de perfis" on profiles for select using (true);
create policy "Usuário edita próprio perfil" on profiles for insert with check (auth.uid() = id);

create policy "Usuário gerencia favoritos" on favorites for all using (auth.uid() = user_id);

create policy "Leitura pública de comentários" on film_comments for select using (true);
create policy "Autenticados comentam" on film_comments for insert with check (auth.uid() = user_id);

create policy "Leitura de opiniões aprovadas" on site_reviews for select using (approved = true);
create policy "Autenticados enviam opiniões" on site_reviews for insert with check (auth.uid() = user_id);
```

### 3. Trigger de perfil automático

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd devfilme
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_TMDB_KEY=sua_chave_tmdb_aqui
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

- **VITE_TMDB_KEY**: obtida em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **VITE_SUPABASE_URL** e **VITE_SUPABASE_ANON_KEY**: obtidas em **Settings → API** no painel do Supabase

### 4. Executar em desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

### 5. Executar os testes

```bash
npm run test:run
```

### 6. Build de produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`.

---

## Rotas

| Rota | Página | Acesso |
|------|--------|--------|
| `/` | Home — 9 categorias + carrossel de opiniões | Público |
| `/filme/:id` | Detalhes do filme + elenco + comentários | Público |
| `/favoritos` | Filmes salvos pelo usuário | Requer login |
| `/login` | Formulário de login | Público |
| `/cadastro` | Formulário de cadastro | Público |

---

## Moderação de opiniões

As opiniões enviadas pelos usuários na Home ficam com `approved = false` por padrão. Para exibi-las no carrossel, acesse o painel do Supabase → **Table Editor** → tabela `site_reviews` → altere o campo `approved` para `true`.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── Header/           — logo, navegação, avatar/login
│   ├── MovieCard/        — card de poster com título e nota
│   ├── CategorySection/  — seção de categoria com grade de filmes
│   ├── ProtectedRoute/   — redireciona não autenticados para /login
│   ├── FilmComments/     — lista de comentários do filme
│   ├── CommentForm/      — formulário de comentário (requer login)
│   ├── ReviewsCarousel/  — carrossel de opiniões aprovadas
│   └── ReviewForm/       — formulário de opinião sobre o site
├── pages/
│   ├── Home/             — hero + categorias + carrossel
│   ├── Filme/            — detalhes, elenco, comentários
│   ├── Favoritos/        — filmes salvos do usuário
│   ├── Login/            — autenticação
│   └── Cadastro/         — registro de conta
├── hooks/
│   ├── useMovies.js      — busca filmes na TMDB por categoria
│   └── useAuth.js        — lê o estado de autenticação global
├── context/
│   └── AuthContext.jsx   — gerencia sessão do usuário via Supabase
├── services/
│   ├── api.js            — instância Axios para a TMDB
│   └── supabase.js       — cliente Supabase
└── config/
    └── categories.js     — configuração das 9 categorias de filmes
```


## Referência Técnica React

Esta seção descreve os conceitos e recursos do React utilizados no projeto, com foco no funcionamento interno dos componentes principais.

---

### Conceitos React Utilizados

#### Componentes Funcionais
Todos os componentes do projeto são **componentes funcionais** — funções JavaScript que recebem `props` e retornam JSX (a sintaxe que descreve o que deve aparecer na tela). Não há classes no projeto.

```jsx
function MovieCard({ title, poster, rating }) {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <h3>{title}</h3>
      <span>{rating}</span>
    </div>
  );
}
```

#### Props
São os dados que um componente pai passa para um componente filho. Funcionam como parâmetros de uma função. No DevFilme, a `Home` passa a configuração de cada categoria para o `CategorySection`:

```jsx
<CategorySection
  title="Ação"
  badge="ID 28"
  endpoint="discover/movie"
  params={{ with_genres: 28 }}
/>
```

#### Estado (`useState`)
O estado é uma variável que, quando alterada, faz o React re-renderizar o componente automaticamente. Usado para armazenar dados que mudam ao longo do tempo (lista de filmes carregados, se está carregando, erros, etc).

```jsx
const [filmes, setFilmes] = useState([]);      // lista começa vazia
const [loading, setLoading] = useState(true);  // inicia carregando
const [erro, setErro] = useState(null);        // sem erro inicial
```

#### Efeito Colateral (`useEffect`)
Executa código após o componente ser renderizado — ideal para chamadas à API. O array de dependências `[]` vazio significa que o efeito roda apenas uma vez, quando o componente é montado na tela.

```jsx
useEffect(() => {
  async function buscarFilmes() {
    const resposta = await api.get(endpoint, { params });
    setFilmes(resposta.data.results);
    setLoading(false);
  }
  buscarFilmes();
}, []); // ← roda só uma vez ao montar o componente
```

#### Contexto (`useContext`)
Usado pelo `useAuth.js` para disponibilizar o estado do usuário logado para qualquer componente da árvore sem precisar passar props manualmente em cada nível. O `Header`, o `CommentForm` e o `ProtectedRoute` todos leem o usuário via contexto.

#### Hooks Personalizados (Custom Hooks)
São funções que encapsulam lógica reutilizável usando outros hooks internamente. O prefixo `use` é obrigatório por convenção.

```jsx
// hooks/useMovies.js
function useMovies(endpoint, params) {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(endpoint, { params })
      .then(res => { setFilmes(res.data.results); setLoading(false); });
  }, [endpoint]);

  return { filmes, loading };
}

// Uso dentro do CategorySection:
const { filmes, loading } = useMovies("discover/movie", { with_genres: 28 });
```

#### React Router DOM
Gerencia as rotas da SPA (Single Page Application) sem recarregar a página. O `useParams()` lê o `:id` da URL na página do filme. O `useNavigate()` redireciona o usuário programaticamente (ex: após login).

```jsx
// Lendo o ID do filme na URL /filme/550
const { id } = useParams();

// Redirecionando após login bem-sucedido
const navigate = useNavigate();
navigate("/");
```

---

### Componente Principal: `CategorySection`

Este é o componente mais importante do projeto. É responsável por buscar e exibir a lista de filmes de uma categoria. Cada uma das 9 categorias da Home é uma instância independente deste componente.

**Funcionamento interno:**

```
1. Recebe props: { title, badge, endpoint, params }
2. Chama o hook useMovies(endpoint, params)
3. useMovies dispara useEffect → faz GET na TMDB via Axios
4. Resultado salvo no estado: filmes[]
5. Componente re-renderiza com a lista de filmes
6. Para cada filme, renderiza um <MovieCard />
```

**Diagrama de fluxo:**

```
Home
 └── CategorySection (título="Ação", endpoint="discover/movie", params={with_genres:28})
      ├── useMovies(endpoint, params)   ← hook busca os filmes
      │    ├── useState: filmes[]
      │    ├── useState: loading
      │    └── useEffect → GET /discover/movie?with_genres=28
      │
      ├── Se loading=true  → exibe esqueleto/spinner
      └── Se loading=false → renderiza grade com <MovieCard /> para cada filme
           └── MovieCard (poster, title, rating)
```

**Por que um único componente reutilizável é melhor que 9 componentes separados?**

Com um componente único, para adicionar uma nova categoria basta incluir uma linha no arquivo `categories.js`. Sem um componente único, cada nova categoria exigiria criar um novo arquivo, duplicar a lógica de fetch, duplicar o JSX — tornando a manutenção muito mais difícil.

---

### Componente `ProtectedRoute`

Componente que envolve as rotas que exigem login. Lê o estado do usuário via `useAuth()` e redireciona para `/login` se não houver sessão ativa.

```jsx
function ProtectedRoute({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Uso nas rotas:
<Route path="/favoritos" element={
  <ProtectedRoute>
    <Favoritos />
  </ProtectedRoute>
} />
```

---

### Hook `useAuth`

Gerencia o estado de autenticação globalmente. Usa o `useEffect` para se inscrever nas mudanças de sessão do Supabase — quando o usuário faz login ou logout, o estado `usuario` é atualizado automaticamente em todo o app.

```jsx
function useAuth() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Lê sessão atual ao carregar o app
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null);
    });

    // Escuta mudanças: login, logout, token expirado
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        setUsuario(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { usuario };
}
```

---

### Ciclo de Vida de um Componente Funcional

No contexto deste projeto, o ciclo simplificado é:

```
1. MONTAGEM     → componente aparece na tela pela primeira vez
                  useEffect com [] é executado → busca dados na API

2. ATUALIZAÇÃO  → estado muda (ex: filmes carregados, usuário faz login)
                  React re-renderiza o componente com os novos dados

3. DESMONTAGEM  → componente sai da tela (ex: usuário navega para outra página)
                  useEffect retorna função de cleanup (ex: cancela requisições pendentes)
```

---

### Resumo dos Estados por Componente

| Componente | Estado (`useState`) | Descrição |
|---|---|---|
| `CategorySection` | `filmes[]`, `loading`, `erro` | Lista de filmes da categoria |
| `Filme` | `filme{}`, `loading`, `elenco[]` | Dados do filme + créditos |
| `FilmComments` | `comentarios[]`, `loading` | Comentários do filme |
| `CommentForm` | `texto`, `enviando` | Texto digitado + status de envio |
| `ReviewsCarousel` | `reviews[]`, `loading` | Opiniões aprovadas |
| `Login` / `Cadastro` | `email`, `senha`, `erro`, `loading` | Campos do formulário + feedback |
| `useAuth` | `usuario` | Usuário autenticado (global) |
