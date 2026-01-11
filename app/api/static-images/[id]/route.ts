import { connectToDb } from '@/lib/mongodb';
import { StaticImage } from '@/models/StaticImage';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to delete image from Cloudinary
async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// GET: Fetch a specific static image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDb();
    const { id } = await params;

    const image = await StaticImage.findById(id);

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching static image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch static image' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific static image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDb();
    const { id } = await params;
    const body = await request.json();

    const existingImage = await StaticImage.findById(id);
    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it conflicts with existing image
    if (body.name && body.name !== existingImage.name) {
      const nameConflict = await StaticImage.findOne({
        name: body.name,
        _id: { $ne: id }
      });
      if (nameConflict) {
        return NextResponse.json(
          { error: 'Image with this name already exists' },
          { status: 400 }
        );
      }
    }

    // If image URL is being changed and old image was from Cloudinary, delete it
    if (body.imageUrl && body.imageUrl !== existingImage.imageUrl && existingImage.cloudinaryPublicId) {
      await deleteFromCloudinary(existingImage.cloudinaryPublicId);
    }

    const updatedImage = await StaticImage.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating static image:', error);
    return NextResponse.json(
      { error: 'Failed to update static image' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific static image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDb();
    const { id } = await params;

    const image = await StaticImage.findById(id);
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if it's a Cloudinary image
    if (image.cloudinaryPublicId) {
      await deleteFromCloudinary(image.cloudinaryPublicId);
    }

    await StaticImage.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting static image:', error);
    return NextResponse.json(
      { error: 'Failed to delete static image' },
      { status: 500 }
    );
  }
}
