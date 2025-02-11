import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from './login/UserContext';
import Navigation from './Navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskIt",
  description: "your TO-DO app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <UserProvider>
                    <Navigation />
                    <div className="p-4">
                        {children}
                    </div>
                </UserProvider>
            </body>
        </html>
    );
}

