export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCnpj(value: string) {
  return onlyDigits(value)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskCpfCnpj(value: string) {
  return onlyDigits(value).length > 11 ? maskCnpj(value) : maskCpf(value);
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function maskDate(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

export function maskCep(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function isBlank(value?: string) {
  return !value || value.trim().length === 0;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
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

export function isValidDate(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return false;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function dateMaskToIso(value: string) {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return "";
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}
