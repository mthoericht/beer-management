"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BeerController_1 = require("../controllers/BeerController");
const router = (0, express_1.Router)();
router.get('/', BeerController_1.BeerController.getAllBeers);
router.get('/stats', BeerController_1.BeerController.getBeerStats);
router.get('/:id', BeerController_1.BeerController.getBeerById);
router.post('/', BeerController_1.BeerController.createBeer);
router.put('/:id', BeerController_1.BeerController.updateBeer);
router.delete('/:id', BeerController_1.BeerController.deleteBeer);
exports.default = router;
//# sourceMappingURL=beerRoutes.js.map