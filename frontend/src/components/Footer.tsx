import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side: Logo + CARBON FLOW horizontally */}
          <div className="flex items-center gap-3">
            <Leaf className="h-7 w-7 text-green-300" />
            <div className="flex gap-1 text-2xl sm:text-3xl font-bold tracking-tight">
              <span>CARBON</span>
              <span className="text-green-300">|</span>
              <span>FLOW</span>
            </div>
          </div>

          {/* Right side: GitHub link */}
          <a
            href="https://github.com/100NikhilBro/Carbon-flow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-200 hover:text-white underline decoration-green-500/50 hover:decoration-green-300 transition text-sm"
          >
            GitHub: 100NikhilBro/Carbon-flow
          </a>
        </div>

        {/* Copyright – centered at bottom */}
        <div className="text-center text-green-300/60 text-xs mt-6 pt-4 border-t border-green-800">
          &copy; {new Date().getFullYear()} CarbonFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}