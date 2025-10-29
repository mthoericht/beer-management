import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// ============================================
// Validation Middleware für Request Body
// ============================================

export function validateBody<T>(schema: z.ZodSchema<T>) 
{
  return (req: Request, res: Response, next: NextFunction) => 
  {

    try 
    {
      // Validierung und Parsing des Request Body
      req.body = schema.parse(req.body);
      next();
      
    }
    catch (error) 
    {
      if (error instanceof z.ZodError) 
      {
        // Strukturierte Fehlerantwort
        const errorMessage = error.issues.map((err) => 
        {
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
      else 
      {
        next(error);
      }
    }
  };
}

// ============================================
// Validation Middleware für Request Params
// ============================================

export function validateParams<T>(schema: z.ZodSchema<T>) 
{
  return (req: Request, res: Response, next: NextFunction) => 
  {
    try 
    {
      // Validierung der URL Parameter
      const parsed = schema.parse(req.params) as typeof req.params;
      Object.assign(req.params, parsed);
      next();
    }
    catch (error) 
    {
      if (error instanceof z.ZodError) 
      {
        const errorMessage = error.issues.map((err) => 
        {
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
      else 
      {
        next(error);
      }
    }
  };
}

// ============================================
// Validation Middleware für Query Params
// ============================================

export function validateQuery<T>(schema: z.ZodSchema<T>) 
{

  return (req: Request, res: Response, next: NextFunction) => 
  {
    try 
    {
      const parsed = schema.parse(req.query) as typeof req.query;
      Object.assign(req.query, parsed);
      next();
    }
    catch (error) 
    {
      if (error instanceof z.ZodError) 
      {
        const errorMessage = error.issues.map((err) => 
        {
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
      else 
      {
        next(error);
      }
    }
  };
}
