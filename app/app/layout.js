import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { UserProvider } from './login/UserContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
import { UserActivityProvider } from './admin/UserActivityContext';
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
                <ThemeProvider>
                    <UserActivityProvider>
                        <UserProvider>
                            <NotificationProvider>
                                <Navigation />
                                <div className="p-4">
                                    {children}
                                </div>
                            </NotificationProvider>
                        </UserProvider>
                    </UserActivityProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

