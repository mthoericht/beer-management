import { Request, Response } from 'express';
import { BeerInput, BeerUpdate } from '../validators/beerSchemas';
export declare class BeerController {
    static getAllBeers(req: Request, res: Response): Promise<void>;
    static getBeerById(req: Request, res: Response): Promise<void>;
    static createBeer(req: Request<{}, {}, BeerInput>, res: Response): Promise<void>;
    static updateBeer(req: Request<{
        id: string;
    }, {}, BeerUpdate>, res: Response): Promise<void>;
    static deleteBeer(req: Request, res: Response): Promise<void>;
    static getBeerStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=BeerController.d.ts.map