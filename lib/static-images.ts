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
        const response = await fetch(`/api/static-images?search=${encodeURIComponent(name)}`);
        if (!response.ok) throw new Error('Failed to fetch image');

        const images = await response.json();
        return images.find((img: StaticImageData) => img.name === name) || null;
    } catch (error) {
        console.error('Error fetching static image:', error);
        return null;
    }
}

export async function getStaticImagesByCategory(category: string): Promise<StaticImageData[]> {
    try {
        const response = await fetch(`/api/static-images?category=${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error('Failed to fetch images');

        return await response.json();
    } catch (error) {
        console.error('Error fetching static images by category:', error);
        return [];
    }
}

export async function getAllStaticImages(): Promise<StaticImageData[]> {
    try {
        const response = await fetch('/api/static-images');
        if (!response.ok) throw new Error('Failed to fetch images');

        return await response.json();
    } catch (error) {
        console.error('Error fetching all static images:', error);
        return [];
    }
}
