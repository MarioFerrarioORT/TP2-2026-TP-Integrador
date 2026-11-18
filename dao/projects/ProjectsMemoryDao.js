/**
 * Adaptador DAO en memoria para Proyectos y sus colaboradores.
 * Debe respetar la misma interfaz pública que ProjectsSequelizeDao.
 *
 * Contrato de lo que devuelve: un objeto plano
 *   { id, titulo, descripcion, fechaCreacion, fechaFin, ownerId, colaboradorIds }
 * donde colaboradorIds es un array de ids de usuario ordenado de menor a mayor.
 */
class ProjectsMemoryDao {
  #projects = [];
  #members = []; // cada elemento: { projectId, userId }
  #nextId = 1;

  #toPlain(project) {
    const colaboradorIds = this.#members
      .filter((m) => m.projectId === project.id)
      .map((m) => m.userId)
      .sort((a, b) => a - b);
    return { ...project, colaboradorIds };
  }

  // filters: { ownerId, participantId, titulo, page, limit }
  // participantId: proyectos donde el usuario es dueño O colaborador
  async getAll({ ownerId, participantId, titulo, page = 1, limit } = {}) {
    let projects = this.#projects.filter(
      (p) =>
        (ownerId === undefined || p.ownerId === ownerId) &&
        (titulo === undefined ||
          p.titulo.toLowerCase().includes(titulo.toLowerCase())) &&
        (participantId === undefined ||
          p.ownerId === participantId ||
          this.#members.some(
            (m) => m.projectId === p.id && m.userId === participantId
          ))
    );

    if (limit) projects = projects.slice((page - 1) * limit, page * limit);

    return projects.map((p) => this.#toPlain(p));
  }

  async getById(id) {
    const project = this.#projects.find((p) => p.id === Number(id));
    return project ? this.#toPlain(project) : null;
  }

  async save({ titulo, descripcion = "", fechaCreacion, fechaFin, ownerId }) {
    const project = {
      id: this.#nextId++,
      titulo,
      descripcion,
      fechaCreacion,
      fechaFin,
      ownerId,
    };
    this.#projects.push(project);
    return this.#toPlain(project);
  }

  async update(id, { titulo, descripcion, fechaFin }) {
    const project = this.#projects.find((p) => p.id === Number(id));
    if (!project) return null;

    if (titulo !== undefined) project.titulo = titulo;
    if (descripcion !== undefined) project.descripcion = descripcion;
    if (fechaFin !== undefined) project.fechaFin = fechaFin;
    return this.#toPlain(project);
  }

  // Borra el proyecto junto con sus colaboradores
  async delete(id) {
    const index = this.#projects.findIndex((p) => p.id === Number(id));
    if (index === -1) return false;

    this.#projects.splice(index, 1);
    this.#members = this.#members.filter((m) => m.projectId !== Number(id));
    return true;
  }

  // Devuelve true si lo agregó, false si ya era colaborador
  async addMember(projectId, userId) {
    const exists = this.#members.some(
      (m) => m.projectId === projectId && m.userId === userId
    );
    if (exists) return false;

    this.#members.push({ projectId, userId });
    return true;
  }

  // Devuelve true si lo quitó, false si no era colaborador
  async removeMember(projectId, userId) {
    const before = this.#members.length;
    this.#members = this.#members.filter(
      (m) => !(m.projectId === projectId && m.userId === userId)
    );
    return this.#members.length < before;
  }

  // Quita al usuario de todos los proyectos en los que colabora (se usa al eliminar un usuario)
  async removeUserMemberships(userId) {
    this.#members = this.#members.filter((m) => m.userId !== userId);
  }
}

export { ProjectsMemoryDao };
export default new ProjectsMemoryDao();
