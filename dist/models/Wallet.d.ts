import mongoose, { Document } from 'mongoose';
export interface IWallet extends Document {
    user: mongoose.Types.ObjectId;
    balance: number;
    currency: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IWallet, {}, {}, {}, mongoose.Document<unknown, {}, IWallet, {}, mongoose.DefaultSchemaOptions> & IWallet & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IWallet>;
export default _default;
//# sourceMappingURL=Wallet.d.ts.map