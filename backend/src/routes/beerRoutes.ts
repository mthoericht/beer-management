import { Router } from 'express';
import { BeerController } from '../controllers/BeerController';

const router = Router();

// Beer routes
router.get('/', BeerController.getAllBeers);
router.get('/stats', BeerController.getBeerStats);
router.get('/:id', BeerController.getBeerById);
router.post('/', BeerController.createBeer);
router.put('/:id', BeerController.updateBeer);
router.delete('/:id', BeerController.deleteBeer);

export default router;
