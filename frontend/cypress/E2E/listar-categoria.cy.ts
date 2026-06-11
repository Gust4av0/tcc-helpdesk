describe('Listar Categorias', () => {
  it('deve fazer login como admin e encontrar uma categoria cadastrada na lista', () => {

    // Acessa a aplicação
    cy.visit('http://localhost:5173');

    // Abre a tela de login
    cy.get('[data-testid="home-login-button"]').click();

    // Preenche email do administrador
    cy.get('[data-testid="input-email"]').type('admin@helpdesk.com');

    // Preenche senha do administrador
    cy.get('[data-testid="input-password"]').type('123456');

    // Realiza login
    cy.get('[data-testid="login-submit-button"]').click();

    // Confirma que entrou no dashboard
    cy.contains('Dashboard');

    // Abre o menu de configurações
    cy.get('[data-testid="sidebar-configuracoes"]').click();

    // Abre o modal de categorias
    cy.get('[data-testid="sidebar-cadastrar-categoria"]').click();

    // Verifica se o modal abriu corretamente
    cy.get('[data-testid="category-modal"]').should('be.visible');

    // Verifica se a seção de categorias cadastradas existe
    cy.contains('Categorias cadastradas').should('be.visible');

    // Procura a categoria Infraestrutura na lista
    cy.contains('.categorias-item', 'Infraestrutura')

      // Faz scroll até ela caso esteja fora da área visível
      .scrollIntoView()

      // Confirma que a categoria está visível
      .should('be.visible');
  });
});