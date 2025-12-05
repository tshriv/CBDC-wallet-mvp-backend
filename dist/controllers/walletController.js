"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.transferFunds = exports.loadFunds = exports.getBalance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const getBalance = async (req, res) => {
    try {
        const wallet = await Wallet_1.default.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance, currency: wallet.currency });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getBalance = getBalance;
const loadFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be positive' });
        }
        const wallet = await Wallet_1.default.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        wallet.balance += amount;
        await wallet.save();
        const transaction = new Transaction_1.default({
            toWallet: wallet._id,
            amount,
            type: 'DEPOSIT',
            status: 'COMPLETED',
        });
        await transaction.save();
        res.json({ message: 'Funds loaded successfully', balance: wallet.balance });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.loadFunds = loadFunds;
const transferFunds = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { toPhoneNumber, amount } = req.body;
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be positive' });
        }
        const senderWallet = await Wallet_1.default.findOne({ user: req.user.id }).session(session);
        if (!senderWallet || senderWallet.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        const recipientUser = await User_1.default.findOne({ phoneNumber: toPhoneNumber }).session(session);
        if (!recipientUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Recipient not found' });
        }
        const recipientWallet = await Wallet_1.default.findOne({ user: recipientUser._id }).session(session);
        if (!recipientWallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Recipient wallet not found' });
        }
        senderWallet.balance -= amount;
        await senderWallet.save();
        recipientWallet.balance += amount;
        await recipientWallet.save();
        const transaction = new Transaction_1.default({
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
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.transferFunds = transferFunds;
const getTransactions = async (req, res) => {
    try {
        const wallet = await Wallet_1.default.findOne({ user: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const transactions = await Transaction_1.default.find({
            $or: [{ fromWallet: wallet._id }, { toWallet: wallet._id }],
        })
            .sort({ createdAt: -1 })
            .populate('fromWallet', 'user')
            .populate('toWallet', 'user');
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getTransactions = getTransactions;
//# sourceMappingURL=walletController.js.map