import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import Button from "./ui/button/Button";
import BookLogo from "./svgs/BookLogo";

const LoginReg: React.FC = () => {
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = useAppSelector(getCurrentToken);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSocialLogin = async (provider: string) => {
    try {
      setSocialLoading(provider);
      // Implement social login logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success(`Successfully logged in with ${provider}`);
    } catch (error) {
      toast.error(`Failed to login with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="container flex items-center min-h-screen px-4 py-8 m-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col w-full max-w-6xl mx-auto overflow-hidden bg-white shadow-xl md:flex-row dark:bg-dark-secondary rounded-2xl"
      >
        {/* Left Panel */}
        <motion.div className="relative hidden md:flex md:w-5/12 bg-gradient-to-br from-accent-DEFAULT via-secondary-DEFAULT to-primary-DEFAULT">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center w-full p-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center mb-12"
            >
              <div className="p-3 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <BookLogo className="w-16 h-16 " />
              </div>
              <h1 className="text-3xl font-bold ">BookStore</h1>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-4xl font-bold leading-tight ">
                Welcome to BookStore
              </h2>
              <p className="max-w-sm mx-auto text-lg leading-relaxed ">
                Choose how you'd like to continue
              </p>
              <div className="w-20 h-1 mx-auto rounded-full bg-white/20"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="w-full p-4 md:w-7/12 md:p-12">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Welcome to BookStore</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Choose how you'd like to continue
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </div>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-sm text-gray-400">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Google", icon: FaGoogle },
                  { name: "GitHub", icon: FaGithub },
                  { name: "Facebook", icon: FaFacebook },
                ].map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => handleSocialLogin(name)}
                    disabled={!!socialLoading}
                    aria-label={`Sign in with ${name}`}
                    className={`flex items-center justify-center p-2.5 border border-gray-200 
                      dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                      transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${socialLoading === name ? "animate-pulse" : ""}`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginReg;
