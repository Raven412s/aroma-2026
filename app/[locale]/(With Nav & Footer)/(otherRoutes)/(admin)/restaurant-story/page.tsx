"use client";

import RestaurantStoryForm from "@/components/forms/RestaurantStoryForm";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { IRestaurantStory } from "@/models/RestaurantStory";

export default function RestaurantStoryPage() {
    const [story, setStory] = useState<IRestaurantStory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch('/api/restaurant-story');
                if (response.ok) {
                    const data = await response.json();
                    setStory(data);
                }
            } catch (error) {
                console.error('Error fetching restaurant story:', error);
                toast.error('Failed to fetch restaurant story');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    let formInitialData = undefined;
    if (story) {
        formInitialData = {
            _id: story._id?.toString?.() ?? undefined,
            tagline: story.tagline,
            description: story.description,
            author: story.author,
            isActive: story.isActive,
        };
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">
                {story ? 'Edit Restaurant Story' : 'Create Restaurant Story'}
            </h1>
            <RestaurantStoryForm initialData={formInitialData} />
        </div>
    );
}
