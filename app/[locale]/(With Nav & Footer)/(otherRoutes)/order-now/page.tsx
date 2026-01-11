import { Phone, Clock, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const OrderNowPage = () => {
    const deliveryPartners = [
        {
            name: 'Bolt Food',
            logoSrc: '/logo/bolt.png', // Replace with your actual image path
            url: 'https://food.bolt.eu/en-US/15-tbilisi/p/129666-aroma---indian-and-arabic-restaurant'
        },
        {
            name: 'Wolt',
            logoSrc: '/logo/wolt.avif', // Replace with your actual image path
            url: 'https://wolt.com/en/geo/tbilisi/restaurant/flame-house-by-aroma'
        },
        {
            name: 'Glovo',
            logoSrc: '/logo/glovo.webp', // Replace with your actual image path
            url: '#glovo-menu'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-20 ">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        Order From <span className="text-amber-300">Aroma</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
                        Enjoy our delicious cuisine from the comfort of your home. Fast delivery guaranteed!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Delivery Partners Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Choose Your <span className="text-orange-600">Delivery Partner</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Order through your favorite platform and get Aroma&apos;s authentic flavors delivered to your doorstep
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deliveryPartners.map((partner, index) => (
                            <Link
                                key={index}
                                href={partner.url}
                                target='_blank'
                                className="group bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                            >
                                <div className={` p-6 text-center transition-colors duration-300`}>
                                    <div className=" relative mb-4 flex justify-center">
                                        <div className="aspect-square overflow-hidden rounded-md h-32 w-32 relative">
                                            <Image
                                                src={partner.logoSrc}
                                                alt={`${partner.name} logo`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-700 font-display uppercase">{partner.name}</h3>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-gray-600 mb-4">Order now and get fresh, hot food delivered</p>
                                    <div className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                                        <Truck className="mr-2" size={18} />
                                        View Menu & Order
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="mb-16">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                            <Clock className="inline mr-3 text-orange-600" size={32} />
                            Delivery Information
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="p-4">
                                <div className="text-3xl mb-3">⚡</div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h4>
                                <p className="text-gray-600">30-45 minutes average delivery time</p>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl mb-3">🍝</div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Fresh & Hot</h4>
                                <p className="text-gray-600">Special packaging to keep food fresh</p>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl mb-3">💰</div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">Great Value</h4>
                                <p className="text-gray-600">Competitive prices with frequent offers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            <Phone className="inline mr-3 text-orange-600" size={32} />
                            Contact Us
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center p-4 bg-amber-50 rounded-xl">
                                <Phone className="text-amber-600 mr-4" size={24} />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Phone Orders</h4>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-orange-50 rounded-xl">
                                <MapPin className="text-orange-600 mr-4" size={24} />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Restaurant Address</h4>
                                    <p className="text-gray-600">123 Gourmet Street, Food District, City 12345</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-red-50 rounded-xl">
                                <Clock className="text-red-600 mr-4" size={24} />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Delivery Hours</h4>
                                    <p className="text-gray-600">Mon-Sun: 11:00 AM - 11:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Need Help?</h3>
                        <div className="space-y-4">
                            <p className="text-gray-600 leading-relaxed">
                                Having trouble with your order? Our friendly customer service team is here to help you 24/7.
                            </p>
                            <div className="space-y-3">
                                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg">
                                    Call Customer Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4">Craving Aroma&apos;s Flavors?</h2>
                        <p className="text-xl text-amber-100 mb-6">
                            Don&apos;t wait! Order now and satisfy your taste buds with our signature dishes
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderNowPage;
