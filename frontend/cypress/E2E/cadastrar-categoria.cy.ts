describe('Cadastrar Categoria', () => {
  it('deve fazer login como admin e cadastrar uma nova categoria', () => {

    cy.visit('http://localhost:5173');

    // Login Admin
    cy.get('[data-testid="home-login-button"]').click();

    cy.get('[data-testid="input-email"]').type('admin@helpdesk.com');
    cy.get('[data-testid="input-password"]').type('123456');

    cy.get('[data-testid="login-submit-button"]').click();

    // Garantir que entrou no dashboard
    cy.contains('Dashboard');

    // Abrir menu Opções
    cy.get('[data-testid="sidebar-configuracoes"]').click();

    // Abrir modal de categorias
    cy.get('[data-testid="sidebar-cadastrar-categoria"]').click();

    // Verificar modal aberto
    cy.get('[data-testid="category-modal"]')
      .should('be.visible');

    // Preencher formulário
    cy.get('[data-testid="categoria-nome"]')
      .type(`Categoria Cypress ${Date.now()}`);

    cy.get('[data-testid="categoria-descricao"]')
      .type('Categoria criada automaticamente pelo Cypress');

    cy.get('[data-testid="categoria-sla-atendimento"]')
      .type('2');

    cy.get('[data-testid="categoria-sla-resolucao"]')
      .type('24');

    // Enviar cadastro
    cy.get('[data-testid="categoria-submit"]')
      .click();

    // Validar que o modal fechou
    cy.get('[data-testid="category-modal"]', { timeout: 6000 })
      .should('not.exist');
  });
});