# Zod Validation Schemas

## Übersicht

Dieses Projekt nutzt **Zod** für Type-Safe API Validation. Zod bietet:

- ✅ **Runtime Validation** - Daten werden zur Laufzeit validiert
- ✅ **TypeScript Integration** - Types werden automatisch generiert
- ✅ **Detailierte Fehlermeldungen** - Strukturierte Validierungsfehler
- ✅ **Sichere API Requests** - Schutz vor invaliden Daten

## Schemas

### `beerSchemas.ts`

Enthält alle Schemas für Beer-Validierung:

#### `beerInputSchema`
Validierung für neue Beers (POST `/api/beers`)

```typescript
const beerData = {
  name: "IPA",
  brewery: "Local Brewery",
  style: "IPA",
  abv: 6.5,
  rating: 4, // optional
  notes: "Super lecker!", // optional
  drank: false // optional, default: false
};
```

#### `beerUpdateSchema`
Validierung für Updates (PUT `/api/beers/:id`)
- Alle Felder optional

#### `beerIdParamsSchema`
Validierung für MongoDB IDs in URL Params

```typescript
// Validiert: "507f1f77bcf86cd799439011"
// Fehler bei: "invalid-id"
```

## Middleware

### `validateBody`
Validiert Request Body

```typescript
router.post('/', validateBody(beerInputSchema), controller);
```

### `validateParams`
Validiert URL Parameters

```typescript
router.get('/:id', validateParams(beerIdParamsSchema), controller);
```

### `validateQuery`
Validiert Query Parameters

```typescript
router.get('/', validateQuery(querySchema), controller);
```

## Fehlerresponses

Bei Validierungsfehlern:

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "name: Name ist erforderlich, abv: ABV kann nicht negativ sein",
  "details": [
    {
      "path": ["name"],
      "message": "Name ist erforderlich"
    },
    {
      "path": ["abv"],
      "message": "ABV kann nicht negativ sein"
    }
  ]
}
```

## Beispiel Validierung

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
  age: z.number().min(0).max(120),
  email: z.string().email(),
});

// Type automatisch generiert!
type User = z.infer<typeof schema>;

// Usage
const result = schema.safeParse(data);
if (result.success) {
  const user: User = result.data;
} else {
  console.log(result.error.issues);
}
```

## Validierungsregeln

### Name
- ✅ Required
- ✅ Trimmed (Leerzeichen entfernt)
- ✅ Min: 1 Zeichen
- ✅ Max: 100 Zeichen

### Brewery
- ✅ Required
- ✅ Trimmed
- ✅ Min: 1 Zeichen
- ✅ Max: 100 Zeichen

### Style
- ✅ Required
- ✅ Trimmed
- ✅ Min: 1 Zeichen
- ✅ Max: 100 Zeichen

### ABV (Alcohol by Volume)
- ✅ Required
- ✅ Min: 0%
- ✅ Max: 100%

### Rating
- ⚠️ Optional
- ✅ Min: 1 Stern
- ✅ Max: 5 Sterne
- ✅ Nullable

### Notes
- ⚠️ Optional
- ✅ Trimmed
- ✅ Max: 500 Zeichen
- ✅ Default: ""

### Drank
- ⚠️ Optional
- ✅ Boolean
- ✅ Default: false

## Weitere Möglichkeiten

### Custom Validation
```typescript
const schema = z.string().refine(
  (val) => val.includes("@"),
  { message: "Must contain @" }
);
```

### Enum Validation
```typescript
const styleEnum = z.enum(["IPA", "Pils", "Stout"]);
```

### Regex Validation
```typescript
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Ungültige Telefonnummer");
```

### Union Types
```typescript
const stringOrNumber = z.union([z.string(), z.number()]);
// oder:
const stringOrNumber2 = z.string().or(z.number());
```

### Array Validation
```typescript
const beersArray = z.array(beerInputSchema);
```

## Testing

Test API mit invaliden Daten:

```bash
# Fehler: Missing required fields
curl -X POST http://localhost:5001/api/beers \
  -H "Content-Type: application/json" \
  -d '{"name":""}'

# Erfolg: Valid data
curl -X POST http://localhost:5001/api/beers \
  -H "Content-Type: application/json" \
  -d '{"name":"IPA","brewery":"Test","style":"IPA","abv":6.5}'

# Fehler: Invalid MongoDB ID
curl -X GET http://localhost:5001/api/beers/invalid-id

# Erfolg: Valid ID
curl -X GET http://localhost:5001/api/beers/507f1f77bcf86cd799439011
```

## Aktuelle Implementierung

### Route Validierung

**Datei:** `backend/src/routes/beerRoutes.ts`

```typescript
import { beerInputSchema, beerUpdateSchema, beerIdParamsSchema } from '../validators/beerSchemas';

// GET /api/beers/:id - ID wird validiert
router.get('/:id', validateParams(beerIdParamsSchema), BeerController.getBeerById);

// POST /api/beers - Body wird validiert
router.post('/', validateBody(beerInputSchema), BeerController.createBeer);

// PUT /api/beers/:id - ID und Body werden validiert
router.put('/:id', validateParams(beerIdParamsSchema), validateBody(beerUpdateSchema), BeerController.updateBeer);

// DELETE /api/beers/:id - ID wird validiert
router.delete('/:id', validateParams(beerIdParamsSchema), BeerController.deleteBeer);
```

### Controller Types

**Datei:** `backend/src/controllers/BeerController.ts`

```typescript
import { BeerInput, BeerUpdate } from '../validators/beerSchemas';

static async createBeer(req: Request<{}, {}, BeerInput>, res: Response): Promise<void> {
  // req.body ist jetzt typisiert als BeerInput
  const beerData: BeerInput = req.body;
  // ...
}
```

### Schema Definition

**Datei:** `backend/src/validators/beerSchemas.ts`

```typescript
import { z } from 'zod';

export const beerInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  brewery: z.string().trim().min(1).max(100),
  style: z.string().trim().min(1).max(100),
  abv: z.number().min(0).max(100),
  rating: z.number().min(1).max(5).optional().nullable(),
  notes: z.string().trim().max(500).optional().default(''),
  drank: z.boolean().optional().default(false),
});

// Type wird automatisch generiert
export type BeerInput = z.infer<typeof beerInputSchema>;

export const beerUpdateSchema = beerInputSchema.partial();
export type BeerUpdate = z.infer<typeof beerUpdateSchema>;

export const beerIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Ungültige MongoDB ID'),
});
export type BeerIdParams = z.infer<typeof beerIdParamsSchema>;
```

## Nützliche Links

- [Zod Documentation](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [Express TypeScript Guide](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
