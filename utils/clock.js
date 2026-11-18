/**
 * Reloj inyectable.
 * La hora es un dato externo, igual que la base de datos: si un caso de uso llama a `new Date()`
 * por su cuenta, no se puede probar ("¿qué pasa si hoy fuera 1 de diciembre?").
 * Por eso los casos de uso reciben un `clock` y nunca llaman a `new Date()` directamente.
 *
 *  - Normal: createClock() usa la hora real.
 *  - Para probar a mano: CLOCK_NOW=2026-12-01T12:00:00Z fija "ahora".
 */

// Una sola zona horaria para todo el sistema: define qué día es "hoy"
const TIME_ZONE = "America/Argentina/Buenos_Aires";

// "en-CA" formatea como AAAA-MM-DD, que es el formato que usamos para los días
const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });

function createClock({ fixedNow } = {}) {
  if (fixedNow && Number.isNaN(new Date(fixedNow).getTime())) {
    throw new Error(`CLOCK_NOW no es una fecha válida: "${fixedNow}"`);
  }
  const now = () => (fixedNow ? new Date(fixedNow) : new Date());

  return {
    now,
    // "Hoy" como AAAA-MM-DD, en la zona horaria del sistema
    today: () => dayFormatter.format(now()),
  };
}

export default createClock;
