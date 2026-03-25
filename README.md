# TCC Helpdesk

Um sistema full-stack de gerenciamento de chamados (tickets) desenvolvido como trabalho de conclusão de curso (TCC). O projeto inclui um backend em Node.js/Express e um frontend em React com Vite.

## 📋 Descrição do Projeto

O TCC Helpdesk é uma aplicação web moderna para gerenciar chamados de suporte técnico. O sistema permite que os usuários criem, acompanhem e resolvam chamados, com recursos como autenticação, categorização, mensagens em tempo real e dashboard com estatísticas.

### Funcionalidades Principais

- ✅ Autenticação e autorização de usuários
- ✅ Gerenciamento de chamados (criar, editar, visualizar, fechar)
- ✅ Sistema de categorias de chamados
- ✅ Mensagens e comentários em chamados
- ✅ Dashboard com estatísticas
- ✅ Logs de alterações de chamados
- ✅ Controle de permissões por usuário
- ✅ Integração com banco de dados MySQL

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior): [Download Node.js](https://nodejs.org/)
- **npm** ou **yarn**: Gerenciador de pacotes (já vem com Node.js)
- **Docker** e **Docker Compose**: [Download Docker](https://www.docker.com/products/docker-desktop)
- **Git**: [Download Git](https://git-scm.com/)

### Verificar Instalação

```bash
node --version
npm --version
docker --version
docker-compose --version
```

## ⚙️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd tcc-helpdesk
```

### 2. Configurar Variáveis de Ambiente

#### Backend

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=helpdesk

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
```

#### Frontend

Crie um arquivo `.env` na pasta `frontend/` com:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Instalar Dependências

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

## 🚀 Como Executar o Projeto

### Opção 1: Com Docker (Recomendado)

#### Iniciar o Banco de Dados MySQL

```bash
cd backend
docker-compose up -d
```

Este comando:
- Inicia um contêiner MySQL na porta 3306
- Cria o banco de dados `helpdesk`
- Define a senha root como `root`

Aguarde 10-15 segundos para o MySQL estar pronto.

#### Abrir 2 Terminais

**Terminal 1 - Backend (na pasta `backend`):**

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

**Terminal 2 - Frontend (na pasta `frontend`):**

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Opção 2: Sem Docker (com MySQL local)

1. **Instale o MySQL** localmente em sua máquina
2. **Crie o banco de dados** `helpdesk`
3. **Configure as variáveis de ambiente** no `.env` com seus dados de conexão
4. Execute os comandos de inicialização descritos acima

### Parar os Serviços

```bash
# Parar o Docker
cd backend
docker-compose down

# Para fechar os servidores de desenvolvimento
# Pressione Ctrl + C em cada terminal
```

## 📁 Estrutura do Projeto

```
tcc-helpdesk/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Arquivo principal do servidor
│   │   ├── config/
│   │   │   ├── auth.ts              # Configuração de autenticação
│   │   │   └── database.ts          # Configuração do Sequelize
│   │   ├── controllers/              # Lógica de negócio
│   │   │   ├── authController.ts
│   │   │   ├── usuarioController.ts
│   │   │   ├── chamadoController.ts
│   │   │   ├── categoriaController.ts
│   │   │   └── ...
│   │   ├── models/                   # Modelos do banco de dados
│   │   │   ├── Usuario.ts
│   │   │   ├── Chamado.ts
│   │   │   ├── Categoria.ts
│   │   │   └── ...
│   │   ├── routes/                   # Rotas da API
│   │   │   ├── authRoutes.ts
│   │   │   ├── chamadoRoutes.ts
│   │   │   └── ...
│   │   ├── middlewares/              # Middlewares personalizados
│   │   │   ├── authMiddleware.ts
│   │   │   └── permissaoMiddleware.ts
│   │   ├── utils/                    # Funções utilitárias
│   │   └── database/
│   │       └── seed.ts              # Dados iniciais do banco
│   ├── docker-compose.yml            # Configuração do Docker
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── main.tsx                 # Ponto de entrada
│   │   ├── components/              # Componentes reutilizáveis
│   │   ├── pages/                   # Páginas da aplicação
│   │   ├── services/                # Serviços (requisições API)
│   │   └── assets/                  # Imagens e recursos estáticos
│   ├── public/                       # Arquivos públicos
│   ├── vite.config.ts               # Configuração do Vite
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 📚 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem com tipos
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **CORS** - Compartilhamento de recursos entre origens

### Frontend
- **React** - Biblioteca UI
- **TypeScript** - Linguagem com tipos
- **Vite** - Build tool e dev server
- **ESLint** - Linter de código
- **CSS** - Estilização

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📡 Principais Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

### Usuários
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/:id` - Obter usuário por ID
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Chamados
- `GET /api/chamados` - Listar chamados
- `POST /api/chamados` - Criar novo chamado
- `GET /api/chamados/:id` - Obter chamado por ID
- `PUT /api/chamados/:id` - Atualizar chamado
- `DELETE /api/chamados/:id` - Deletar chamado

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

### Dashboard
- `GET /api/dashboard` - Obter estatísticas do dashboard

## 🔐 Autenticação

O projeto utiliza **JWT (JSON Web Tokens)** para autenticação. 

- O token é enviado no header `Authorization: Bearer <token>`
- Os tokens expiram após 7 dias (configurável no `.env`)
- Senhas são criptografadas com bcrypt

## 🐛 Solução de Problemas

### Erro de Conexão no Banco de Dados

**Problema**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solução**:
```bash
# Certifique-se de que o Docker está rodando
docker-compose up -d
# Aguarde 15 segundos para o MySQL iniciar
```

### Porta 3306 já em uso

```bash
# Parar containers Docker existentes
docker-compose down
```

### Erro de CORS

Certifique-se de que a URL de origem está configurada corretamente em `VITE_API_URL`.

### Build falha no Frontend

```bash
# Limpe o cache
rm -rf node_modules
npm install
npm run build
```

## 📝 Scripts Disponíveis

### Backend

```bash
npm run dev      # Iniciar servidor em modo desenvolvimento
npm test         # Executar testes
```

### Frontend

```bash
npm run dev      # Iniciar dev server
npm run build    # Compilar para produção
npm run lint     # Verificar código com ESLint
npm run preview  # Visualizar build de produção
```

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo LICENSE para detalhes.

## 👥 Autores

- **Gustavo Marcolin Soares**
- **Anderson Cirino** 

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através de [gustavomarcolin2005@gmail.com](mailto:seu-email@exemplo.com)

---

**Última atualização**: Março de 2026

Desenvolvido com ❤️ como Trabalho de Conclusão de Curso
