import { connectToDb } from '@/lib/mongodb';
import { Reservation } from '@/models/Reservation';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectToDb();

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!reservation) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        // Send confirmation email if status is confirmed and email exists
        if (body.status === 'confirmed' && reservation.email) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT),
                    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
                // Format date as '04 July 2025'
                let formattedDate = reservation.date;
                try {
                    const dateObj = new Date(reservation.date);
                    if (!isNaN(dateObj.getTime())) {
                        formattedDate = dateObj.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        });
                    }
                } catch {}
                await transporter.sendMail({
                    from: `"Aroma Indian & Arabic Restaurant" <${process.env.SMTP_USER}>`,
                    to: reservation.email,
                    subject: 'Your Reservation is Confirmed!',
                    text: `Dear ${reservation.name || 'Customer'},\n\nYour reservation for ${formattedDate} at ${reservation.time} has been confirmed.\n\nThank you for choosing Aroma Restaurant!`,
                });
            } catch (mailError) {
                console.error('Failed to send confirmation email:', mailError);
                // Don't fail the request if email fails
            }
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Error updating reservation:', error);
        return NextResponse.json(
            { error: 'Failed to update reservation' },
            { status: 500 }
        );
    }
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await connectToDb();

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reservation' },
            { status: 500 }
        );
    }
}
