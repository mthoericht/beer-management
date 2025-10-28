import { Request, Response } from 'express';
import { Beer } from '../models/Beer';
import { IApiResponse, IBeerStats } from '../types';
import { BeerInput, BeerUpdate } from '../validators/beerSchemas';

export class BeerController {
  // Get all beers
  static async getAllBeers(req: Request, res: Response): Promise<void> {
    try {
      const beers = await Beer.find().sort({ dateAdded: -1 });
      const response: IApiResponse = {
        success: true,
        data: beers
      };
      res.json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  }

  // Get single beer by ID
  static async getBeerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const beer = await Beer.findById(id);
      
      if (!beer) {
        const response: IApiResponse = {
          success: false,
          error: 'Beer not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse = {
        success: true,
        data: beer
      };
      res.json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  }

  // Create new beer
  static async createBeer(req: Request<{}, {}, BeerInput>, res: Response): Promise<void> {
    try {
      const beerData: BeerInput = req.body;
      const beer = new Beer(beerData);
      await beer.save();

      const response: IApiResponse = {
        success: true,
        data: beer,
        message: 'Beer created successfully'
      };
      res.status(201).json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(400).json(response);
    }
  }

  // Update beer by ID
  static async updateBeer(req: Request<{ id: string }, {}, BeerUpdate>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: BeerUpdate = req.body;

      const beer = await Beer.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!beer) {
        const response: IApiResponse = {
          success: false,
          error: 'Beer not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse = {
        success: true,
        data: beer,
        message: 'Beer updated successfully'
      };

      res.json(response);

    } catch (error) 
    {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(400).json(response);
    }
  }

  // Delete beer by ID
  static async deleteBeer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const beer = await Beer.findByIdAndDelete(id);

      if (!beer) {
        const response: IApiResponse = {
          success: false,
          error: 'Beer not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Beer deleted successfully'
      };
      res.json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  }

  // Get beer statistics
  static async getBeerStats(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const totalBeers = await Beer.countDocuments();
      const drankBeers = await Beer.countDocuments({ drank: true });
      const pendingBeers = totalBeers - drankBeers;
      const ratedBeers = await Beer.countDocuments({ rating: { $exists: true, $ne: null } });
      
      const averageRatingResult = await Beer.aggregate([
        { $match: { rating: { $exists: true, $ne: null } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);
      
      const averageRating = averageRatingResult.length > 0 
        ? Math.round(averageRatingResult[0].avgRating * 10) / 10 
        : 0;

      // Get top style
      const topStyleResult = await Beer.aggregate([
        { $group: { _id: '$style', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      
      const topStyle = topStyleResult.length > 0 
        ? { style: topStyleResult[0]._id, count: topStyleResult[0].count }
        : undefined;

      // Get top brewery
      const topBreweryResult = await Beer.aggregate([
        { $group: { _id: '$brewery', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      
      const topBrewery = topBreweryResult.length > 0 
        ? { brewery: topBreweryResult[0]._id, count: topBreweryResult[0].count }
        : undefined;

      const stats: IBeerStats = {
        totalBeers,
        drankBeers,
        pendingBeers,
        ratedBeers,
        averageRating,
        topStyle,
        topBrewery
      };

      const response: IApiResponse<IBeerStats> = {
        success: true,
        data: stats
      };
      res.json(response);
    } catch (error) {
      const response: IApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      res.status(500).json(response);
    }
  }
}
