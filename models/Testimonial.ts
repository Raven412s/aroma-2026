import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    message: string;
    customerName: string;
    customerImage?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testimonialSchema = new Schema({
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
    },
    customerImage: {
        type: String,
        default: '/testimonial-avatar.jpg',
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Update the updatedAt timestamp before saving
testimonialSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
