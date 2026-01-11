'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const images = [
  '/plated.png',
  '/plated2.png',
  '/plated3.png',
];

export const PlatesGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Get scroll progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'center end'],
  });

  // Smooth the scroll for smoother rotation
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 15,
  });

  // Rotate range: scroll down -> clockwise, scroll up -> anticlockwise
  const rotate = useTransform(smoothScroll, [0, 1], ['90deg', '-90deg']);

  return (
    <div ref={containerRef} className="hidden lg:block py-20 px-4 max-w-screen w-full bg-gradient-to-b from-teal-100 to-gray-900  to-95% overflow-hidden">
      <div className="grid  md:grid-cols-3 gap-8  h-[400px] w-full">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            style={{ rotate }}
            className="w-full h-full  relative overflow-hidden rounded-full p-20 flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`Plate ${idx + 1}`}
              width={600}
              height={600}
              className="object-cover "
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
