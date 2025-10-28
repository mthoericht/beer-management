import { z } from 'zod';

// ============================================
// BEER INPUT SCHEMA (für POST /api/beers)
// ============================================

export const beerInputSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name ist erforderlich')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  
  brewery: z.string()
    .trim()
    .min(1, 'Brauerei ist erforderlich')
    .max(100, 'Brauerei darf maximal 100 Zeichen lang sein'),
  
  style: z.string()
    .trim()
    .min(1, 'Biertyp ist erforderlich')
    .max(100, 'Biertyp darf maximal 100 Zeichen lang sein'),
  
  abv: z.number()
    .min(0, 'ABV kann nicht negativ sein')
    .max(100, 'ABV kann nicht über 100% sein'),
  
  rating: z.number()
    .min(1, 'Rating muss mindestens 1 sein')
    .max(5, 'Rating kann maximal 5 sein')
    .optional()
    .nullable(),
  
  notes: z.string()
    .trim()
    .max(500, 'Notizen dürfen maximal 500 Zeichen lang sein')
    .optional()
    .default(''),
  
  drank: z.boolean()
    .optional()
    .default(false),
});

// TypeScript Type automatisch generiert
export type BeerInput = z.infer<typeof beerInputSchema>;

// ============================================
// BEER UPDATE SCHEMA (für PUT /api/beers/:id)
// ============================================

export const beerUpdateSchema = beerInputSchema.partial();

// TypeScript Type automatisch generiert
export type BeerUpdate = z.infer<typeof beerUpdateSchema>;

// ============================================
// BEER ID PARAMS SCHEMA
// ============================================

export const beerIdParamsSchema = z.object({
  id: z.string()
    .min(1, 'ID ist erforderlich')
    .regex(/^[0-9a-fA-F]{24}$/, 'Ungültige MongoDB ID'),
});

export type BeerIdParams = z.infer<typeof beerIdParamsSchema>;

