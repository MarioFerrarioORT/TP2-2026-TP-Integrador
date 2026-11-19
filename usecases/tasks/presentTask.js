/**
 * Arma la respuesta de una tarea: reemplaza responsableId por los datos públicos
 * del responsable ({ id, nombre, email, rol }). Lo hace el caso de uso para que
 * el DAO de tareas no dependa del DAO de usuarios.
 */
async function presentTask(task, usersDao) {
  const { responsableId, ...data } = task;
  const responsable = await usersDao.getById(responsableId);
  return { ...data, responsable };
}

export default presentTask;
