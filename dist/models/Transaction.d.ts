import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    fromWallet?: mongoose.Types.ObjectId;
    toWallet?: mongoose.Types.ObjectId;
    amount: number;
    type: 'DEPOSIT' | 'TRANSFER' | 'WITHDRAWAL';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
}
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, mongoose.DefaultSchemaOptions> & ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, ITransaction>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map