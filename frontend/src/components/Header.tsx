import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-green-800/60 backdrop-blur-md border-b border-green-400/30 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo - responsive text */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:text-green-200" />
            </motion.div>
            <span className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight whitespace-nowrap">
              CarbonFlow
            </span>
          </Link>

          {/* Login button - responsive size */}
          <Link
            to="/login"
            className="bg-white/20 hover:bg-white/30 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.header>
  );
}