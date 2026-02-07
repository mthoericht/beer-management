import { describe, it, expect } from 'vitest';
import {
  beerInputSchema,
  beerUpdateSchema,
  beerIdParamsSchema,
} from '../../backend/src/validators/beerSchemas';

describe('beerInputSchema', () => 
{
  const validBeer = {
    name: 'Test IPA',
    brewery: 'Test Brewery',
    style: 'IPA',
    abv: 6.5,
  };

  it('should accept valid beer input', () => 
  {
    const result = beerInputSchema.safeParse(validBeer);
    expect(result.success).toBe(true);
    if (result.success) 
    {
      expect(result.data.name).toBe('Test IPA');
      expect(result.data.abv).toBe(6.5);
      expect(result.data.drank).toBe(false);
      expect(result.data.notes).toBe('');
    }
  });

  it('should accept beer with all optional fields', () => 
  {
    const fullBeer = {
      ...validBeer,
      rating: 4,
      notes: 'Great beer',
      drank: true,
    };
    const result = beerInputSchema.safeParse(fullBeer);
    expect(result.success).toBe(true);
    if (result.success) 
    {
      expect(result.data.rating).toBe(4);
      expect(result.data.notes).toBe('Great beer');
      expect(result.data.drank).toBe(true);
    }
  });

  it('should trim string values', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      name: '  Trimmed Name  ',
      brewery: '  Brewery  ',
      style: '  IPA  ',
    });
    expect(result.success).toBe(true);
    if (result.success) 
    {
      expect(result.data.name).toBe('Trimmed Name');
      expect(result.data.brewery).toBe('Brewery');
      expect(result.data.style).toBe('IPA');
    }
  });

  it('should reject empty name', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty brewery', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      brewery: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty style', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      style: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative ABV', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      abv: -1,
    });
    expect(result.success).toBe(false);
  });

  it('should reject ABV over 100', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      abv: 101,
    });
    expect(result.success).toBe(false);
  });

  it('should reject rating below 1', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject rating above 5', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it('should accept rating between 1 and 5', () => 
  {
    [1, 2, 3, 4, 5].forEach((rating) => 
    {
      const result = beerInputSchema.safeParse({ ...validBeer, rating });
      expect(result.success).toBe(true);
    });
  });

  it('should reject name over 100 characters', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      name: 'a'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('should reject notes over 500 characters', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      notes: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => 
  {
    expect(beerInputSchema.safeParse({ name: 'Test' })).toMatchObject({
      success: false,
    });
    expect(beerInputSchema.safeParse({})).toMatchObject({ success: false });
  });

  it('should reject string for abv', () => 
  {
    const result = beerInputSchema.safeParse({
      ...validBeer,
      abv: '6.5',
    });
    expect(result.success).toBe(false);
  });
});

describe('beerUpdateSchema', () => 
{
  it('should accept empty object (partial update)', () => 
  {
    const result = beerUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept partial fields', () => 
  {
    const result = beerUpdateSchema.safeParse({
      name: 'Updated Name',
      rating: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) 
    {
      expect(result.data.name).toBe('Updated Name');
      expect(result.data.rating).toBe(5);
    }
  });

  it('should still validate types of provided fields', () => 
  {
    const result = beerUpdateSchema.safeParse({
      abv: -5,
    });
    expect(result.success).toBe(false);
  });

  it('should accept single field update', () => 
  {
    const result = beerUpdateSchema.safeParse({ drank: true });
    expect(result.success).toBe(true);
  });
});

describe('beerIdParamsSchema', () => 
{
  it('should accept valid MongoDB ObjectId', () => 
  {
    const validIds = [
      '507f1f77bcf86cd799439011',
      '000000000000000000000000',
      'ffffffffffffffffffffffff',
    ];
    validIds.forEach((id) => 
    {
      const result = beerIdParamsSchema.safeParse({ id });
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid ObjectId format', () => 
  {
    const invalidIds = [
      'invalid-id',
      '507f1f77bcf86cd79943901', // too short
      '507f1f77bcf86cd7994390111', // too long
      '507f1f77bcf86cd79943901g', // invalid character
      '',
    ];
    invalidIds.forEach((id) => 
    {
      const result = beerIdParamsSchema.safeParse({ id });
      expect(result.success).toBe(false);
    });
  });

  it('should reject missing id', () => 
  {
    const result = beerIdParamsSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
