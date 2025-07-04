export function validarRut(rut: string): boolean {
  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/\./g, '').replace('-', '');

  // Verificar que tenga al menos 2 caracteres (cuerpo + dv)
  if (rutLimpio.length < 2) return false;

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();

  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) return false;

  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperado = 11 - resto;

  let dvCalculado = '';
  if (dvEsperado === 11) {
    dvCalculado = '0';
  } else if (dvEsperado === 10) {
    dvCalculado = 'k';
  } else {
    dvCalculado = dvEsperado.toString();
  }

  return dv === dvCalculado;
}