# Modelagem DER e Diagrama de Classes - HelpDesk

Este arquivo foi gerado com base no projeto atual. Para usar no draw.io/diagrams.net, copie o bloco Mermaid desejado e importe em:

`Inserir > Avancado > Mermaid`

## DER - Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha
        string tipo "ADMIN | SUPORTE | CLIENTE"
        string cpf_cnpj
        string telefone
        date data_nascimento
        string cep
    }

    CATEGORIAS {
        int id PK
        string nome
        string descricao
        int sla_atendimento "horas"
        int sla_resolucao "horas"
        datetime created_at
    }

    CHAMADOS {
        int id PK
        string titulo
        text descricao
        enum status "NOVO | ATRIBUIDO | EM_ATENDIMENTO | FINALIZADO | FECHADO"
        int usuario_id FK
        int tecnico_id FK
        int categoria_id FK
        enum prioridade "BAIXA | MEDIA | ALTA | URGENTE"
        datetime data_abertura
        datetime prazo_atendimento
        datetime prazo_resolucao
    }

    CHAMADO_MENSAGENS {
        int id PK
        int chamado_id FK
        int usuario_id FK
        text mensagem
        longtext anexo
        datetime created_at
    }

    CHAMADO_LOGS {
        int id PK
        int chamado_id FK
        string status_anterior
        string status_novo
        int usuario_id FK
        string acao
        string descricao
        datetime created_at
    }

    USUARIOS ||--o{ CHAMADOS : "abre como cliente"
    USUARIOS ||--o{ CHAMADOS : "atende como tecnico"
    CATEGORIAS ||--o{ CHAMADOS : "classifica e define SLA"
    CHAMADOS ||--o{ CHAMADO_MENSAGENS : "possui conversa"
    USUARIOS ||--o{ CHAMADO_MENSAGENS : "envia"
    CHAMADOS ||--o{ CHAMADO_LOGS : "possui historico"
    USUARIOS ||--o{ CHAMADO_LOGS : "executa acao"
```

## Diagrama de Classes

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nome
        +string email
        +string senha
        +string tipo
        +string cpf_cnpj
        +string telefone
        +date data_nascimento
        +string cep
    }

    class Categoria {
        +int id
        +string nome
        +string descricao
        +int sla_atendimento
        +int sla_resolucao
        +datetime created_at
    }

    class Chamado {
        +int id
        +string titulo
        +text descricao
        +StatusChamado status
        +int usuario_id
        +int tecnico_id
        +int categoria_id
        +Prioridade prioridade
        +datetime data_abertura
        +datetime prazo_atendimento
        +datetime prazo_resolucao
        +criarChamado()
        +listarChamados()
        +buscarChamado()
        +atualizarChamado()
        +atribuirChamado()
        +deletarChamado()
    }

    class ChamadoMensagem {
        +int id
        +int chamado_id
        +int usuario_id
        +text mensagem
        +longtext anexo
        +datetime created_at
        +criarMensagem()
        +listarMensagens()
        +listarResumoMensagens()
    }

    class ChamadoLog {
        +int id
        +int chamado_id
        +string status_anterior
        +string status_novo
        +int usuario_id
        +string acao
        +string descricao
        +datetime created_at
        +registrarLog()
    }

    class StatusChamado {
        <<enumeration>>
        NOVO
        ATRIBUIDO
        EM_ATENDIMENTO
        FINALIZADO
        FECHADO
    }

    class Prioridade {
        <<enumeration>>
        BAIXA
        MEDIA
        ALTA
        URGENTE
    }

    class TipoUsuario {
        <<enumeration>>
        ADMIN
        SUPORTE
        CLIENTE
    }

    Usuario "1" --> "0..*" Chamado : abre
    Usuario "0..1" --> "0..*" Chamado : atende
    Categoria "1" --> "0..*" Chamado : categoriza
    Chamado "1" --> "0..*" ChamadoMensagem : mensagens
    Usuario "1" --> "0..*" ChamadoMensagem : envia
    Chamado "1" --> "0..*" ChamadoLog : historico
    Usuario "0..1" --> "0..*" ChamadoLog : responsavel
    Usuario --> TipoUsuario
    Chamado --> StatusChamado
    Chamado --> Prioridade
```

## Regras de Negocio Representadas

- Um usuario pode ser `ADMIN`, `SUPORTE` ou `CLIENTE`.
- O cliente abre chamados e visualiza somente os proprios chamados.
- O tecnico de suporte atende chamados atribuidos a ele.
- O administrador pode gerenciar chamados, usuarios, categorias e reabrir chamados encerrados.
- Cada chamado pertence a uma categoria, e a categoria define os SLAs de atendimento e resolucao.
- Ao criar um chamado, o sistema calcula `prazo_atendimento` e `prazo_resolucao` com base no SLA da categoria.
- O ciclo de status do chamado e: `NOVO`, `ATRIBUIDO`, `EM_ATENDIMENTO`, `FINALIZADO` e `FECHADO`.
- Mensagens e anexos ficam associados ao chamado, formando a conversa do atendimento.
- Logs registram a criacao, atribuicao, alteracoes de status, validacao do cliente e exclusao.

## Cardinalidades

- `USUARIOS 1:N CHAMADOS` como cliente: um usuario pode abrir varios chamados.
- `USUARIOS 1:N CHAMADOS` como tecnico: um tecnico pode atender varios chamados; o chamado pode ficar sem tecnico no inicio.
- `CATEGORIAS 1:N CHAMADOS`: uma categoria pode classificar varios chamados.
- `CHAMADOS 1:N CHAMADO_MENSAGENS`: um chamado pode conter varias mensagens.
- `USUARIOS 1:N CHAMADO_MENSAGENS`: um usuario pode enviar varias mensagens.
- `CHAMADOS 1:N CHAMADO_LOGS`: um chamado pode ter varios registros de historico.
- `USUARIOS 0..1:N CHAMADO_LOGS`: um log pode ser associado ao usuario que executou a acao.
