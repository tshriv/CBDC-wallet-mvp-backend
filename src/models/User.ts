import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    phoneNumber: string;
    password: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
