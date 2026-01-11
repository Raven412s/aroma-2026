import SeparatorParallax from '@/components/global/SeparatorParallax'
import HeroSection from './_components/HeroSection'
import LocationSection from './_components/LocationSection'

import TestimonialSection from './_components/TestimonialSection'
import { MenuSection } from './_components/MenuSection'
import OurStoryWrapper from './_components/OurStoryWrapper'


const HomePage = () => {
    return (
        <div className='bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'>
            <HeroSection />
            <OurStoryWrapper />
            <SeparatorParallax
                imageName="homepage-separator-1"
            />
            {/* MENU SECTION */}
            <MenuSection isOnHomepage />
            <SeparatorParallax
                imageName="homepage-separator-2"
            />
            <LocationSection direction='rtl' />
            <TestimonialSection />

        </div>
    )
}

export default HomePage
