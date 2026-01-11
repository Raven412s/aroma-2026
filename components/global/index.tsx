"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Facebook, Instagram, MapPin, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('/');
    const pathname = usePathname()
    const result: boolean = scrolled || (pathname !== "/en" && pathname !== "/ar");
    const router = useRouter()
    const switchLocale = (locale: string) => {
        // Get the current path without the locale prefix
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
        // Construct the new path with the selected locale
        const newPath = `/${locale}${pathWithoutLocale}`
        router.push(newPath)
    }

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Set active link based on current path
        setActiveLink(window.location.pathname);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const t = useTranslations("Navbar")
    const navLinks = [
        { name: `${t('home')}`, path: '/' },
        { name: `${t('menus')}`, path: '/menu' },
        { name: `${t('about')}`, path: '/about' },
        { name: `${t('findUs')}`, path: '/find-us' },
        { name: `${t('orderNow')}`, path: '/order-now' },
    ];

    const navbarVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            className={`fixed w-full z-[999] transition-all duration-500  ${result
                ? 'bg-white py-4 shadow'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <motion.div
                        className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src="/logo/aroma.png"
                            alt="Aroma Restaurant Logo"
                            width={60}
                            height={60}
                            className={`object-cover`}
                        />
                        <Link href="/" className={cn(result ? "text-black" : "text-white")}>
                            <div className="flex flex-col items-start ">
                                <span className="text-3xl font-display">Aroma</span>
                                <span className="text-xs tracking-widest font-display">RESTAURANT</span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        {(() => {
                            const orderNowLink = navLinks.find(link => link.path === '/order-now');
                            return orderNowLink && (
                                <Link
                                    href={orderNowLink.path}
                                    className={`font-medium relative px-1 py-1 transition-colors hover:text-opacity-100 ${activeLink === orderNowLink.path
                                        ? result ? 'text-black font-semibold' : 'text-white font-semibold'
                                        : result ? 'text-black text-opacity-70' : 'text-white text-opacity-80'
                                        }`}
                                    onClick={() => setActiveLink(orderNowLink.path)}
                                >
                                    {orderNowLink.name}
                                    {activeLink === orderNowLink.path && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${result ? 'bg-amber-600' : 'bg-white'
                                                }`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            );
                        })()}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-md focus:outline-none ${result ? "text-gray-800" : "text-white"
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <motion.div key={link.path} variants={linkVariants}>
                                <Link href={link.path}
                                    className={`font-medium relative px-1 py-1 transition-colors hover:text-opacity-100 ${activeLink === link.path
                                        ? result ? 'text-black font-semibold' : 'text-white font-semibold'
                                        : result ? 'text-black text-opacity-70' : 'text-white text-opacity-80'
                                        }`}
                                    onClick={() => setActiveLink(link.path)}
                                >
                                    {link.name}
                                    {activeLink === link.path && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 ${result ? 'bg-amber-600' : 'bg-white'}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Reservation Button */}
                        <motion.div variants={linkVariants}>
                            <Link
                                href="/reservation"
                                className={`font-medium px-6 py-2 border transition-all duration-300 ${result
                                    ? 'border-black text-black hover:bg-black hover:text-white'
                                    : 'border-white text-white hover:bg-white hover:text-black '
                                    }`}
                            >
                                {t('reservation')}
                            </Link>
                        </motion.div>
                    </nav>

                    {/* Language Switcher */}
                    <div className={cn("hidden md:block", result ? "" : "text-white")}>
                        <LocaleSwitcher switchLocale={switchLocale} />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden bg-white shadow-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="px-2 pt-2 pb-3 space-y-1"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                        >
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.path}
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                >
                                    <Link
                                        href={link.path}
                                        className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${activeLink === link.path
                                            ? 'text-gray-900 bg-gray-100'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        onClick={() => {
                                            setActiveLink(link.path);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Mobile Reservation Button */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                            >
                                <Link
                                    href="/reservation"
                                    className="block px-3 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('reservation')}
                                </Link>
                            </motion.div>

                            {/* Mobile Language Switcher */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                className="px-3 py-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">Language:</span>
                                    <Select
                                        onValueChange={(value) => {
                                            switchLocale(value);
                                            setIsMenuOpen(false);
                                        }}
                                        defaultValue={pathname.startsWith('/ar') ? 'ar' : 'en'}
                                    >
                                        <SelectTrigger className="w-max">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ar">العربية</SelectItem>
                                            <SelectItem value="ru">Русский</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export const Footer = () => {
    const t = useTranslations("Footer");
    const footerSections = [
        {
            title: t("hours"),
            content: [
                { icon: Clock, text: t("workingHours.weekdays") },
                { icon: Clock, text: t("workingHours.weekend") },
                { icon: Clock, text: t("workingHours.sunday") }
            ]
        },
        {
            title: t("location"),
            content: [
                { icon: MapPin, text: t("address") }
            ]
        },
        {
            title: t("quickLinks"),
            links: [
                { name: t("links.menu"), path: "/menu" },
                { name: t("links.reservations"), path: "/reservation" },
                { name: t("links.orderNow"), path: "/order-now" },
                // { name: t("links.careers"), path: "/careers" }
            ]
        }
    ];

    const footerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.footer
            className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white pt-16 pb-8 z-[999]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={footerVariants}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-4 font-serif">Aroma</h3>
                        <p className="text-gray-200 mb-4">{t("tagline")}</p>
                        <div className="flex space-x-4">
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Link href="https://www.instagram.com/flamehousebyaroma/" className="text-gray-200 hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                <Link href="https://www.facebook.com/flamehousebyaroma/" className="text-gray-200 hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {footerSections.map((section, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                            {section.content && (
                                <div className="space-y-2 text-gray-200">
                                    {section.content.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex items-start"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <item.icon size={16} className="mr-2 mt-1" />
                                            <span>{item.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            {section.links && (
                                <ul className="space-y-2 text-gray-200">
                                    {section.links.map((link, i) => (
                                        <motion.li
                                            key={i}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Link href={link.path} className="hover:text-white transition-colors">
                                                {link.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-800 pt-8 text-center text-gray-200 text-sm"
                >
                    <p>{t("copyright", { year: new Date().getFullYear() })}</p>
                    <div className="mt-2 space-x-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t("legal.privacy")}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t("legal.terms")}</Link>
                        <Link href="/accessibility" className="hover:text-white transition-colors">{t("legal.accessibility")}</Link>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

interface LocaleSwitcherProps {
    switchLocale: (locale: string) => void;
    className?: string;
}

export function LocaleSwitcher({ switchLocale, className }: LocaleSwitcherProps) {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname()
    const currentLocale = pathname.startsWith('/ar') ? 'ar' : 'en'
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const result: boolean = scrolled || (pathname !== "/en" && pathname !== "/ar");
    return (
        <Select
            onValueChange={switchLocale}
            defaultValue={currentLocale}
        >
            <SelectTrigger className={`w-max ${className} `} color={cn(result ? "black" : "white")}>
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
        </Select>
    )
}
