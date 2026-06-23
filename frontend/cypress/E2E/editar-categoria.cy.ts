describe('Editar Categoria', () => {
  it('deve fazer login como admin e editar uma categoria', () => {

    cy.visit('http://localhost:5173');

    // Login Admin
    cy.get('[data-testid="home-login-button"]').click();

    cy.get('[data-testid="input-email"]').type('admin@helpdesk.com');
    cy.get('[data-testid="input-password"]').type('Helpdesk*');

    cy.get('[data-testid="login-submit-button"]').click();

    // Entrou no dashboard
    cy.contains('Dashboard');

    // Abrir menu Opções
    cy.get('[data-testid="sidebar-configuracoes"]').click();

    // Abrir modal de categorias
    cy.get('[data-testid="sidebar-cadastrar-categoria"]').click();

    // Verificar modal aberto
    cy.get('[data-testid="category-modal"]').should('be.visible');

    // Editar categoria Sistema (ID 3)
    cy.get('[data-testid="editar-categoria-3"]').click();

    // Alterar nome
    cy.get('[data-testid="categoria-nome"]')
      .clear()
      .type('Sistema Atualizado Cypress');

    // Alterar descrição
    cy.get('[data-testid="categoria-descricao"]')
      .clear()
      .type('Categoria editada automaticamente pelo Cypress');

    // Alterar SLA Atendimento
    cy.get('[data-testid="categoria-sla-atendimento"]')
      .clear()
      .type('4');

    // Alterar SLA Resolução
    cy.get('[data-testid="categoria-sla-resolucao"]')
      .clear()
      .type('48');

    // Salvar alteração
    cy.get('[data-testid="categoria-submit"]').click();

    // Modal deve fechar
    cy.get('[data-testid="category-modal"]', { timeout: 6000 })
      .should('not.exist');
  });
});