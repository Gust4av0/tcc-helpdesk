describe('Abrir Chamado', () => {
  it('deve fazer login e abrir o modal preenchendo o formulário', () => {

    cy.visit('http://localhost:5173');

    // Ir para login   
    cy.get('[data-testid="home-login-button"]').click();

    // Login
    cy.get('[data-testid="input-email"]').type('cliente@helpdesk.com');
    cy.get('[data-testid="input-password"]').type('123456');

    // Entrar
    cy.get('[data-testid="login-submit-button"]').click();

    // Espera carregar dashboard
    cy.contains('Dashboard');

    // Abrir modal
    cy.get('[data-testid="open-ticket-button"]').click();

    // Modal aberto
    cy.get('[data-testid="open-ticket-modal"]')
      .should('be.visible');

    // Preencher formulário
    cy.get('[data-testid="input-title"]')
      .type('Problema no sistema');

    cy.get('[data-testid="input-description"]')
      .type('Sistema travando constantemente ao abrir relatórios.');

    // Categoria criada no banco
    cy.get('[data-testid="select-category"]')
      .select('Infraestrutura');

    // Prioridade agora é botão
    cy.contains('button', 'Alta')
      .click();

    // Enviar
    cy.get('[data-testid="submit-button"]')
      .click();

    // Modal fecha após criar chamado
    cy.get('[data-testid="open-ticket-modal"]', {
      timeout: 10000,
    }).should('not.exist');
  });
});