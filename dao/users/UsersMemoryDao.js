/**
 * Adaptador DAO en memoria para Usuarios.
 * Guarda los usuarios en un array. Debe respetar la misma interfaz pública que el adaptador Sequelize (Paso 8).
 * Regla: ningún método devuelve passwordHash, salvo getCredentialsByEmail (lo usa solo el login).
 */
class UsersMemoryDao {
  #users = [];
  #nextId = 1;

  // Devuelve una copia del usuario sin el hash de la contraseña
  #toPublic(user) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  // filters: { nombre, email, page, limit }
  async getAll({ nombre, email, page = 1, limit } = {}) {
    let users = this.#users.filter(
      (u) =>
        (nombre === undefined ||
          u.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
        (email === undefined || u.email === email)
    );

    if (limit) users = users.slice((page - 1) * limit, page * limit);

    return users.map((u) => this.#toPublic(u));
  }

  async getById(id) {
    const user = this.#users.find((u) => u.id === Number(id));
    return user ? this.#toPublic(user) : null;
  }

  async getByEmail(email) {
    const user = this.#users.find((u) => u.email === email);
    return user ? this.#toPublic(user) : null;
  }

  // Único método que devuelve el hash: existe solo para el login
  async getCredentialsByEmail(email) {
    const user = this.#users.find((u) => u.email === email);
    return user ? { ...user } : null;
  }

  async save(data) {
    const { id: _ignored, ...userData } = data;
    const newUser = { id: this.#nextId++, ...userData };
    this.#users.push(newUser);
    return this.#toPublic(newUser);
  }

  async update(id, changes) {
    const index = this.#users.findIndex((u) => u.id === Number(id));
    if (index === -1) return null;

    const { id: _ignored, ...allowedChanges } = changes;
    this.#users[index] = { ...this.#users[index], ...allowedChanges };
    return this.#toPublic(this.#users[index]);
  }

  async delete(id) {
    const index = this.#users.findIndex((u) => u.id === Number(id));
    if (index === -1) return false;

    this.#users.splice(index, 1);
    return true;
  }
}

export { UsersMemoryDao };
export default new UsersMemoryDao();
