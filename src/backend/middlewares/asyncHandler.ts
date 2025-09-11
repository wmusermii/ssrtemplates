import { Request, Response, NextFunction } from "express";
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
