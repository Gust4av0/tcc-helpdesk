describe('Excluir Categoria', () => {
  it('deve fazer login como admin, criar e excluir uma categoria', () => {
    // Cria um nome único para não dar conflito com categorias existentes
    const categoriaNome = `Categoria Excluir Cypress ${Date.now()}`;

    // Acessa a aplicação
    cy.visit('http://localhost:5173');

    cy.wait(1000);

    // Vai para a tela de login
    cy.get('[data-testid="home-login-button"]').click();

    cy.wait(1000);

    // Faz login como admin
    cy.get('[data-testid="input-email"]')
      .type('admin@helpdesk.com', { delay: 100 });

    cy.get('[data-testid="input-password"]')
      .type('123456', { delay: 100 });

    cy.wait(1000);

    cy.get('[data-testid="login-submit-button"]').click();

    // Garante que entrou no dashboard
    cy.contains('Dashboard');

    cy.wait(1500);

    // Abre o menu Opções
    cy.get('[data-testid="sidebar-configuracoes"]').click();

    cy.wait(1000);

    // Abre o modal de categoria
    cy.get('[data-testid="sidebar-cadastrar-categoria"]').click();

    // Confirma que o modal abriu
    cy.get('[data-testid="category-modal"]').should('be.visible');

    cy.wait(1000);

    // Preenche os dados da categoria temporária
    cy.get('[data-testid="categoria-nome"]')
      .type(categoriaNome, { delay: 80 });

    cy.get('[data-testid="categoria-descricao"]')
      .type('Categoria criada para teste de exclusão', { delay: 50 });

    cy.get('[data-testid="categoria-sla-atendimento"]')
      .type('2', { delay: 100 });

    cy.get('[data-testid="categoria-sla-resolucao"]')
      .type('24', { delay: 100 });

    cy.wait(1500);

    // Cadastra a categoria
    cy.get('[data-testid="categoria-submit"]').click();

    // Dá tempo para visualizar a criação
    cy.wait(3000);

    // Garante que o modal fechou depois do cadastro
    cy.get('[data-testid="category-modal"]', { timeout: 10000 })
      .should('not.exist');

    // Recarrega a página para garantir que a lista venha atualizada
    cy.reload();

    cy.wait(2000);

    // Depois do reload, garante que ainda está no Dashboard
    cy.contains('Dashboard');

    // Abre novamente o menu Opções
    cy.get('[data-testid="sidebar-configuracoes"]').click();

    cy.wait(1000);

    // Abre novamente o modal de categoria
    cy.get('[data-testid="sidebar-cadastrar-categoria"]').click();

    // Confirma que o modal abriu novamente
    cy.get('[data-testid="category-modal"]').should('be.visible');

    cy.wait(2000);

    // Procura a categoria criada pelo nome
    cy.contains('.categorias-item', categoriaNome)
      .scrollIntoView();

    cy.wait(2000);

    // Clica em Excluir na categoria criada
    cy.contains('.categorias-item', categoriaNome)
      .find('.categorias-item-delete')
      .click();

    // Dá tempo para visualizar a exclusão
    cy.wait(3000);

    // Garante que a categoria sumiu da lista
    cy.contains(categoriaNome).should('not.exist');
  });
});