import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    fromWallet?: mongoose.Types.ObjectId;
    toWallet?: mongoose.Types.ObjectId;
    amount: number;
    type: 'DEPOSIT' | 'TRANSFER' | 'WITHDRAWAL';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
    fromWallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    toWallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['DEPOSIT', 'TRANSFER', 'WITHDRAWAL'], required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
