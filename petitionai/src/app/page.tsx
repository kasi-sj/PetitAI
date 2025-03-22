
import Grid from "@/components/ui/animata/grid";
import Link from "next/link";
import SlideArrowButton from "@/components/ui/animata/swipeButton";
import FeaturesGrid from "@/components/ui/animata/bento";
import NavBar from "@/components/nav-home";
import {
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react"; // Icons

export default function Home() {
  return (
    <div className="min-h-screen bg-white ">
      {/* Navbar */}
      <NavBar />

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <span className="text-sm font-semibold bg-gray-200 py-1 px-3 rounded-full">
          🚀 Be part of the future of petition management!
        </span>
        <h1 className="text-4xl font-bold mt-4">
          Unlock the Power of AI-Driven Petition Management with PetitAI
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Unleash Efficiency, Empower Organizations, Streamline Petitions, and
          Drive Meaningful Change with PetitAI
        </p>
        <Link href="/sign-up">
          <div className="mt-6 space-x-4">
            <SlideArrowButton
              text="Sign Up"
            />
          </div>
        </Link>
      </section>

      {/* Image Section */}
      <div className="flex w-[100%] h-[200px] overflow-hidden -z-20">
        <Grid size={100} className="" />
      </div>
      <FeaturesGrid />

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-8 mt-10">
        <div className="container mx-auto px-6 text-center">
          {/* Brand Name */}
          <h2 className="text-2xl font-bold">PetitAI</h2>
          <p className="text-gray-400 mt-2">
            Revolutionizing Petition Management with AI
          </p>

          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/petitions" className="hover:text-gray-300">
              Petitions
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-gray-300"
            >
              <Facebook size={22} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="hover:text-gray-300"
            >
              <Twitter size={22} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-gray-300"
            >
              <Instagram size={22} />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm mt-4">
            © {new Date().getFullYear()} PetitAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
