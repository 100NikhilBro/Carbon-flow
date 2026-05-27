import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ArchitectureSection from '../components/ArchitectureSection';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.div>
        <ArchitectureSection />
      </main>
      <Footer />
    </div>
  );
}