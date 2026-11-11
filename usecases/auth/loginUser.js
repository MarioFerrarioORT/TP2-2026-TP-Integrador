import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: iniciar sesión.
 * Devuelve { token, user }. El token lleva solo el id (sub) y el rol.
 *
 * ¿Por qué el MISMO error si el email no existe o si la contraseña no coincide?
 * Porque si los mensajes fueran distintos, un atacante podría probar emails y descubrir
 * cuáles están registrados (enumeración de usuarios). Con un solo error no se filtra esa información.
 */
async function loginUser({ email, password }, dao, hasher, tokens) {
  const credentials = await dao.getCredentialsByEmail(email);
  const valid = credentials
    ? await hasher.compare(password, credentials.passwordHash)
    : false;

  if (!valid) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Email o contraseña incorrectos",
      401
    );
  }

  const { passwordHash, ...user } = credentials;
  const token = tokens.sign({ sub: String(user.id), rol: user.rol });

  return { token, user };
}

export default loginUser;
