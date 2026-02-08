import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateBody, validateParams, validateQuery } from '../../backend/src/middleware/validationMiddleware';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const createMockReq = (overrides: Partial<Request> = {}): Request =>
  ({
    body: {},
    params: {},
    query: {},
    ...overrides,
  }) as Request;

const createMockRes = (): Response =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }) as unknown as Response;

const createMockNext = (): NextFunction => vi.fn();

const bodySchema = z.object({
  name: z.string().min(1),
  count: z.number(),
});

const paramsSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/),
});

const querySchema = z.object({
  page: z.coerce.number().min(1),
});

describe('validateBody', () => 
{
  it('should call next() when body is valid', () => 
  {
    const req = createMockReq({ body: { name: 'Test', count: 5 } });
    const res = createMockRes();
    const next = createMockNext();

    validateBody(bodySchema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: 'Test', count: 5 });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted error on ZodError', () => 
  {
    const req = createMockReq({ body: { name: '', count: 5 } });
    const res = createMockRes();
    const next = createMockNext();

    validateBody(bodySchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation Error',
        message: expect.stringContaining('name'),
        details: expect.any(Array),
      })
    );
  });

  it('should pass non-ZodError to next', () => 
  {
    const req = createMockReq({ body: {} });
    const res = createMockRes();
    const next = createMockNext();

    const customError = new Error('Custom error');
    const schemaThatThrows = {
      parse: () => 
      {
        throw customError;
      },
    } as unknown as z.ZodSchema<unknown>;

    validateBody(schemaThatThrows)(req, res, next);

    expect(next).toHaveBeenCalledWith(customError);
  });
});

describe('validateParams', () => 
{
  it('should call next() when params are valid', () => 
  {
    const req = createMockReq({ params: { id: '507f1f77bcf86cd799439011' } });
    const res = createMockRes();
    const next = createMockNext();

    validateParams(paramsSchema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.params.id).toBe('507f1f77bcf86cd799439011');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted error on invalid params', () => 
  {
    const req = createMockReq({ params: { id: 'invalid' } });
    const res = createMockRes();
    const next = createMockNext();

    validateParams(paramsSchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation Error',
        message: expect.stringContaining('id'),
      })
    );
  });
});

describe('validateQuery', () => 
{
  it('should call next() when query is valid', () => 
  {
    const req = createMockReq({ query: { page: '2' } });
    const res = createMockRes();
    const next = createMockNext();

    validateQuery(querySchema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query.page).toBe(2);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted error on invalid query', () => 
  {
    const req = createMockReq({ query: { page: '0' } });
    const res = createMockRes();
    const next = createMockNext();

    validateQuery(querySchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation Error',
      })
    );
  });
});
