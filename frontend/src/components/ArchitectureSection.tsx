import { motion } from 'framer-motion';
import { 
  Home, LogIn, ShieldCheck, LayoutDashboard, 
  FileText, Upload, BarChart3, Filter, CheckCircle, 
  Server, Database, Wifi, ArrowDown 
} from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
        >
          Platform Flow
        </motion.h2>

        <div className="flex flex-col items-center gap-4">
          {/* Home */}
          <FlowCard icon={Home} title="Home Page" subtitle="ESG Landing" />
          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* Login */}
          <FlowCard icon={LogIn} title="Login Page" subtitle="JWT Auth" />
          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* Protected Routes */}
          <FlowCard icon={ShieldCheck} title="Protected Routes" subtitle="Auth + Role" />
          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* Dashboard, Records, Upload in a row (wrap on mobile) */}
          <div className="flex flex-wrap justify-center gap-4 my-2">
            <FlowCardSmall icon={LayoutDashboard} title="Dashboard" subtitle="Analytics" meta="Charts, Scope" />
            <FlowCardSmall icon={FileText} title="Records" subtitle="Review" meta="Filters, Approve" />
            <FlowCardSmall icon={Upload} title="Upload" subtitle="CSV" meta="Status, Source" />
          </div>

          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* API Layer */}
          <FlowCard icon={Server} title="API Layer" subtitle="Axios + Query" />
          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* Django Backend */}
          <FlowCard icon={Database} title="Django Backend" subtitle="REST + WS" />
          <ArrowDown className="w-5 h-5 text-green-600" />

          {/* Real-time */}
          <FlowCard icon={Wifi} title="Real-time" subtitle="Upload & Review Updates" />
        </div>
      </div>
    </section>
  );
}

// Helper components – dark green icons, readable text
function FlowCard({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-50 rounded-2xl px-6 py-3 border border-gray-200 shadow-sm min-w-[200px] text-center"
    >
      <Icon className="w-5 h-5 text-green-700 inline mr-2" />
      <span className="font-medium text-gray-800">{title}</span>
      <span className="text-xs text-gray-500 block">{subtitle}</span>
    </motion.div>
  );
}

function FlowCardSmall({ icon: Icon, title, subtitle, meta }: { icon: any; title: string; subtitle: string; meta: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-50 rounded-2xl px-5 py-3 border border-gray-200 shadow-sm text-center min-w-[140px]"
    >
      <Icon className="w-5 h-5 text-green-700 mx-auto mb-1" />
      <div className="font-medium text-gray-800 text-sm">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
      <div className="text-[11px] text-gray-400 mt-1">{meta}</div>
    </motion.div>
  );
}