import { z } from 'zod';
export declare const beerInputSchema: z.ZodObject<{
    name: z.ZodString;
    brewery: z.ZodString;
    style: z.ZodString;
    abv: z.ZodNumber;
    rating: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    drank: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type BeerInput = z.infer<typeof beerInputSchema>;
export declare const beerUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    brewery: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
    abv: z.ZodOptional<z.ZodNumber>;
    rating: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    notes: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    drank: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export type BeerUpdate = z.infer<typeof beerUpdateSchema>;
export declare const beerIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type BeerIdParams = z.infer<typeof beerIdParamsSchema>;
//# sourceMappingURL=beerSchemas.d.ts.map