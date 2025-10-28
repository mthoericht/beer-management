"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BeerController_1 = require("../controllers/BeerController");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const beerSchemas_1 = require("../validators/beerSchemas");
const router = (0, express_1.Router)();
router.get('/', BeerController_1.BeerController.getAllBeers);
router.get('/stats', BeerController_1.BeerController.getBeerStats);
router.get('/:id', (0, validationMiddleware_1.validateParams)(beerSchemas_1.beerIdParamsSchema), BeerController_1.BeerController.getBeerById);
router.post('/', (0, validationMiddleware_1.validateBody)(beerSchemas_1.beerInputSchema), BeerController_1.BeerController.createBeer);
router.put('/:id', (0, validationMiddleware_1.validateParams)(beerSchemas_1.beerIdParamsSchema), (0, validationMiddleware_1.validateBody)(beerSchemas_1.beerUpdateSchema), BeerController_1.BeerController.updateBeer);
router.delete('/:id', (0, validationMiddleware_1.validateParams)(beerSchemas_1.beerIdParamsSchema), BeerController_1.BeerController.deleteBeer);
exports.default = router;
//# sourceMappingURL=beerRoutes.js.map