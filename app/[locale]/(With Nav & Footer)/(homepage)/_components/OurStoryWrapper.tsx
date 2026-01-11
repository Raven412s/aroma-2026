// app/[locale]/(With Nav & Footer)/(homepage)/_components/OurStoryWrapper.tsx

import { getLocale } from 'next-intl/server';
import { connectToDb } from '@/lib/mongodb';
import RestaurantStory from '@/models/RestaurantStory';
import OurStory from './OurStory';

export default async function OurStoryWrapper() {
  const locale = await getLocale();
  await connectToDb();

  const story = await RestaurantStory.findOne({ isActive: true });

  return (
    <OurStory
      description={story?.description[locale] || ''}
    />
  );
}
