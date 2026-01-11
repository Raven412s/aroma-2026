"use client"
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { MenuSection } from '../../(homepage)/_components/MenuSection'
import { getStaticImage } from '@/lib/static-images'
import React from 'react'

const MenuPage = () => {
    const t = useTranslations('MenuPage');

    // Default fallback image
    const [heroImage, setHeroImage] = React.useState({
        url: "/menu-hero.jpg",
        alt: "Restaurant Menu"
    });

    // Fetch hero image from database
    React.useEffect(() => {
        const fetchHeroImage = async () => {
            try {
                const image = await getStaticImage('Menu-page Hero');
                if (image) {
                    setHeroImage({
                        url: image.imageUrl,
                        alt: image.altText
                    });
                }
            } catch (error) {
                console.error('Error fetching menu hero image:', error);
                // Keep default image on error
            }
        };

        fetchHeroImage();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    priority
                    className="object-cover brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h1 className="text-6xl md:text-6xl  mb-4 text-center font-style">
                        {t('checkOut')}
                    </h1>
                    <h2 className="text-5xl md:text-7xl font-bold font-display text-center">
                        {t('ourMenus')}
                    </h2>
                </div>
            </div>

            <MenuSection />

        </div>
    )
}

export default MenuPage
