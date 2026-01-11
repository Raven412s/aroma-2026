import { Car, Clock, Coffee, Mail, MapPin, Phone, Utensils } from 'lucide-react';
export const Contact = () => {
    return (
        <div className="space-y-8 ">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <MapPin className="text-amber-600 mr-3" size={32} />
                    Visit Us
                </h2>

                <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-xl">
                        <MapPin className="text-amber-600 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                            <p className="text-gray-600 leading-relaxed">
                                123 Culinary Street<br />
                                Gourmet District<br />
                                Gorakhpur, Uttar Pradesh 273001<br />
                                India
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl">
                        <Phone className="text-orange-600 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                            <p className="text-gray-600">+91 98765 43210</p>
                            <p className="text-gray-600">+91 87654 32109</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-xl">
                        <Mail className="text-red-600 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                            <p className="text-gray-600">info@aromarestaurant.com</p>
                            <p className="text-gray-600">reservations@aromarestaurant.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <Clock className="text-amber-600 mr-3" size={32} />
                    Opening Hours
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Monday - Thursday</span>
                        <span className="text-gray-600">11:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Friday - Saturday</span>
                        <span className="text-gray-600">11:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <span className="font-medium text-gray-700">Sunday</span>
                        <span className="text-gray-600">12:00 PM - 10:00 PM</span>
                    </div>
                </div>
            </div>

            {/* Additional Services */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Services</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                        <Utensils className="text-amber-600 mx-auto mb-2" size={32} />
                        <p className="font-medium text-gray-700">Dine-In</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                        <Car className="text-orange-600 mx-auto mb-2" size={32} />
                        <p className="font-medium text-gray-700">Free Parking</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                        <Coffee className="text-red-600 mx-auto mb-2" size={32} />
                        <p className="font-medium text-gray-700">Private Events</p>
                    </div>
                </div>
            </div>
        </div>

    )
}
