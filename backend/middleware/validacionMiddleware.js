import { validationResult } from 'express-validator';

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

export const sanitizarInput = (req, res, next) => {
    const sanitizar = (data) => {
        if (typeof data === 'string') {
            return data.replace(/<[^>]*>?/gm, '');
        }
        return data;
    };

    ['body', 'params', 'query'].forEach(key => {
        if (req[key]) {
            req[key] = JSON.parse(JSON.stringify(req[key]), (k, v) => sanitizar(v));
        }
    });
    next();
};
