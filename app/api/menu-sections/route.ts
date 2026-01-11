import { connectToDb } from '@/lib/mongodb';
import { MenuSection } from '@/models/MenuSection';
import { MultilingualMenuSection, PaginatedResponse } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        await connectToDb();

        // Get parameters from URL
        const { searchParams } = new URL(request.url);
        const getAll = searchParams.get('all') === 'true';
        const search = searchParams.get('search')?.trim();

        if (getAll) {
            // Get all sections without pagination
            const sections = await MenuSection.find({}).lean().exec() as unknown as MultilingualMenuSection[];
            return NextResponse.json(sections);
        }

        // Get pagination parameters from URL
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // If search is present, search in menu items
        if (search) {
            // Build a case-insensitive regex
            const regex = new RegExp(search, 'i');

            // Count total matching items
            const totalItems = await MenuSection.aggregate([
                { $unwind: '$sections' },
                { $unwind: '$sections.items' },
                { $match: {
                    $or: [
                        { 'sections.items.name_en': regex },
                        { 'sections.items.name_ar': regex },
                        { 'sections.items.name_ru': regex },
                        { 'sections.items.description_en': regex },
                        { 'sections.items.description_ar': regex },
                        { 'sections.items.description_ru': regex },
                        { 'sections.items.price': regex },
                        { 'sections.section_en': regex },
                        { 'sections.section_ar': regex },
                        { 'sections.section_ru': regex },
                        { 'title_en': regex },
                        { 'title_ar': regex },
                        { 'title_ru': regex },
                    ]
                } },
                { $count: 'total' }
            ]);
            const total = totalItems[0]?.total || 0;

            // Get paginated matching items
            const items = await MenuSection.aggregate([
                { $unwind: '$sections' },
                { $unwind: '$sections.items' },
                { $match: {
                    $or: [
                        { 'sections.items.name_en': regex },
                        { 'sections.items.name_ar': regex },
                        { 'sections.items.name_ru': regex },
                        { 'sections.items.description_en': regex },
                        { 'sections.items.description_ar': regex },
                        { 'sections.items.description_ru': regex },
                        { 'sections.items.price': regex },
                        { 'sections.section_en': regex },
                        { 'sections.section_ar': regex },
                        { 'sections.section_ru': regex },
                        { 'title_en': regex },
                        { 'title_ar': regex },
                        { 'title_ru': regex },
                    ]
                } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: '$sections.items._id',
                        name_en: '$sections.items.name_en',
                        name_ar: '$sections.items.name_ar',
                        name_ru: '$sections.items.name_ru',
                        description_en: '$sections.items.description_en',
                        description_ar: '$sections.items.description_ar',
                        description_ru: '$sections.items.description_ru',
                        price: '$sections.items.price',
                        image: '$sections.items.image',
                        section: '$sections.section_en',
                        title: '$title_en',
                    }
                }
            ]);

            // Return as a paginated response
            const response = {
                data: items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
            return NextResponse.json(response);
        }

        // Get total count for pagination
        const totalItems = await MenuSection.aggregate([
            { $unwind: '$sections' },
            { $unwind: '$sections.items' },
            { $count: 'total' }
        ]);

        const total = totalItems[0]?.total || 0;

        // Get paginated sections
        const sections = await MenuSection.aggregate([
            { $unwind: '$sections' },
            { $unwind: '$sections.items' },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    title_en: { $first: '$title_en' },
                    title_ar: { $first: '$title_ar' },
                    title_ru: { $first: '$title_ru' },
                    sections: {
                        $push: {
                            section: '$sections.section',
                            section_en: '$sections.section_en',
                            section_ar: '$sections.section_ar',
                            section_ru: '$sections.section_ru',
                            items: ['$sections.items']
                        }
                    }
                }
            }
        ]) as MultilingualMenuSection[];

        const response: PaginatedResponse<MultilingualMenuSection> = {
            data: sections,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching menu sections:", error);
        return new NextResponse("Failed to fetch menu sections", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Connect to the database
        await connectToDb();

        // Create a new menu section
        const menuSection = await MenuSection.create(body);

        return NextResponse.json(menuSection, { status: 201 });
    } catch (error) {
        console.error('Error creating menu section:', error);
        return NextResponse.json(
            { error: 'Failed to create menu section' },
            { status: 500 }
        );
    }
}
