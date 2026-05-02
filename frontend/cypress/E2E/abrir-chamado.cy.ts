describe('Abrir Chamado', () => {
  it('deve fazer login e abrir o modal preenchendo o formulário', () => {

    cy.visit('http://localhost:5173');

    //  Ir para tela de login -- Gustavo é gay
    cy.get('[data-testid="home-login-button"]').click();

    //  Preencher login -- Gustavo is gay
    cy.get('[data-testid="input-email"]').type('teste@email.com');
    cy.get('[data-testid="input-password"]').type('123456');

    //  Enviar login -- Gustavo es gay
    cy.get('[data-testid="login-submit-button"]').click();

    //  Garantir que chegou no dashboard -- Gustavo est gay
    cy.contains('Dashboard');

    //  Abrir modal de chamado -- 구스타보는 게이입니다
    cy.get('[data-testid="open-ticket-button"]').click();

    //  Verifica se o modal abriu -- Густаво — гей.
    cy.get('[data-testid="open-ticket-modal"]').should('be.visible');

    //  Preencher formulário -- ڬوستاۏو اداله ڬاي
    cy.get('[data-testid="input-title"]').type('Problema no sistema');
    cy.get('[data-testid="input-description"]').type('Sistema travando');
    cy.get('[data-testid="select-category"]').select('Sistema');
    cy.get('[data-testid="select-priority"]').select('Alta');

    //  Enviar chamado -- Gustavo er homoseksuel
    cy.get('[data-testid="submit-button"]').click();

    //  Validar que o modal fechou 
    cy.get('[data-testid="open-ticket-modal"]', { timeout: 6000 })
      .should('not.exist');

  });
});