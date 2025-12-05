import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

export const getBalance = async (req: AuthRequest, res: Response) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance, currency: wallet.currency });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const loadFunds = async (req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be positive' });
        }

        const wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.balance += amount;
        await wallet.save();

        const transaction = new Transaction({
            toWallet: wallet._id,
            amount,
            type: 'DEPOSIT',
            status: 'COMPLETED',
        });
        await transaction.save();

        res.json({ message: 'Funds loaded successfully', balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const transferFunds = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { toPhoneNumber, amount } = req.body;
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be positive' });
        }

        const senderWallet = await Wallet.findOne({ user: req.user.id }).session(session);
        if (!senderWallet || senderWallet.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        const recipientUser = await User.findOne({ phoneNumber: toPhoneNumber }).session(session);
        if (!recipientUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const recipientWallet = await Wallet.findOne({ user: recipientUser._id }).session(session);
        if (!recipientWallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Recipient wallet not found' });
        }

        senderWallet.balance -= amount;
        await senderWallet.save();

        recipientWallet.balance += amount;
        await recipientWallet.save();

        const transaction = new Transaction({
            fromWallet: senderWallet._id,
            toWallet: recipientWallet._id,
            amount,
            type: 'TRANSFER',
            status: 'COMPLETED',
        });
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Transfer successful', balance: senderWallet.balance });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const wallet = await Wallet.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const transactions = await Transaction.find({
            $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }],
        })
            .sort({ createdAt: -1 })
            .populate('fromWallet', 'user')
            .populate('toWallet', 'user');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
