import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/mongodb';
import { MenuSection } from '@/models/MenuSection';
import { MultilingualMenuSubSection } from '@/types';
import { Types } from 'mongoose';

// DELETE Handler
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
  try {
    await connectToDb();
    const {id}=await params
    const objectId = new Types.ObjectId(id);

    const menuSection = await MenuSection.findOne({
      'sections.items._id': objectId
    });

    if (!menuSection) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    menuSection.sections.forEach((subSection: MultilingualMenuSubSection) => {
      subSection.items = subSection.items.filter(
        (item) => !item._id.equals(objectId)
      );
    });

    menuSection.sections = menuSection.sections.filter(
      (subSection: MultilingualMenuSubSection) => subSection.items.length > 0
    );

    if (menuSection.sections.length === 0) {
      await MenuSection.deleteOne({ _id: menuSection._id });
    } else {
      await menuSection.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    await connectToDb();
    const {id}= await params
    const body = await request.json();
    try {
        const updated = await MenuSection.findByIdAndUpdate(id, body, { new: true });
        if (!updated) {
          return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
      } catch {
        return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
      }
}

// GET Handler
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    await connectToDb();
    const { id } = await params;
    try {
        const section = await MenuSection.findById(id);
        if (!section) {
          return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json(section);
      } catch {
        return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
      }
    }
