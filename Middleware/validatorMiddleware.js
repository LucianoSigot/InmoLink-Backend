export const validarSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // ZOD usa "issues", no "errors"
    if (error.issues) {
      return res.status(400).json({
        errors: error.issues.map((e) => ({
          campo: e.path[0],
          mensaje: e.message,
        })),
      });
    }

    return res.status(400).json({ error: "Error de validación" });
  }
};
