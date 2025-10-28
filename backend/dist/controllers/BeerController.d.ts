import { Request, Response } from 'express';
import { IBeerInput, IBeerUpdate } from '../types';
export declare class BeerController {
    static getAllBeers(req: Request, res: Response): Promise<void>;
    static getBeerById(req: Request, res: Response): Promise<void>;
    static createBeer(req: Request<{}, {}, IBeerInput>, res: Response): Promise<void>;
    static updateBeer(req: Request<{
        id: string;
    }, {}, IBeerUpdate>, res: Response): Promise<void>;
    static deleteBeer(req: Request, res: Response): Promise<void>;
    static getBeerStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=BeerController.d.ts.map