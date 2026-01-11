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

// GET: Fetch all static images with optional filtering
export async function GET(request: Request) {
  try {
    await connectToDb();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      // If search is an exact name match, prioritize it
      const exactNameMatch = await StaticImage.findOne({ name: search, isActive: true });
      if (exactNameMatch) {
        return NextResponse.json([exactNameMatch]);
      }

      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } }
      ];
    }

    const images = await StaticImage.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching static images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch static images' },
      { status: 500 }
    );
  }
}

// POST: Create a new static image
export async function POST(request: Request) {
  try {
    await connectToDb();
    const body = await request.json();

    // Check if image with same name already exists
    const existingImage = await StaticImage.findOne({ name: body.name });
    if (existingImage) {
      return NextResponse.json(
        { error: 'Image with this name already exists' },
        { status: 400 }
      );
    }

    const image = await StaticImage.create(body);

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating static image:', error);
    return NextResponse.json(
      { error: 'Failed to create static image' },
      { status: 500 }
    );
  }
}

// PUT: Update a static image
export async function PUT(request: Request) {
  try {
    await connectToDb();
    const body = await request.json();

    if (!body._id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Check if name is being changed and if it conflicts with existing image
    const existingImage = await StaticImage.findById(body._id);
    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    if (body.name && body.name !== existingImage.name) {
      const nameConflict = await StaticImage.findOne({
        name: body.name,
        _id: { $ne: body._id }
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
      body._id,
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
