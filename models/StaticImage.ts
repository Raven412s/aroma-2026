import mongoose, { Schema, Document } from 'mongoose';

export interface IStaticImage extends Document {
    name: string;
    description?: string;
    category: 'hero' | 'gallery' | 'logo' | 'background' | 'separator' | 'menu' | 'about' | 'testimonial';
    imageUrl: string;
    cloudinaryPublicId?: string;
    altText: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const staticImageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Image name is required'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ['hero', 'gallery', 'logo', 'background', 'separator', 'menu', 'about', 'testimonial'],
        required: [true, 'Category is required'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true,
    },
    cloudinaryPublicId: {
        type: String,
        trim: true,
    },
    altText: {
        type: String,
        required: [true, 'Alt text is required for accessibility'],
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Index for efficient queries
staticImageSchema.index({ category: 1, isActive: 1 });
staticImageSchema.index({ name: 1 });

export const StaticImage = mongoose.models.StaticImage || mongoose.model('StaticImage', staticImageSchema);
