import { NextResponse } from 'next/server';
import {connectToDb} from '@/lib/mongodb';
import MenuCardCopy from '@/models/MenuCardCopy';

// GET: Fetch the active MenuCardCopy
export async function GET() {
    await connectToDb();
    const active = await MenuCardCopy.findOne({ isActive: true }).lean();
    if (!active) {
        return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(active);
}

// POST: Create a new MenuCardCopy (sets as active)
export async function POST(req: Request) {
    await connectToDb();
    const body = await req.json();
    const created = await MenuCardCopy.create({ ...body, isActive: true });
    return NextResponse.json(created, { status: 201 });
}

// PUT: Update the active MenuCardCopy (by _id in body)
export async function PUT(req: Request) {
    await connectToDb();
    const body = await req.json();
    if (!body._id) {
        return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
    }
    const updated = await MenuCardCopy.findByIdAndUpdate(
        body._id,
        { paragraphs: body.paragraphs, isActive: true },
        { new: true }
    );
    if (!updated) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
}
