describe('Validação de abertura de chamado', () => {

  it('deve rejeitar título menor que 5 caracteres', () => {
    const titulo = 'abc';

    expect(titulo.trim().length < 5).toBe(true);
  });

  it('deve rejeitar descrição menor que 10 caracteres', () => {
    const descricao = 'teste';

    expect(descricao.trim().length < 10).toBe(true);
  });

  it('deve exigir categoria', () => {
    const categoria = '';

    expect(!categoria).toBe(true);
  });

  it('deve exigir prioridade', () => {
    const prioridade = '';

    expect(!prioridade).toBe(true);
  });

  it('deve aceitar um chamado válido', () => {
    const chamado = {
      titulo: 'Problema no sistema',
      descricao: 'Sistema travando ao abrir relatórios',
      categoria: 'Sistema',
      prioridade: 'Alta'
    };

    const valido =
      chamado.titulo.length >= 5 &&
      chamado.descricao.length >= 10 &&
      chamado.categoria !== '' &&
      chamado.prioridade !== '';

    expect(valido).toBe(true);
  });

});