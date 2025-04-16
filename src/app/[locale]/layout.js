import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/context/themeContext";
import Navbar from "@/components/NavBar";
import {NextIntlClientProvider} from "next-intl";
import {AuthProvider} from "@/context/authcontext";
import {CartProvider} from "@/context/cartcontext";
import ApolloWrapper from "@/context/ApolloWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ApolloWrapper>
          <NextIntlClientProvider>
              <AuthProvider>
                  <CartProvider>
                      <ThemeProvider attribute="class">
                          <Navbar/>
                          {children}
                      </ThemeProvider>
                  </CartProvider>
              </AuthProvider>

          </NextIntlClientProvider>
      </ApolloWrapper>

      </body>

    </html>
  );
}
