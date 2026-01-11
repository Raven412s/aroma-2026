"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getStaticImagesByCategory } from '@/lib/static-images';

interface OurStoryProps {
    description: string;
}
const OurStory: React.FC<OurStoryProps> = ({ description }) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const cardY = useTransform(scrollYProgress, [0, 1.2], [40, -60]);

    // Default fallback images
    const [storyImages, setStoryImages] = React.useState([
        { url: "/story-sec-dish1.jpg", alt: "Dish 1" },
        { url: "/story-sec-dish2.jpg", alt: "Dish 2" }
    ]);

    // Fetch story images from database
    React.useEffect(() => {
        const fetchStoryImages = async () => {
            try {
                const images = await getStaticImagesByCategory('about');
                if (images.length >= 2) {
                    setStoryImages(images.slice(0, 2).map(img => ({
                        url: img.imageUrl,
                        alt: img.altText
                    })));
                }
            } catch (error) {
                console.error('Error fetching story images:', error);
                // Keep default images on error
            }
        };

        fetchStoryImages();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };
    const t = useTranslations("HomePage.OurStory")
    return (
        <section
            ref={sectionRef}
            className="relative py-12 sm:py-16 md:py-24  overflow-hidden "
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="flex flex-col lg:flex-row gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Story Card */}
                    <motion.div
                        className="relative z-10 lg:left-14 bg-white rounded-lg p-6 sm:p-8 lg:p-10 xl:p-12 lg:w-2/5 flex flex-col justify-center shadow-lg max-h-max"
                        variants={itemVariants}
                        style={{ y: cardY }}
                    >
                        <h3 className="text-3xl sm:text-4xl md:text-[52px] leading-snug text-orange-400 font-style font-light mb-2">
                            {t('discover')}
                        </h3>
                        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 font-display">
                            {t('ourStory')}
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg mb-8">
                            {description}
                        </p>
                        <div className="mt-auto">
                            <Link
                                href="/about"
                                className="inline-block text-amber-600 border-b border-amber-600 pb-1 hover:text-amber-700 transition-colors"
                            >
                                {t('learnMore')}
                            </Link>
                        </div>
                    </motion.div>

                    {/* Food Images */}
                    <motion.div
                        className="md:flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-6 flex-1 hidden"
                        variants={itemVariants}
                    >
                        {storyImages.map((image, index) => (
                            <div key={index} className="w-full sm:w-1/2 lg:w-full xl:w-1/2">
                                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover rounded-md hover:scale-105 transition-transform duration-300 ease-in-out"
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default OurStory;
