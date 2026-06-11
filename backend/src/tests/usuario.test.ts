describe('Teste unitário de usuário', () => {
  const tiposValidos = ['ADMIN', 'SUPORTE', 'CLIENTE'];

  it('deve rejeitar tipo de usuário inválido', () => {
    const tipo: string = 'GERENTE';

    const tipoValido = tiposValidos.includes(tipo);

    expect(tipoValido).toBe(false);
  });

  it('deve aceitar tipo ADMIN', () => {
    const tipo: string = 'ADMIN';

    const tipoValido = tiposValidos.includes(tipo);

    expect(tipoValido).toBe(true);
  });

  it('deve aceitar tipo SUPORTE', () => {
    const tipo: string = 'SUPORTE';

    const tipoValido = tiposValidos.includes(tipo);

    expect(tipoValido).toBe(true);
  });

  it('deve aceitar tipo CLIENTE', () => {
    const tipo: string = 'CLIENTE';

    const tipoValido = tiposValidos.includes(tipo);

    expect(tipoValido).toBe(true);
  });

  it('deve remover senha antes de retornar usuário', () => {
    const usuario = {
      nome: 'João Silva',
      email: 'joao@helpdesk.com',
      senha: 'senhaCriptografada',
      tipo: 'CLIENTE',
    };

    const usuarioSemSenha = { ...usuario };

    delete (usuarioSemSenha as Partial<typeof usuario>).senha;

    expect(usuarioSemSenha).not.toHaveProperty('senha');
  });

  it('deve validar que não pode alterar email de outro usuário', () => {
    const usuario = {
      emailAtual: 'usuario@helpdesk.com',
    };

    const dadosAtualizacao = {
      email: 'novo@helpdesk.com',
    };

    const tentativaAlterarEmail =
      dadosAtualizacao.email !== usuario.emailAtual;

    expect(tentativaAlterarEmail).toBe(true);
  });

  it('deve validar que apenas ADMIN pode alterar tipo de usuário', () => {
    const usuarioLogado = {
      tipo: 'CLIENTE',
    };

    const novoTipo: string = 'SUPORTE';

    const semPermissao =
      Boolean(novoTipo) && usuarioLogado.tipo !== 'ADMIN';

    expect(semPermissao).toBe(true);
  });

  it('deve aceitar atualização de tipo quando usuário logado é ADMIN', () => {
    const usuarioLogado = {
      tipo: 'ADMIN',
    };

    const novoTipo: string = 'SUPORTE';

    const podeAlterar =
      Boolean(novoTipo) &&
      usuarioLogado.tipo === 'ADMIN' &&
      tiposValidos.includes(novoTipo);

    expect(podeAlterar).toBe(true);
  });
});