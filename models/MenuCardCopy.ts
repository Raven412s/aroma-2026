import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuCardCopy extends Document {
    paragraphs: {
        en: string[];
        ar: string[];
        ru: string[];
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const menuCardCopySchema = new Schema({
    paragraphs: {
        en: { type: [String], required: true, default: [] },
        ar: { type: [String], required: true, default: [] },
        ru: { type: [String], required: true, default: [] },
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Only one MenuCardCopy should be active at a time
menuCardCopySchema.pre('save', async function(next) {
    if (this.isActive) {
        await this.model('MenuCardCopy').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    next();
});

export default mongoose.models.MenuCardCopy || mongoose.model<IMenuCardCopy>('MenuCardCopy', menuCardCopySchema);
