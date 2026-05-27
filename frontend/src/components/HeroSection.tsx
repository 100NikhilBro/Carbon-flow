import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { 
  Leaf, Factory, CloudRain, Wind, Recycle, Trash2, 
  Database, Cpu, Shield, Upload, BarChart3, FileCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const rotatingIcons = [
  { Icon: Leaf }, { Icon: Factory }, { Icon: CloudRain },
  { Icon: Wind }, { Icon: Recycle }, { Icon: Trash2 },
  { Icon: Database }, { Icon: Cpu }, { Icon: Shield },
  { Icon: Upload }, { Icon: BarChart3 }, { Icon: FileCheck }
];

export default function HeroSection() {
  const navigate = useNavigate();
  const circleRef = useRef<HTMLDivElement>(null);
  const [iconPositions, setIconPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const updatePositions = () => {
      if (!circleRef.current) return;
      const container = circleRef.current;
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(centerX, centerY) - 40; // leave margin for icon size
      const angleStep = (2 * Math.PI) / rotatingIcons.length;
      
      const positions = rotatingIcons.map((_, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle) - 20; // half icon width
        const y = centerY + radius * Math.sin(angle) - 20;
        return { x, y };
      });
      setIconPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-green-800 overflow-hidden pt-16">
      {/* Cross effect background */}
      <div className="absolute inset-0 cross-bg opacity-30" />
      
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full py-8">
        {/* Mobile: column (circle top), Desktop: row (text left, circle right) */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Rotating circle - appears first on mobile, right on desktop */}
          <div className="order-1 lg:order-2 flex justify-center w-full">
            <div 
              ref={circleRef}
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px]"
            >
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              >
                {rotatingIcons.map(({ Icon }, index) => {
                  const pos = iconPositions[index];
                  if (!pos) return null;
                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{ left: pos.x, top: pos.y }}
                    >
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-200 drop-shadow-lg" />
                    </div>
                  );
                })}
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Leaf className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 text-green-700" />
              </div>
            </div>
          </div>

          {/* Text content - second on mobile, left on desktop */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight"
            >
              CarbonFlow
              <span className="block text-green-200 text-2xl sm:text-3xl lg:text-4xl mt-2">
                Multi-tenant ESG Data Platform
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 sm:mt-6 text-green-100 text-base sm:text-lg lg:text-xl leading-relaxed"
            >
              Ingest, validate, and review sustainability datasets from multiple enterprise sources. 
              Flag suspicious records, ensure compliance, and get real-time analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                'CSV / SAP / Utility / Travel ingestion',
                'Async Celery processing pipeline',
                'Unit normalization & emission calculation',
                'Validation & suspicious flagging engine',
                'Review workflow (approve/reject)',
                'WebSocket real-time updates',
                'Audit logs & full traceability',
                'CSV/Excel exports & analytics'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-green-100 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-300 rounded-full flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 sm:mt-10"
            >
              <button 
                onClick={() => navigate('/login')}
                className="bg-white text-green-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition mx-auto lg:mx-0"
              >
                Get Started <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}