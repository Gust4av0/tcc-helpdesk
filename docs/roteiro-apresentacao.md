# Roteiro de Apresentacao do Produto - HelpDesk

## Slide 1 - Nome do Produto

**HelpDesk - Sistema de Gestao de Suporte Tecnico**

Apresente o produto como uma plataforma para organizar chamados, usuarios, tecnicos, SLAs e comunicacao entre cliente e suporte em um unico ambiente.

## Slide 2 - Problema Identificado

Muitas equipes de suporte perdem controle sobre solicitacoes quando usam planilhas, mensagens soltas ou processos manuais.

Principais dores:

- Dificuldade para saber quais chamados estao abertos, atrasados ou urgentes.
- Falta de visibilidade sobre quem esta atendendo cada solicitacao.
- Comunicacao espalhada fora do historico do chamado.
- Ausencia de prazos claros de atendimento e resolucao.
- Pouco controle sobre categorias, prioridades e responsabilidades.

## Slide 3 - Proposta de Solucao

O HelpDesk centraliza o fluxo de atendimento tecnico.

Ele permite que clientes abram chamados, que administradores organizem categorias e tecnicos, e que a equipe de suporte acompanhe os atendimentos com status, prioridade, SLA, conversa e historico.

## Slide 4 - Publico-Alvo

O produto atende empresas, setores internos de TI, assistencias tecnicas e equipes que precisam registrar, acompanhar e resolver solicitacoes de suporte.

Perfis do sistema:

- **Cliente:** abre chamados, acompanha respostas e valida a solucao.
- **Suporte:** atende chamados atribuidos e conversa com o cliente.
- **Administrador:** gerencia usuarios, categorias, tecnicos, atribuicoes e indicadores.

## Slide 5 - Funcionalidades Principais

- Cadastro e login de usuarios com autenticacao.
- Controle de perfis: `ADMIN`, `SUPORTE` e `CLIENTE`.
- Abertura de chamados com titulo, descricao, categoria e prioridade.
- Categorias com SLA de atendimento e SLA de resolucao.
- Calculo automatico dos prazos do chamado.
- Listagem com filtros por status, prioridade, data e busca textual.
- Atribuicao de chamados para tecnicos.
- Conversa dentro do chamado, com suporte a anexos de imagem e PDF.
- Historico de atividades do chamado.
- Dashboard com metricas operacionais.

## Slide 6 - Fluxo de Atendimento

1. O cliente acessa o sistema e abre um chamado.
2. O chamado nasce com status `NOVO`, prioridade e prazos de SLA.
3. Administrador ou suporte visualiza a fila e atribui um tecnico.
4. O chamado passa para `ATRIBUIDO`.
5. O tecnico inicia o atendimento e altera para `EM_ATENDIMENTO`.
6. Cliente e suporte conversam dentro do chamado.
7. O tecnico finaliza o atendimento.
8. O cliente aprova e fecha o chamado ou reabre caso ainda exista problema.

## Slide 7 - Como Resolve o Problema

O sistema resolve o problema porque transforma um processo disperso em um fluxo controlado.

- Chamados ficam organizados por status, prioridade, categoria e tecnico.
- O SLA fica visivel, ajudando a priorizar atendimentos atrasados ou proximos do vencimento.
- A conversa fica registrada no proprio chamado.
- O historico permite auditar quem alterou o status ou executou uma acao.
- O dashboard mostra a situacao geral da operacao em tempo real.

## Slide 8 - Experiencia do Usuario

A experiencia foi pensada para uso diario e rapido.

Na tela inicial, o usuario entende que o sistema e voltado para gestao de suporte tecnico. Depois do login, ele entra em um dashboard com indicadores, filtros, tabela de chamados e acoes principais.

Pontos de experiencia:

- Interface centralizada em dashboard.
- Botao direto para abrir chamado.
- Filtros para encontrar chamados rapidamente.
- Tabela com status, prioridade, SLA, data e tecnico.
- Modal de detalhes com resumo, conversa e historico.
- Alertas visuais para chamados urgentes, atrasados ou proximos do prazo.
- Notificacoes quando novas respostas chegam.

## Slide 9 - Experiencia por Perfil

**Cliente**

O cliente consegue abrir chamados, acompanhar seus proprios tickets, enviar mensagens e anexos, validar uma solucao finalizada, fechar ou reabrir o atendimento.

**Suporte**

O tecnico visualiza chamados atribuidos a ele, acompanha prazos, conversa com o cliente, inicia e finaliza atendimentos.

**Administrador**

O administrador tem visao ampla da operacao, gerencia usuarios, categorias, tecnicos disponiveis e atribuicao de chamados.

## Slide 10 - Diferenciais do Produto

- SLA calculado automaticamente por categoria.
- Validacao do cliente antes do fechamento definitivo.
- Historico de atividades para rastreabilidade.
- Conversa e anexos dentro do proprio chamado.
- Indicadores de chamados novos, em atendimento, urgentes, finalizados, atrasados e proximos do vencimento.
- Separacao clara de permissoes por perfil.

## Slide 11 - Arquitetura e Tecnologias

O projeto usa uma arquitetura web separada entre frontend e backend.

- **Frontend:** React, TypeScript e Vite.
- **Backend:** Node.js, Express, TypeScript e Sequelize.
- **Banco de dados:** modelado por entidades como usuarios, chamados, categorias, mensagens e logs.
- **Autenticacao:** JWT.
- **Seguranca de senha:** hash com bcrypt.
- **Documentacao da API:** Swagger configurado no backend.

## Slide 12 - Demonstracao Sugerida

Durante a apresentacao, uma boa ordem de demonstracao e:

1. Mostrar tela inicial, login e cadastro.
2. Entrar como administrador e apresentar o dashboard.
3. Cadastrar ou mostrar categorias com SLA.
4. Abrir um chamado como cliente.
5. Atribuir o chamado a um tecnico.
6. Iniciar atendimento, enviar mensagem e anexo.
7. Finalizar o chamado.
8. Validar como cliente, fechando ou reabrindo.
9. Mostrar historico e metricas atualizadas.

## Slide 13 - Conclusao

O HelpDesk entrega uma solucao completa para atendimento tecnico, reduzindo desorganizacao, aumentando visibilidade operacional e melhorando a comunicacao entre cliente e suporte.

A principal entrega de valor e permitir que cada chamado tenha responsavel, prazo, conversa, historico e status claro do inicio ao fechamento.
