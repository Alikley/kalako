import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: { label: "ایمیل", type: "email" }, password: { label: "رمز عبور", type: "password" } },
      async authorize(credentials) {
        if (credentials?.email === "test@kalako.com" && credentials?.password === "123456") {
          return { id: "1", name: "کاربر کالاکو", email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET || "kalako-secret-key-2024",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
