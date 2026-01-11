import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    occasion: { type: String },
    dietaryRestrictions: { type: String },
    specialRequests: { type: String },
    tablePreference: { type: String },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

export const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
