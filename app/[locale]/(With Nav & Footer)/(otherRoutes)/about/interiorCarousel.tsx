"use client"
import React, { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { getStaticImage } from '@/lib/static-images'
const InteriorCarousel = () => {
    const autoplay = useRef(Autoplay({ delay: 4000 }))

    // Default fallback images
    const [interiorImages, setInteriorImages] = React.useState([
        { url: "/gallery/interiors/1.jpg", alt: "Interior 1" },
        { url: "/gallery/interiors/2.jpg", alt: "Interior 2" },
        { url: "/gallery/interiors/3.jpg", alt: "Interior 3" },
        { url: "/gallery/interiors/4.jpg", alt: "Interior 4" },
        { url: "/gallery/interiors/5.jpg", alt: "Interior 5" },
        { url: "/gallery/interiors/6.jpg", alt: "Interior 6" },
        { url: "/gallery/interiors/7.jpg", alt: "Interior 7" },
        { url: "/gallery/interiors/8.jpg", alt: "Interior 8" }
    ]);

    // Fetch interior images from database
    React.useEffect(() => {
        const fetchInteriorImages = async () => {
            try {
                const imagePromises = [
                    getStaticImage('interior-1'),
                    getStaticImage('interior-2'),
                    getStaticImage('interior-3'),
                    getStaticImage('interior-4'),
                    getStaticImage('interior-5'),
                    getStaticImage('interior-6'),
                    getStaticImage('interior-7'),
                    getStaticImage('interior-8')
                ];

                const results = await Promise.all(imagePromises);
                const newImages = results
                    .filter(img => img !== null)
                    .map(img => ({
                        url: img!.imageUrl,
                        alt: img!.altText
                    }));

                // Only update if we found at least one image
                if (newImages.length > 0) {
                    setInteriorImages(prevImages => {
                        const updatedImages = [...prevImages];
                        newImages.forEach((newImg, index) => {
                            if (index < updatedImages.length) {
                                updatedImages[index] = newImg;
                            }
                        });
                        return updatedImages;
                    });
                }
            } catch (error) {
                console.error('Error fetching interior images:', error);
                // Keep default images on error
            }
        };

        fetchInteriorImages();
    }, []);

    return (
        <div className="w-full bg-neutral-950">
            <div className="max-w-4xl mx-auto py-10">
                <Carousel
                    className="w-full"
                    opts={{ loop: true }}
                    plugins={[autoplay.current]}
                >
                    <CarouselContent>
                        {interiorImages.map((image, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center h-[400px] rounded-lg overflow-hidden w-fit">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={800}
                                    height={400}
                                    priority
                                    className="object-cover rounded-lg  shadow-lg w-full h-full"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}

export default InteriorCarousel
