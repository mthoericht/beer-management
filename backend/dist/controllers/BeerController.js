"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeerController = void 0;
const Beer_1 = require("../models/Beer");
class BeerController {
    static async getAllBeers(req, res) {
        try {
            const beers = await Beer_1.Beer.find().sort({ dateAdded: -1 });
            const response = {
                success: true,
                data: beers
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(500).json(response);
        }
    }
    static async getBeerById(req, res) {
        try {
            const { id } = req.params;
            const beer = await Beer_1.Beer.findById(id);
            if (!beer) {
                const response = {
                    success: false,
                    error: 'Beer not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: beer
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(500).json(response);
        }
    }
    static async createBeer(req, res) {
        try {
            const beerData = req.body;
            const beer = new Beer_1.Beer(beerData);
            await beer.save();
            const response = {
                success: true,
                data: beer,
                message: 'Beer created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(400).json(response);
        }
    }
    static async updateBeer(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const beer = await Beer_1.Beer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!beer) {
                const response = {
                    success: false,
                    error: 'Beer not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: beer,
                message: 'Beer updated successfully'
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(400).json(response);
        }
    }
    static async deleteBeer(req, res) {
        try {
            const { id } = req.params;
            const beer = await Beer_1.Beer.findByIdAndDelete(id);
            if (!beer) {
                const response = {
                    success: false,
                    error: 'Beer not found'
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                message: 'Beer deleted successfully'
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(500).json(response);
        }
    }
    static async getBeerStats(req, res) {
        try {
            const totalBeers = await Beer_1.Beer.countDocuments();
            const drankBeers = await Beer_1.Beer.countDocuments({ drank: true });
            const pendingBeers = totalBeers - drankBeers;
            const ratedBeers = await Beer_1.Beer.countDocuments({ rating: { $exists: true, $ne: null } });
            const averageRatingResult = await Beer_1.Beer.aggregate([
                { $match: { rating: { $exists: true, $ne: null } } },
                { $group: { _id: null, avgRating: { $avg: '$rating' } } }
            ]);
            const averageRating = averageRatingResult.length > 0
                ? Math.round(averageRatingResult[0].avgRating * 10) / 10
                : 0;
            const topStyleResult = await Beer_1.Beer.aggregate([
                { $group: { _id: '$style', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);
            const topStyle = topStyleResult.length > 0
                ? { style: topStyleResult[0]._id, count: topStyleResult[0].count }
                : undefined;
            const topBreweryResult = await Beer_1.Beer.aggregate([
                { $group: { _id: '$brewery', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);
            const topBrewery = topBreweryResult.length > 0
                ? { brewery: topBreweryResult[0]._id, count: topBreweryResult[0].count }
                : undefined;
            const stats = {
                totalBeers,
                drankBeers,
                pendingBeers,
                ratedBeers,
                averageRating,
                topStyle,
                topBrewery
            };
            const response = {
                success: true,
                data: stats
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
            res.status(500).json(response);
        }
    }
}
exports.BeerController = BeerController;
//# sourceMappingURL=BeerController.js.map