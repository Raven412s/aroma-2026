import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
// Your own logic for dealing with plaintext password strings; be careful!

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@restaurant.com"
const ADMIN_PASSWORD = "admin123" // In a real application, this should be hashed

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials)

        // Check if credentials match the hardcoded admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            console.log("admin logged in")
          return {
            id: "1",
            email: ADMIN_EMAIL,
            name: "Admin",
            role: "admin"
          }
        }

        // If credentials don't match, throw error
        throw new Error("Invalid credentials.")
      },
    }),
  ],
})
