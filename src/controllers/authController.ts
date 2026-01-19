import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Wallet from '../models/Wallet';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, phoneNumber, password } = req.body;

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            phoneNumber,
            password: hashedPassword,
        });

        await user.save();

        // Create a wallet for the user
        const wallet = new Wallet({
            user: user._id,
        });
        await wallet.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, password } = req.body;
        console.log(phoneNumber, password);
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '24h',
        });

        res.json({ token, user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
