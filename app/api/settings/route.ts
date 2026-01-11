import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  await connectToDb();
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = await Settings.create({ locations: [] });
  }
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  await connectToDb();
  const body = await request.json();
  let settings = await Settings.findOne({});
  if (settings) {
    return NextResponse.json({ error: 'Settings already exist' }, { status: 409 });
  }
  settings = await Settings.create(body);
  return NextResponse.json(settings, { status: 201 });
}

export async function PUT(request: NextRequest) {
  await connectToDb();
  const body = await request.json();
  let settings = await Settings.findOne({});
  if (!settings) {
    settings = await Settings.create(body);
  } else {
    settings.set(body);
    await settings.save();
  }
  return NextResponse.json(settings);
}
