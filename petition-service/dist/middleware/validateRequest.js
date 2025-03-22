"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req);
        if (!result.success) {
            res.status(400).json({ errors: result.error.errors });
            console.log(result.error.errors);
            console.log(req.body);
            return; // Ensure function ends after sending response
        }
        next(); // Continue if validation passes
    };
};
exports.validate = validate;
