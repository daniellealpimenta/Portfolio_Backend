# 🚀 Portfólio Profissional — Full Stack & Mobile

Aplicação de portfólio moderna e interativa construída com **Nuxt 3 (Vue 3)**, **GSAP**, **Tailwind CSS** no Frontend e **FastAPI** com **Supabase (PostgreSQL)** no Backend.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão `18.x` ou superior)
- [Python](https://www.python.org/) (versão `3.10` ou superior)
- [uv](https://github.com/astral-sh/uv) *(opcional, mas recomendado para gerenciamento do ambiente Python)*

---

## ⚡ Passo a Passo Rápido: Rodando o Frontend (Nuxt 3)

1. **Acesse a pasta do Frontend:**
   ```bash
   cd Frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   👉 `http://localhost:3000`

---

## 🐍 Passo a Passo Rápido: Rodando o Backend (FastAPI)

1. **Na raiz do projeto, inicie o ambiente virtual e execute o servidor:**
   Com `uv`:
   ```bash
   uv run python -m uvicorn main:app --reload
   ```
   *(Ou ative o seu ambiente virtual `.venv` e rode `uvicorn main:app --reload`)*

2. **Acesse a API e Documentação Interativa:**
   - **API Root**: `http://127.0.0.1:8000`
   - **Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 🛠️ Outros Comandos Úteis do Frontend

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento na porta `3000` |
| `npm run build` | Compila a aplicação para produção em `.output` |
| `npm run preview` | Testa o build de produção localmente |

---

## 📁 Estrutura das Pastas

```text
Portfolio/
├── Core/               # Configurações de banco de dados e Supabase
├── Models/             # Modelos SQLAlchemy da base de dados
├── Routes/             # Rotas REST da FastAPI (projects, skills, etc.)
├── Schemas/            # Schemas Pydantic para validação de dados
├── Services/           # Camada de regras de negócio
├── main.py             # Ponto de entrada da API FastAPI
│
└── Frontend/           # Aplicação Nuxt 3 (Vue 3)
    ├── assets/css/     # Design System e estilos globais Tailwind
    ├── components/     # Componentes Vue 3 reutilizáveis (GlowCard, Orbit, etc.)
    ├── composables/    # Logica de estado e consumo de API (usePortfolioApi, useGsap)
    ├── layouts/        # Layout base da aplicação (default.vue)
    ├── pages/          # Rotas Nuxt (index.vue, work.vue, resume.vue)
    └── plugins/        # Efeitos de cliente (Starfield, Cursor Glow, ScrollSpy)
```