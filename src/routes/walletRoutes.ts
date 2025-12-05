import express from 'express';
import { auth } from '../middlewares/authMiddleware';
import { getBalance, loadFunds, transferFunds, getTransactions } from '../controllers/walletController';

const router = express.Router();

router.get('/balance', auth, getBalance);
router.post('/load', auth, loadFunds);
router.post('/transfer', auth, transferFunds);
router.get('/transactions', auth, getTransactions);

export default router;
