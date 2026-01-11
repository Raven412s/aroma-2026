import { connectToDb } from './mongodb';
import { StaticImage } from '@/models/StaticImage';

export interface StaticImageData {
    _id: string;
    name: string;
    description?: string;
    category: 'hero' | 'gallery' | 'logo' | 'background' | 'separator' | 'menu' | 'about' | 'testimonial';
    imageUrl: string;
    cloudinaryPublicId?: string;
    altText: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getStaticImage(name: string): Promise<StaticImageData | null> {
    try {
        await connectToDb();
        const image = await StaticImage.findOne({ name, isActive: true });
        return image ? image.toObject() : null;
    } catch (error) {
        console.error('Error fetching static image:', error);
        return null;
    }
}

export async function getStaticImagesByCategory(category: string): Promise<StaticImageData[]> {
    try {
        await connectToDb();
        const images = await StaticImage.find({ category, isActive: true }).sort({ createdAt: -1 });
        return images.map(img => img.toObject());
    } catch (error) {
        console.error('Error fetching static images by category:', error);
        return [];
    }
}

export async function getAllStaticImages(): Promise<StaticImageData[]> {
    try {
        await connectToDb();
        const images = await StaticImage.find({ isActive: true }).sort({ category: 1, createdAt: -1 });
        return images.map(img => img.toObject());
    } catch (error) {
        console.error('Error fetching all static images:', error);
        return [];
    }
}
