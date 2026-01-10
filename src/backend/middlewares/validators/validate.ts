import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        // Tambah query/params jika perlu
      });
      next();
    } catch (error) {
      res.status(400).json({ errors: (error as any).errors });
    }
  };
};
