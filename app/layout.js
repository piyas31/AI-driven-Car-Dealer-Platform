import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "PiyasGenDrive",
  description: "Where cars meet intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >

        <main className="min-h-screen">
           {children}
        </main>

        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© Developed by Zakiuzzaman Piyas</p>
          </div>
        </footer>
       
      </body>
    </html>
  );
}
