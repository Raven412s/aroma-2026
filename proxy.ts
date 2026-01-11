import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Specify the paths that should be protected (without locale)
const protectedPaths = ["/dashboard", "/add-menu", "/edit-menu", "/menu-management", "/reservations", "/reservations-management", "/static-images"]

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  // First, handle internationalization
  const response = await intlMiddleware(request)

  // Then check authentication
  const session = await auth()

  // Get the pathname without the locale prefix
  const pathname = request.nextUrl.pathname
  const pathWithoutLocale = pathname.split('/').slice(2).join('/')
  const fullPathWithoutLocale = `/${pathWithoutLocale}`

  // Check if the current path starts with any of the protected paths
  const isProtectedPath = protectedPaths.some(path =>
    fullPathWithoutLocale.startsWith(path)
  )

  if (isProtectedPath && !session) {
    // Get the current locale from the URL
    const currentLocale = pathname.split('/')[1] as 'en' | 'ar' | 'ru'

    // Ensure the locale is valid, default to 'en' if not
    const validLocale = routing.locales.includes(currentLocale) ? currentLocale : routing.defaultLocale

    // Redirect to login page with the same locale
    const loginUrl = new URL(`/${validLocale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files
    // - image optimization files
    // - favicon
    // - public folder
    // - files with extensions
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*).*)',
    // Match all pathnames that start with a locale
    '/(en|ar|ru)/:path*'
  ]
}
