import { Types } from 'mongoose';

interface MongoDocument {
    _id: Types.ObjectId;
}

export interface MenuItem extends MongoDocument {
    name: string;
    name_en: string;
    name_ar: string;
    description: string;
    description_en: string;
    description_ar: string;
    price: string;
    image: string;
    section: string;
    title: string;
}

export interface MenuSubSection {
    section: string;
    section_en: string;
    section_ar: string;
    items: MenuItem[];
}

export interface MenuSection extends MongoDocument {
    title: string;
    title_en: string;
    title_ar: string;
    sections: MenuSubSection[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ExtendedMenuItem extends MenuItem {
    section: string;
    title: string;
}
