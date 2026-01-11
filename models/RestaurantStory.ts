import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantStory extends Document {
    tagline: {
        en: string;
        ar: string;
        ru: string;
    };
    description: {
        en: string;
        ar: string;
        ru: string;
    };
    author: {
        en: string;
        ar: string;
        ru: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const restaurantStorySchema = new Schema({
    tagline: {
        en: { type: String, required: [true, 'English tagline is required'], trim: true },
        ar: { type: String, required: [true, 'Arabic tagline is required'], trim: true },
        ru: { type: String, required: [true, 'Russian tagline is required'], trim: true }
    },
    description: {
        en: { type: String, required: [true, 'English description is required'], trim: true },
        ar: { type: String, required: [true, 'Arabic description is required'], trim: true },
        ru: { type: String, required: [true, 'Russian description is required'], trim: true }
    },
    author: {
        en: { type: String, required: [true, 'English author name is required'], trim: true },
        ar: { type: String, required: [true, 'Arabic author name is required'], trim: true },
        ru: { type: String, required: [true, 'Russian author name is required'], trim: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Only one story should be active at a time
restaurantStorySchema.pre('save', async function(next) {
    if (this.isActive) {
        await this.model('RestaurantStory').updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    next();
});

export default mongoose.models.RestaurantStory || mongoose.model<IRestaurantStory>('RestaurantStory', restaurantStorySchema);
