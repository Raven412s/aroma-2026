import SeparatorParallax from '@/components/global/SeparatorParallax'
import { getTranslations, getLocale } from 'next-intl/server'
import Image from 'next/image'
import LocationSection from '../../(homepage)/_components/LocationSection'
import GallerySection from './galleySection'
import InteriorCarousel from './interiorCarousel'
import { connectToDb } from '@/lib/mongodb'
import RestaurantStory from '@/models/RestaurantStory'
import { MenuSection } from '@/models/MenuSection'

async function getRestaurantStory() {
    try {
        await connectToDb();
        const story = await RestaurantStory.findOne({ isActive: true });
        return story || null;
    } catch (error) {
        console.error('Error fetching restaurant story:', error);
        return null;
    }
}

async function getMenuSections(locale: string) {
    try {
        await connectToDb();
        const menuSections = await MenuSection.find({});

        // Transform menu sections into gallery format
        const galleryData = menuSections.map(section => {
            // Get the first item with an image from the first section
            let imageSrc = '/placeholder.png'; // default fallback
            const title = section[`title_${locale}`] || section.title_en;

            // Find first item with an image
            for (const subSection of section.sections) {
                for (const item of subSection.items) {
                    if (item.image) {
                        imageSrc = item.image;
                        break;
                    }
                }
                if (imageSrc !== '/placeholder.png') break;
            }

            return {
                imgSrc: imageSrc,
                name: title
            };
        });

        return galleryData;
    } catch (error) {
        console.error('Error fetching menu sections:', error);
        return [];
    }
}

export default async function AboutPage() {
    const t = await getTranslations('AboutPage')
    const locale = await getLocale()
    const story = await getRestaurantStory();
    const gallery = await getMenuSections(locale);

    return (
        <div className='bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'>
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src="/about-hero.jpg"
                    alt="Restaurant Menu"
                    fill
                    priority
                    className="object-cover brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h1 className="text-6xl md:text-6xl mb-4 text-center font-style">
                        {t('hero.discover')}
                    </h1>
                    <h2 className="text-5xl md:text-7xl font-bold font-display text-center">
                        {t('hero.aboutUs')}
                    </h2>
                </div>
            </div>
            <InteriorCarousel />
            <LocationSection direction='ltr' />

            {story && (
                <div className="bg-neutral-950 text-white py-16">
                    <div className="max-w-3xl flex flex-col items-center justify-center py-7 mx-auto space-y-6">
                        <p className='uppercase font-bold'>{story.tagline[locale]}</p>
                        <p className='font-semibold text-4xl text-center leading-normal'>{story.description[locale]}</p>
                        <span className='text-5xl font-style font-semibold'>{story.author[locale]}</span>
                    </div>
                </div>
            )}

            <GallerySection gallery={gallery} />

            <SeparatorParallax imageSrc='/chocolate-explosion.jpg' />

        </div>
    )
}
