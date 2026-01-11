"use client";
import { useEffect, useState } from "react";
import { Car, Clock, Coffee, Mail, MapPin, Phone, Utensils } from 'lucide-react';
import Link from 'next/link';
import { Map } from './_components/map';

type Location = {
    address: string[];
    gettingHere?: { steps?: string[]; mapEmbedSrc?: string };
    phoneNumbers?: string[];
    emails?: string[];
    openingHours?: string;
};

export default function FindUsPage() {
    const [locations, setLocations] = useState<Location[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data && data.locations && data.locations.length > 0) {
                    setLocations(data.locations);
                } else {
                    setLocations(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setLocations(null);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-3xl font-semibold">Loading...</div>;

    if (locations) {
        // Fallback: render the current static version
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 ">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-8 sm:py-12 md:py-16 lg:py-20">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
                            Find <span className="text-amber-300">Aroma</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed px-2">
                            Experience culinary excellence at our beautiful location.<br /> We&apos;re excited to welcome you!
                        </p>
                    </div>
                </div>
                            <div  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
                {
                    locations.map((location, index) => {
                        return (
                                <div key={index} className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 my-8">
                                    {/* Contact Information */}
                                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 border border-amber-100">
                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 flex items-center">
                                                <MapPin className="text-amber-600 mr-2 sm:mr-3" size={24} />
                                                Visit Us
                                            </h2>

                                            <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                                <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-amber-50 rounded-lg md:rounded-xl">
                                                    <MapPin className="text-amber-600 mt-1 flex-shrink-0" size={18} />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Address</h3>
                                                        {location.address.map((addLine: string, idx: number) => (
                                                            <p key={idx} className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                                                                {addLine}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-orange-50 rounded-lg md:rounded-xl">
                                                    <Phone className="text-orange-600 mt-1 flex-shrink-0" size={18} />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Phone</h3>
                                                        {location.phoneNumbers?.map((phNum: string, idx: number) => (
                                                            <p key={idx} className="text-gray-600 text-xs sm:text-sm md:text-base">{phNum}</p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-red-50 rounded-lg md:rounded-xl">
                                                    <Mail className="text-red-600 mt-1 flex-shrink-0" size={18} />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Email</h3>
                                                        {location.emails?.map((email: string, idx: number) => (
                                                            <p key={idx} className="text-gray-600 text-xs sm:text-sm md:text-base">{email}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Opening Hours */}
                                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 border border-amber-100">
                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 flex items-center">
                                                <Clock className="text-amber-600 mr-2 sm:mr-3" size={24} />
                                                Opening Hours
                                            </h2>

                                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                                <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-100">
                                                    <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">Monday - Thursday</span>
                                                    <span className="text-gray-600 text-xs sm:text-sm md:text-base">11:00 AM - 10:00 PM</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-100">
                                                    <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">Friday - Saturday</span>
                                                    <span className="text-gray-600 text-xs sm:text-sm md:text-base">11:00 AM - 11:00 PM</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 md:py-3">
                                                    <span className="font-medium text-gray-700 text-xs sm:text-sm md:text-base">Sunday</span>
                                                    <span className="text-gray-600 text-xs sm:text-sm md:text-base">12:00 PM - 10:00 PM</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Services */}
                                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 border border-amber-100">
                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8">Services</h2>

                                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                                <div className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl">
                                                    <Utensils className="text-amber-600 mx-auto mb-1 sm:mb-2" size={20} />
                                                    <p className="font-medium text-gray-700 text-[10px] sm:text-xs md:text-sm">Dine-In</p>
                                                </div>
                                                <div className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg md:rounded-xl">
                                                    <Car className="text-orange-600 mx-auto mb-1 sm:mb-2" size={20} />
                                                    <p className="font-medium text-gray-700 text-[10px] sm:text-xs md:text-sm">Free Parking</p>
                                                </div>
                                                <div className="text-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg md:rounded-xl">
                                                    <Coffee className="text-red-600 mx-auto mb-1 sm:mb-2" size={20} />
                                                    <p className="font-medium text-gray-700 text-[10px] sm:text-xs md:text-sm">Private Events</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map Section */}
                                    <div className="lg:sticky lg:top-8 ">
                                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden border border-amber-100">
                                            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-amber-600 to-orange-600">
                                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
                                                    <MapPin className="mr-2 md:mr-3" size={20} />
                                                    Our Location
                                                </h2>
                                                <p className="text-amber-100 mt-1 md:mt-2 text-xs sm:text-sm md:text-base">Find us on the map below</p>
                                            </div>

                                            {/* Map Placeholder */}
                                            <div className="h-48 sm:h-64 md:h-80 lg:h-[540px] bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                                                <Map mapSrc={location.gettingHere?.mapEmbedSrc || ""} />
                                            </div>

                                            <div className="p-3 sm:p-4 md:p-6 bg-gray-50">
                                                <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs md:text-sm text-gray-600 gap-1 sm:gap-2">
                                                    <span>📍 Easy to find location</span>
                                                    <span>🅿️ Free parking available</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Directions Card */}
                                        <div className="mt-4 sm:mt-6 md:mt-8 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 border border-amber-100">
                                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">Getting Here</h3>
                                            <div className="space-y-1 sm:space-y-2 md:space-y-3 text-gray-600 text-xs sm:text-sm md:text-base">
                                                {location.gettingHere?.steps?.map((step: string, i: number) => (
                                                    <p key={i} className="flex items-start">
                                                        {(() => {
                                                            const travelEmojis = ["🚗", "🚌", "🚇", "🚕", "🚲", "🏍️", "🛴", "🛵", "🚦", "🗺️", "🧭", "🚉", "🚂", "🚁", "✈️"];
                                                            const emoji = travelEmojis[i % travelEmojis.length];
                                                            return <span className="text-amber-600 mr-2">{emoji}</span>;
                                                        })()}
                                                        <span>{step}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )
                    })
                }
                                        {/* Call to Action */}
                                        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
                        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl md:shadow-2xl">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">Ready to Dine With Us?</h2>
                            <p className="text-base sm:text-lg md:text-xl text-amber-100 mb-3 sm:mb-4 md:mb-6">
                                Experience the perfect blend of flavors and ambiance at Aroma
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
                                <Link href={"/reservation"} className="bg-white text-amber-600 font-semibold px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-amber-50 transition-colors duration-300 shadow-md md:shadow-lg text-xs sm:text-sm md:text-base">
                                    Make a Reservation
                                </Link>
                                <button className="border-2 border-white text-white font-semibold px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl hover:bg-white hover:text-amber-600 transition-colors duration-300 text-xs sm:text-sm md:text-base">
                                    Call Now
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
                </div>
        );

    }

}
