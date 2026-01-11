import { Document, Types } from 'mongoose';

export type NutritionInfo = {
    Calories: number;
    "Total Fat": string;
    Cholesterol: string;
    Sodium: string;
    "Total Carbohydrates": string;
    Protein: string;
};

export interface MenuItem {
    name: string;
    price: string;
    description: string;
    image?: string; // Optional image URL for the dish
}

export interface MenuSubSection {
    section: string | null;
    items: MenuItem[];
}

export interface MenuSection {
    title: string;
    sections: MenuSubSection[];
}


export interface NutritionPopupProps {
    info: NutritionInfo;
    position: 'left' | 'right';
    itemRect: DOMRect | null;
    image?: string;
}

// Base interface for MongoDB documents
export interface MongoDocument extends Document {
    _id: Types.ObjectId;
}

// Multilingual interfaces with MongoDB document support
export interface MultilingualMenuItem extends MongoDocument {
    // English fields
    name_en: string;
    description_en: string;

    // Arabic fields
    name_ar: string;
    description_ar: string;

    // Russian fields
    name_ru: string;
    description_ru: string;

    // Common fields
    price: string;
    image?: string;
}

export interface MultilingualMenuSubSection extends MongoDocument {
    section_en?: string;
    section_ar?: string;
    section_ru?: string;
    items: MultilingualMenuItem[];
}

export interface MultilingualMenuSection extends MongoDocument {
    title_en: string;
    title_ar: string;
    title_ru: string;
    sections: MultilingualMenuSubSection[];
}

// Type for the form values (without MongoDB fields)
export interface MenuSectionFormValues {
    title_en: string;
    title_ar: string;
    title_ru: string;
    sections: {
        section_en?: string;
        section_ar?: string;
        section_ru?: string;
        items: {
            name_en: string;
            name_ar: string;
            name_ru: string;
            description_en: string;
            description_ar: string;
            description_ru: string;
            price: string;
            image?: string;
        }[];
    }[];
}

// Generic type for paginated responses
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MenuCardCopy {
    _id?: string;
    paragraphs: {
        en: string[];
        ar: string[];
        ru: string[];
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
