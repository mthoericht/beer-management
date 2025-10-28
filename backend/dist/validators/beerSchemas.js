"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beerIdParamsSchema = exports.beerUpdateSchema = exports.beerInputSchema = void 0;
const zod_1 = require("zod");
exports.beerInputSchema = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .min(1, 'Name ist erforderlich')
        .max(100, 'Name darf maximal 100 Zeichen lang sein'),
    brewery: zod_1.z.string()
        .trim()
        .min(1, 'Brauerei ist erforderlich')
        .max(100, 'Brauerei darf maximal 100 Zeichen lang sein'),
    style: zod_1.z.string()
        .trim()
        .min(1, 'Biertyp ist erforderlich')
        .max(100, 'Biertyp darf maximal 100 Zeichen lang sein'),
    abv: zod_1.z.number()
        .min(0, 'ABV kann nicht negativ sein')
        .max(100, 'ABV kann nicht über 100% sein'),
    rating: zod_1.z.number()
        .min(1, 'Rating muss mindestens 1 sein')
        .max(5, 'Rating kann maximal 5 sein')
        .optional()
        .nullable(),
    notes: zod_1.z.string()
        .trim()
        .max(500, 'Notizen dürfen maximal 500 Zeichen lang sein')
        .optional()
        .default(''),
    drank: zod_1.z.boolean()
        .optional()
        .default(false),
});
exports.beerUpdateSchema = exports.beerInputSchema.partial();
exports.beerIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string()
        .min(1, 'ID ist erforderlich')
        .regex(/^[0-9a-fA-F]{24}$/, 'Ungültige MongoDB ID'),
});
//# sourceMappingURL=beerSchemas.js.map