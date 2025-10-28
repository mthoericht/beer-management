"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.issues.map((err) => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');
                res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    message: errorMessage,
                    details: error.issues,
                });
            }
            else {
                next(error);
            }
        }
    };
}
function validateParams(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.params);
            Object.assign(req.params, parsed);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.issues.map((err) => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');
                res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    message: errorMessage,
                    details: error.issues,
                });
            }
            else {
                next(error);
            }
        }
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.query);
            Object.assign(req.query, parsed);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const errorMessage = error.issues.map((err) => {
                    const path = err.path.join('.');
                    return `${path}: ${err.message}`;
                }).join(', ');
                res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    message: errorMessage,
                    details: error.issues,
                });
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validationMiddleware.js.map