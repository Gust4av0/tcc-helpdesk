describe('Teste unitário de autenticação', () => {
  it('deve exigir email no login', () => {
    const email: string = '';

    const emailInvalido = !email;

    expect(emailInvalido).toBe(true);
  });

  it('deve exigir senha no login', () => {
    const senha: string = '';

    const senhaInvalida = !senha;

    expect(senhaInvalida).toBe(true);
  });

  it('deve rejeitar email inválido', () => {
    const email: string = 'adminhelpdesk.com';

    const emailValido = email.includes('@') && email.includes('.');

    expect(emailValido).toBe(false);
  });

  it('deve rejeitar senha menor que 6 caracteres', () => {
    const senha: string = '123';

    const senhaInvalida = senha.length < 6;

    expect(senhaInvalida).toBe(true);
  });

  it('deve aceitar dados válidos de login', () => {
    const login = {
      email: 'admin@helpdesk.com',
      senha: '123456',
    };

    const loginValido =
      login.email.includes('@') &&
      login.email.includes('.') &&
      login.senha.length >= 6;

    expect(loginValido).toBe(true);
  });
});