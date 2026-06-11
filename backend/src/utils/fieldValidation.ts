export function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

export function isBlank(value?: string) {
  return !value || String(value).trim().length === 0;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

export function isStrongPassword(value: string) {
  return /[A-Z]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    const total = base
      .split("")
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return (
    calcDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcDigit(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base: string, factors: number[]) => {
    const total = base
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * factors[index], 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstDigit = calcDigit(cnpj.slice(0, 12), [
    5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ]);
  const secondDigit = calcDigit(cnpj.slice(0, 13), [
    6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ]);

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
}

export function isValidCpfCnpj(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 11 ? isValidCpf(digits) : isValidCnpj(digits);
}

export function isValidPhone(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidCep(value: string) {
  return onlyDigits(value).length === 8;
}

export function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function validateUserFields(data: {
  nome?: string;
  email?: string;
  senha?: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
  requireDetails?: boolean;
}) {
  if (data.nome !== undefined && isBlank(data.nome)) {
    return "Nome é obrigatório";
  }

  if (data.email !== undefined) {
    if (isBlank(data.email)) return "E-mail é obrigatório";
    if (!isValidEmail(data.email)) return "E-mail inválido";
  }

  if (data.senha !== undefined) {
    if (isBlank(data.senha)) return "Senha é obrigatória";
    if (data.senha.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (!isStrongPassword(data.senha)) {
      return "Senha deve ter 1 letra maiúscula e 1 caractere especial";
    }
  }

  if (data.requireDetails) {
    if (isBlank(data.cpf_cnpj)) return "CPF/CNPJ é obrigatório";
    if (isBlank(data.telefone)) return "Telefone é obrigatório";
    if (isBlank(data.data_nascimento)) return "Data é obrigatória";
    if (isBlank(data.cep)) return "CEP é obrigatório";
  }

  if (data.cpf_cnpj && !isValidCpfCnpj(data.cpf_cnpj)) {
    return "CPF/CNPJ inválido ou inexistente";
  }

  if (data.telefone && !isValidPhone(data.telefone)) {
    return "Telefone inválido";
  }

  if (data.data_nascimento && !isValidIsoDate(data.data_nascimento)) {
    return "Data inválida";
  }

  if (data.cep && !isValidCep(data.cep)) {
    return "CEP inválido";
  }

  return null;
}
