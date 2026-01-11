"use client"

import { Button } from '@/components/ui/button';
import { MultilingualMenuSection as MSInterface, MultilingualMenuItem, MultilingualMenuSubSection } from '@/types';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// Type guard to check if a key exists on an object
const hasKey = <T extends object>(obj: T, key: string | number | symbol): key is keyof T => {
    return key in obj;
};

// Helper function to safely get localized value
const getLocalizedValue = (
    obj: MSInterface | MultilingualMenuSubSection | MultilingualMenuItem,
    field: 'title' | 'section' | 'name' | 'description',
    locale: string
): string => {
    const key = `${field}_${locale}` as keyof typeof obj;
    return hasKey(obj, key) ? String(obj[key]) : '';
};

const breakpointColumnsObj = {
    default: 2,
    1024: 2,
    640: 1,
};

interface MenuCardProps {
    card: MSInterface;
}

const MenuCard: React.FC<MenuCardProps> = ({ card }) => {
    const menuCardRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const locale = useLocale();
    const setItemRef = (itemName: string) => (el: HTMLDivElement | null) => {
        itemRefs.current[itemName] = el;
    };

    return (
        <motion.div
            className="rounded-xl relative bg-blend-luminosity"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 0 }}
        >
            <div
                key={getLocalizedValue(card, 'title', locale)}
                ref={menuCardRef}
                className="border border-black rounded-xl p-4 sm:p-6 md:p-8 relative bg-gray-50 shadow-2xl/75 shadow-black/50"
            >
                <div className="rounded-lg p-4 sm:p-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-2 tracking-wide pb-2">
                        {getLocalizedValue(card, 'title', locale)}
                    </h2>

                    {card.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className={sectionIndex > 0 ? "mt-4 sm:mt-6" : ""}>
                            {getLocalizedValue(section, 'section', locale) && (
                                <div className="bg-neutral-900 text-white rounded-t-md px-3 py-1 sm:px-4 sm:py-2 text-lg sm:text-xl font-display font-semibold tracking-wide">
                                    {getLocalizedValue(section, 'section', locale)}
                                </div>
                            )}

                            {section.items.map((item) => (
                                <div
                                    key={getLocalizedValue(item, 'name', locale)}
                                    ref={setItemRef(getLocalizedValue(item, 'name', locale))}
                                    className={`px-3 py-3 sm:px-4 sm:py-4 relative group`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={getLocalizedValue(item, 'name', locale)}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="text-xl sm:text-2xl font-display font-semibold">
                                                {getLocalizedValue(item, 'name', locale)}
                                            </span>
                                        </div>
                                        <span className="text-xl sm:text-2xl font-display font-semibold min-w-max">{item.price}</span>
                                    </div>
                                    <div className="text-base sm:text-lg font-medium mt-1">{getLocalizedValue(item, 'description', locale)}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const CardWrapper: React.FC<{ card: MSInterface; index: number }> = ({ card, index }) => {
    const [cardRef, cardInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '-50px 0px'
    });

    return (
        <motion.div
            ref={cardRef}
            variants={itemVariants}
            initial="hidden"
            animate={cardInView ? "visible" : "hidden"}
            transition={{ delay: index * 0.1 }}
        >
            <MenuCard card={card} />
        </motion.div>
    );
};

export const MenuSection = ({ isOnHomepage = false }: { isOnHomepage?: boolean }) => {
    const t = useTranslations('MenuSection');
    const [menuData, setMenuData] = useState<MSInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();
    const [menuCopy, setMenuCopy] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    // Specials titles to match (case-insensitive, all locales)
    const specials = [
        "chef's special",
        "today's special",
        'aroma recommends',
        'customer favorites',
    ];

    // Helper to check if a card is a special
    const isSpecial = (card: MSInterface) => {
        // Check all possible title fields for all locales
        return Object.keys(card)
            .filter((key) => key.startsWith('title_'))
            .some((key) => {
                const value = String(card[key as keyof MSInterface] || '').toLowerCase();
                return specials.some((special) => value === special);
            });
    };

    // Inside useEffect
    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true);
                setError(null);

                const [menuRes, copyRes] = await Promise.all([
                    fetch('/api/menu-sections?all=true'),
                    fetch('/api/menu-copy')
                ]);

                if (!menuRes.ok || !copyRes.ok) {
                    throw new Error('Failed to fetch menu or intro copy');
                }

                const menuData = await menuRes.json();
                const copyData = await copyRes.json();

                setMenuData(menuData);

                if (copyData?.paragraphs?.[locale]) {
                    setMenuCopy(copyData.paragraphs[locale]);
                }

            } catch (err) {
                console.error("Error fetching menu/copy:", err);
                setError(t('fetchError'));
            } finally {
                setLoading(false);
            }
        }

        fetchMenu();
    }, [locale, t]);

    useEffect(() => {
        // Detect mobile screen
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter menuData if isOnHomepage is true
    const displayedMenuData = isOnHomepage ? menuData.filter(isSpecial) : menuData;
    console.log(displayedMenuData)
    if (error) {
        return (
            <div className="px-4 sm:px-6 md:px-8 py-6 md:py-12 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    {t('retry')}
                </Button>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 md:px-8 py-6 md:py-12 relative left-1/2 -translate-x-1/2 max-w-7xl overflow-hidden">
            {/* Menu Copy Content */}
            <motion.div className="bg-neutral-900 text-white rounded-md p-6 sm:p-8 md:p-12 mb-6">
                <motion.div className="flex flex-col gap-6 md:gap-10" variants={containerVariants}>
                    <motion.div className="flex flex-col gap-2 md:gap-3 items-start" variants={itemVariants}>
                        <h1 className="text-3xl sm:text-4xl md:text-[52px] leading-snug font-style text-orange-300">
                            {t('discover')}
                        </h1>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display tracking-wide font-bold">
                            {t('menus')}
                        </h2>
                    </motion.div>
                    {menuCopy.length > 0 && (
                        <motion.div
                            className="flex flex-col gap-4 text-base sm:text-lg"
                            variants={itemVariants}
                        >
                            {menuCopy.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            {/* Cards with staggered animation */}
            {loading ? (
                <div className="col-span-2 text-center py-12">
                    <p>{t('loadingMenu')}</p>
                    <div className="mt-4 w-12 h-12 border-4 border-t-orange-300 border-gray-200 rounded-full animate-spin mx-auto"></div>
                </div>
            ) : displayedMenuData.length > 0 ? (
                isOnHomepage && isMobile ? (
                    <Carousel className="w-full " orientation='horizontal'>
                        <CarouselContent className='bg-transparent' >
                            {displayedMenuData.map((card, idx) => (
                                <CarouselItem key={`${getLocalizedValue(card, 'title', locale)}-${idx}`} className=" bg-transparent">
                                    <CardWrapper card={card} index={idx} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                ) : (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="flex gap-6 md:gap-10"
                        columnClassName="bg-clip-padding flex flex-col gap-6 md:gap-10 mb-10"
                    >
                        {displayedMenuData.map((card, idx) => (
                            <CardWrapper key={`${getLocalizedValue(card, 'title', locale)}-${idx}`} card={card} index={idx} />
                        ))}
                    </Masonry>
                )
            ) : (
                <div className="col-span-2 text-center py-12">
                    <p>No Menu Items</p>
                </div>
            )}
        </div>
    );
};
