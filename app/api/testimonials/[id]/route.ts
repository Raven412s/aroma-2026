import { connectToDb } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDb();
    const { id } = await context.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return new NextResponse('Testimonial not found', { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return new NextResponse('Failed to fetch testimonial', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectToDb();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!testimonial) {
      return new NextResponse('Testimonial not found', { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return new NextResponse('Failed to update testimonial', { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDb();
    const { id } = await context.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return new NextResponse('Testimonial not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return new NextResponse('Failed to delete testimonial', { status: 500 });
  }
}
