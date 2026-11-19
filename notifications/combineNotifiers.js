/**
 * Combina varios notificadores en uno solo (mismo contrato notify({ subject, body })).
 * Se intentan todos: si uno falla, los demás igual se ejecutan, y recién al final se avisa del error.
 */
function combineNotifiers(...notifiers) {
  return {
    async notify(message) {
      const results = await Promise.allSettled(
        notifiers.map((n) => n.notify(message))
      );
      const failed = results.find((r) => r.status === "rejected");
      if (failed) throw failed.reason;
    },
  };
}

export default combineNotifiers;
