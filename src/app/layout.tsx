import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetAssist",
  description: "Veterinary assistance application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 font-sans">
        <header className="bg-primary-700 border-b border-primary-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <Link className="text-2xl font-bold text-white hover:text-primary-100 transition-colors" href="/">
                  VetAssist
                </Link>
              </div>
              
              {/* Navigation */}
              <nav className="flex items-center space-x-6">
                <Link 
                  href="/" 
                  className="text-primary-100 hover:text-white transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/history" 
                  className="text-primary-100 hover:text-white transition-colors font-medium"
                >
                  History
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      </body>
    </html>
  );
}


