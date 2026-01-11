'use client';
import {
    AnimatePresence,
    motion,
    PanInfo,
    useScroll,
    useTransform
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

interface Testimonial {
    _id: string;
    customerName: string;
    message: string;
    customerImage: string;
}

export default function TestimonialSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const y = useTransform(scrollYProgress, [0, 1.4], ["20%", "-20%"]);

    const fetchTestimonials = useCallback(async () => {
        try {
            const response = await fetch('/api/testimonials/active');
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            const data = await response.json();
            setTestimonials(data.testimonials);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const total = testimonials.length;

    const nextSlide = useCallback(() => {
        if (total === 0) return;
        setCurrentSlide((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        if (total === 0) return;
        setCurrentSlide((prev) => (prev - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (isDragging || total === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, isDragging, nextSlide, total]);

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (total === 0) return;
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;
        const swipe = offsetX + velocityX * 0.2;

        if (swipe < -50) {
            nextSlide();
        } else if (swipe > 50) {
            prevSlide();
        }

        setIsDragging(false);
    };

    const t = useTranslations("HomePage.TestimonialSection");

    if (loading) {
        return (
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/menu-hero.jpg')",
                    y: y,
                    filter: 'brightness(0.9)',
                }}
            />

            {/* Heading */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.h2
                    className="text-gold font-style text-5xl md:text-6xl lg:text-7xl text-amber-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {t('customer')}
                </motion.h2>
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mt-2 tracking-wider"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {t('testimonials')}
                </motion.h1>

                {/* Testimonial Carousel */}
                <div className="mt-16 w-full max-w-6xl relative mx-auto">
                    {/* Mobile View */}
                    <div className="block lg:hidden w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center text-white max-w-2xl mx-auto select-none"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg">
                                    <p className="text-lg md:text-xl italic mb-8">
                                        {testimonials[currentSlide].message}
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden">
                                            <Image
                                                src={'/face5.jpg'}
                                                alt={testimonials[currentSlide].customerName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <h3 className="ml-4 text-xl font-medium text-amber-400">
                                            {testimonials[currentSlide].customerName}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block w-full max-w-screen-lg mx-auto overflow-hidden" ref={containerRef}>
                        <motion.div
                            className="flex w-full transition-transform duration-500 ease-in-out"
                            animate={{ x: `-${currentSlide * 408}px` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {/* First spacer for centering */}
                            <div className="w-[calc((100%-1200px)/2)] flex-shrink-0" />

                            {testimonials.map((testimonial, i) => {
                                const isActive = i === currentSlide;
                                return (
                                    <motion.div
                                        key={testimonial._id}
                                        className={`w-[400px] mx-4 flex-shrink-0 text-white flex flex-col justify-between transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                                            }`}
                                        onClick={() => setCurrentSlide(i)}
                                    >
                                        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg h-full flex flex-col">
                                            <div className="flex-grow overflow-hidden">
                                                <p className="text-lg italic mb-8 line-clamp-6">{testimonial.message}</p>
                                            </div>
                                            <div className="flex items-center justify-center mt-auto pt-4">
                                                <div className="relative w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden">
                                                    <Image
                                                        src={'/face5.jpg'}
                                                        alt={testimonial.customerName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h3 className="ml-4 text-xl font-medium text-amber-400 truncate max-w-[180px]">
                                                    {testimonial.customerName}
                                                </h3>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Navigation dots */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`w-3 h-3 rounded-full ${currentSlide === i ? 'bg-amber-400' : 'bg-gray-400'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
