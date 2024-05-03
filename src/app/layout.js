import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AuthProvider from "@/app/context/authProvide";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Piza Order",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-5xl mx-auto p-4">
          <AuthProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t-2 p-8 text-center mt-8">
              <span className="text-lg text-gray-500">
                Made with 💖 by{" "}
                <a
                  href="https://www.linkedin.com/in/mubashar-hassan-sci/"
                  target="_blank"
                  className="hover:underline text-primary"
                >
                  Al-Rehman
                </a>{" "}
                © {new Date().getFullYear()}
              </span>
            </footer>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
