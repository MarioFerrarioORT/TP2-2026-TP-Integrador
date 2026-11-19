/**
 * Nombres de eventos de la aplicación.
 * Son el contrato entre quien emite y quien escucha: se centralizan para no depender de strings sueltos.
 * Convención: "entidad.hecho" (algo que YA ocurrió, no una orden).
 */
const EVENTS = {
  TASK_ASSIGNED: "task.assigned",
  PROJECT_MEMBER_ADDED: "project.memberAdded",
};

export default EVENTS;
