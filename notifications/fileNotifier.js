import { appendFile } from "node:fs/promises";
import { NOTIFICATIONS_LOG_PATH } from "../config/config.js";

/**
 * Notificador a archivo (por defecto notifications.log).
 * Tiene la misma firma que consoleNotifier: el listener depende solo del contrato
 * notify({ subject, body }), por eso no cambia al pasar de un notificador a otro.
 */
const fileNotifier = {
  async notify({ subject, body }) {
    const line = `${new Date().toISOString()} | ${subject} | ${body}\n`;
    await appendFile(NOTIFICATIONS_LOG_PATH, line);
  },
};

export default fileNotifier;
