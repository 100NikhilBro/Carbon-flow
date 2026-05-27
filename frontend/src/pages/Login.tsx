import { useState } from 'react';

import { motion } from 'framer-motion';

import {
  Leaf,
  Factory,
  CloudRain,
  Wind,
  Recycle,
  Trash2,
  Database,
  Cpu,
  Shield,
  Upload,
  BarChart3,
  FileCheck,
  Lock,
  LogIn,
  AlertCircle,
  User,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { loginUser } from '../api/authApi';

import { useAuth } from '../hooks/useAuth';


// Background floating icons
const backgroundIcons = [
  Leaf,
  Factory,
  CloudRain,
  Wind,
  Recycle,
  Trash2,
  Database,
  Cpu,
  Shield,
  Upload,
  BarChart3,
  FileCheck,
];

export default function LoginPage() {

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  // Floating icon positions
  const [iconPositions] = useState(() =>
    Array.from({ length: 12 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
    }))
  );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');

    setIsLoading(true);

    try {

      const response =
        await loginUser({

          username,
          password,
        });

      login(
        response.access,
        response.refresh
      );

      navigate('/dashboard');

    } catch (error) {

      setError(
        'Invalid username or password'
      );

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center px-4 py-20 relative overflow-hidden">

      {/* Cross effect background */}
      <div className="absolute inset-0 cross-bg opacity-20" />

      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Floating icons */}
      {backgroundIcons.map((Icon, idx) => {

        const pos = iconPositions[idx];

        return (

          <motion.div
            key={idx}
            className="absolute text-green-200/10 pointer-events-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
              ease: 'easeInOut',
            }}
          >

            <Icon
              size={pos.size}
              strokeWidth={1}
            />

          </motion.div>
        );
      })}

      {/* Login Card */}
      <motion.div

        initial={{
          opacity: 0,
          y: 30,
          scale: 0.98,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
        }}

        className="relative z-10 w-full max-w-md"
      >

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-green-500/20">

          {/* Logo */}
          <div className="text-center mb-8">

            <motion.div

              initial={{
                rotate: -10,
                scale: 0,
              }}

              animate={{
                rotate: 0,
                scale: 1,
              }}

              transition={{
                delay: 0.2,
                type: 'spring',
              }}

              className="flex justify-center mb-4"
            >

              <div className="bg-white/20 p-3 rounded-full">

                <Leaf className="h-10 w-10 text-white" />

              </div>

            </motion.div>

            <h1 className="text-3xl font-bold text-white tracking-tight">

              Welcome back

            </h1>

            <p className="text-green-100 text-sm mt-1">

              Sign in to continue

            </p>

          </div>

          {/* Error */}
          {error && (

            <motion.div

              initial={{
                opacity: 0,
                x: -20,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              className="mb-5 p-3 bg-red-500/20 border border-red-400/50 rounded-xl flex items-center gap-2 text-red-100 text-sm"
            >

              <AlertCircle className="w-4 h-4 flex-shrink-0" />

              <span>{error}</span>

            </motion.div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Username */}
            <div>

              <label className="block text-green-100 text-sm font-medium mb-1">

                Username

              </label>

              <div className="relative group">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300 transition group-hover:text-white" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }

                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"

                  placeholder="Enter username"

                  required
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-green-100 text-sm font-medium mb-1">

                Password

              </label>

              <div className="relative group">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-300 transition group-hover:text-white" />

                <input
                  type="password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"

                  placeholder="••••••"

                  required
                />

              </div>

            </div>

            {/* Button */}
            <button
              type="submit"

              disabled={isLoading}

              className="w-full bg-white text-green-800 hover:bg-green-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-70 mt-2"
            >

              {isLoading ? (

                <div className="w-5 h-5 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />

              ) : (

                <>
                  <LogIn className="w-4 h-4" />

                  Sign In
                </>
              )}

            </button>

          </form>

        </div>

      </motion.div>

    </div>
  );
}