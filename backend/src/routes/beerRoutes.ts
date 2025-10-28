import { Router } from 'express';
import { BeerController } from '../controllers/BeerController';
import { validateBody, validateParams } from '../middleware/validationMiddleware';
import { 
  beerInputSchema, 
  beerUpdateSchema, 
  beerIdParamsSchema 
} from '../validators/beerSchemas';

const router = Router();

// Beer routes
router.get('/', BeerController.getAllBeers);
router.get('/stats', BeerController.getBeerStats);
router.get('/:id', validateParams(beerIdParamsSchema), BeerController.getBeerById);
router.post('/', validateBody(beerInputSchema), BeerController.createBeer);
router.put('/:id', validateParams(beerIdParamsSchema), validateBody(beerUpdateSchema), BeerController.updateBeer);
router.delete('/:id', validateParams(beerIdParamsSchema), BeerController.deleteBeer);

export default router;
