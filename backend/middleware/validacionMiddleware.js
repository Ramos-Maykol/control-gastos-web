import { validationResult } from 'express-validator';

// Middleware para validar campos usando express-validator
export const validarCampos = (validaciones) => {
  return async (req, res, next) => {
    await Promise.all(validaciones.map(validation => validation.run(req)));

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        exito: false,
        errores: errores.array().map(e => ({
          campo: e.param,
          mensaje: e.msg,
          valor: e.value
        }))
      });
    }
    next();
  };
};

// Middleware para sanitizar inputs (sin reasignar objetos protegidos)
export const sanitizarInput = (req, res, next) => {
  const sanitizar = (data) => {
    if (typeof data === 'string') {
      return data.replace(/<[^>]*>?/gm, '').trim();
    }
    return data;
  };

  const limpiar = (obj) => {
    Object.keys(obj).forEach(key => {
      obj[key] = sanitizar(obj[key]);
    });
  };

  if (req.body) limpiar(req.body);
  if (req.params) limpiar(req.params);
  if (req.query) limpiar(req.query);

  next();
};
