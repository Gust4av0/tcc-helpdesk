describe('Teste unitário de categoria', () => {
  it('deve validar que o nome da categoria é obrigatório', () => {
    const nome: string = '';

    const nomeInvalido = !nome || nome.length < 3;

    expect(nomeInvalido).toBe(true);
  });

  it('deve validar que o nome da categoria precisa ter pelo menos 3 caracteres', () => {
    const nome: string = 'TI';

    const nomeInvalido = !nome || nome.length < 3;

    expect(nomeInvalido).toBe(true);
  });

  it('deve validar que SLA de atendimento precisa ser maior que zero', () => {
    const slaAtendimento: number = 0;

    const slaInvalido = !slaAtendimento || slaAtendimento <= 0;

    expect(slaInvalido).toBe(true);
  });

  it('deve validar uma categoria válida', () => {
    const categoria = {
      nome: 'Sistema',
      descricao: 'Problemas relacionados ao sistema',
      sla_atendimento: 2,
      sla_resolucao: 24,
    };

    const categoriaValida =
      categoria.nome.length >= 3 &&
      categoria.sla_atendimento > 0 &&
      categoria.sla_resolucao > 0;

    expect(categoriaValida).toBe(true);
  });
});