import EVENTS from "../events/eventNames.js";

/**
 * Módulo de alertas: decide qué hacer cuando ocurre un evento.
 * No conoce al emisor (los casos de uso) ni el canal concreto (el notifier se inyecta).
 *
 * Cada listener captura sus propios errores: si la notificación falla, la operación que emitió
 * el evento (crear la tarea, agregar el colaborador) ya terminó bien y NO debe verse afectada.
 */
function registerAlertListeners(bus, notifier) {
  // Envuelve un listener: arma el mensaje, lo envía y atrapa cualquier error
  const listen = (eventName, buildMessage) => {
    bus.on(eventName, async (payload) => {
      try {
        await notifier.notify(buildMessage(payload));
      } catch (err) {
        console.error(
          `[alertas] No se pudo notificar "${eventName}":`,
          err.message
        );
      }
    });
  };

  listen(
    EVENTS.TASK_ASSIGNED,
    ({ titulo, proyecto, responsable, asignadoPor }) => ({
      subject: "Tarea asignada",
      body: `"${titulo}" (proyecto "${proyecto}") fue asignada a ${responsable.nombre} <${responsable.email}> por ${asignadoPor}`,
    })
  );

  listen(
    EVENTS.PROJECT_MEMBER_ADDED,
    ({ proyecto, colaborador, agregadoPor }) => ({
      subject: "Nuevo colaborador",
      body: `${colaborador.nombre} <${colaborador.email}> fue agregado al proyecto "${proyecto}" por ${agregadoPor}`,
    })
  );
}

export default registerAlertListeners;
