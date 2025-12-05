import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
    user: mongoose.Types.ObjectId;
    balance: number;
    currency: string;
    createdAt: Date;
}

const WalletSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWallet>('Wallet', WalletSchema);
