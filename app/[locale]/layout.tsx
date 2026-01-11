import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { Cinzel, Mea_Culpa, Montserrat } from "next/font/google";
import { notFound } from 'next/navigation';
import "./globals.css";

const herrVonMuellerhoff = Mea_Culpa({
    variable: "--font-herr-von-muellerhoff",
    weight: '400',
    subsets: ["latin"],
});

const cinzel = Cinzel({
    variable: "--font-cinzel",
    subsets: ["latin"],
});

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Aroma Indian & Arabic Restaurant | Authentic Cuisine in [City]",
    description: "Experience the finest Indian and Arabic cuisine at Aroma Restaurant. Savor authentic tandoori dishes, flavorful curries, and traditional Middle Eastern delicacies in an elegant dining atmosphere. Our expert chefs blend traditional recipes with modern culinary techniques, offering vegetarian and non-vegetarian specialties. Perfect for family dining, special occasions, and corporate events. Book your table today for an unforgettable dining experience.",
    keywords: "Indian restaurant, Arabic restaurant, tandoori dishes, curry, Middle Eastern food, halal food, vegetarian options, fine dining, authentic cuisine, restaurant booking",
    openGraph: {
        title: "Aroma Indian & Arabic Restaurant | Authentic Cuisine",
        description: "Experience authentic Indian and Arabic cuisine at Aroma Restaurant. Featuring tandoori specialties, traditional curries, and Middle Eastern delicacies in an elegant setting.",
        type: "website",
        locale: "en_US",
        images: [
            {
                url: "/about-hero.jpg",
                width: 1200,
                height: 630,
                alt: "Aroma Indian & Arabic Restaurant Interior"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Aroma Indian & Arabic Restaurant",
        description: "Authentic Indian & Arabic cuisine featuring tandoori specialties, traditional curries, and Middle Eastern delicacies.",
        images: ["/about-hero.jpg"]
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    setRequestLocale(locale);

    const messages = await getMessages(); // This fetches from the file in `request.ts`

    return (
        <html lang={locale} >
            <body
                className={`${cinzel.variable} ${herrVonMuellerhoff.variable} ${montserrat.variable} antialiased`}
                suppressHydrationWarning
                suppressContentEditableWarning
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
