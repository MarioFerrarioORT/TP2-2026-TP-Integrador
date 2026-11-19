import { NOTIFIER_TYPE } from "../config/config.js";
import consoleNotifier from "./consoleNotifier.js";
import fileNotifier from "./fileNotifier.js";
import combineNotifiers from "./combineNotifiers.js";

/**
 * Factory de notificadores (equivalente a daoFactory).
 * Devuelve la implementación según NOTIFIER_TYPE: "console", "file" o "both".
 */
function getNotifier() {
  if (NOTIFIER_TYPE === "file") {
    console.log("[Notificaciones] Usando archivo");
    return fileNotifier;
  }
  if (NOTIFIER_TYPE === "both") {
    console.log("[Notificaciones] Usando consola y archivo");
    return combineNotifiers(consoleNotifier, fileNotifier);
  }
  console.log("[Notificaciones] Usando consola");
  return consoleNotifier;
}

export { getNotifier };
