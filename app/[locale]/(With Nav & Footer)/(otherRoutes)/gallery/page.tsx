"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
import { useEffect, useState } from 'react';

type LocaleString = 'en' | 'ar' | 'ru';

interface LocalizedTitle {
    title_en: string;
    title_ar: string;
    title_ru: string;
}

interface LocalizedName {
    name_en: string;
    name_ar: string;
    name_ru: string;
}

interface MenuItem extends LocalizedName {
    description_en: string;
    description_ar: string;
    description_ru: string;
    price: string;
    image: string;
}

interface MenuSection extends LocalizedTitle {
    sections: {
        section_en: string;
        section_ar: string;
        section_ru: string;
        items: MenuItem[];
    }[];
}

const GalleryPage = () => {
    const searchParams = useSearchParams()
    const selectedItemType = searchParams.get('selectedItemType')
    const [menuSection, setMenuSection] = useState<MenuSection | null>(null)
    const [items, setItems] = useState<MenuItem[]>([])
    const [locale, setLocale] = useState<LocaleString>('en')

    useEffect(() => {
        const fetchMenuSection = async () => {
            try {
                // Get the current locale from the URL path
                const pathLocale = window.location.pathname.split('/')[1] as LocaleString || 'en';
                setLocale(pathLocale);

                const response = await fetch(`/api/menu-sections/${selectedItemType}`);
                if (!response.ok) throw new Error('Failed to fetch menu section');

                const data = await response.json();
                setMenuSection(data);

                // Collect all items from all subsections
                const allItems = data.sections.reduce((acc: MenuItem[], section: MenuSection['sections'][0]) => {
                    return [...acc, ...section.items];
                }, []);

                setItems(allItems);
            } catch (error) {
                console.error('Error fetching menu section:', error);
            }
        };

        if (selectedItemType) {
            fetchMenuSection();
        }
    }, [selectedItemType]);

    const getLocalizedTitle = (section: MenuSection | null, loc: LocaleString): string => {
        if (!section) return '';
        return section[`title_${loc}` as keyof LocalizedTitle] || section.title_en;
    };

    const getLocalizedName = (item: MenuItem, loc: LocaleString): string => {
        return item[`name_${loc}` as keyof LocalizedName] || item.name_en;
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 pt-26">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-light mb-8 text-center capitalize">
                    {getLocalizedTitle(menuSection, locale)}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {items.map((item, index) => (
                        <div
                            key={`${item.image}-${index}`}
                            className="group relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <Image
                                alt={getLocalizedName(item, locale)}
                                src={item.image || '/placeholder.png'}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                priority={index < 4}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-xl font-medium text-center px-4">
                                        {getLocalizedName(item, locale)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GalleryPage
