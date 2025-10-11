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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Successfully logged in with ${provider}`);
    } catch (error) {
      toast.error(`Failed to login with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-main-primary via-main-secondary to-main-tertiary dark:from-dark-primary dark:via-dark-secondary dark:to-dark-tertiary" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-main-secondary shadow-[0_45px_90px_-40px_rgba(34,32,30,0.55)] dark:border-gray-800 dark:bg-dark-secondary"
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative hidden h-full flex-col justify-between bg-gradient-to-br from-primary via-secondary to-secondary-dark p-12 text-primary-text md:flex md:w-5/12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(243,238,229,0.28),transparent_55%)]" />
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-text/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
                Bookstore
              </span>
              <div className="rounded-2xl bg-primary-text/10 p-3 backdrop-blur-md">
                <BookLogo className="h-14 w-14" />
              </div>
              <h1 className="text-3xl font-semibold leading-tight">
                Your next chapter starts with a better library.
              </h1>
              <p className="text-sm text-primary-text/80">
                Create, curate, and share reading journeys with a calm interface
                designed for long-form discovery.
              </p>
            </div>
            <div className="space-y-5 text-sm text-primary-text/85">
              {[
                "Track every purchase and wishlist",
                "Build collaborative booklists",
                "Sync notes across devices",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-text/30 bg-primary-text/10 text-base font-semibold">
                    {index + 1}
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-xs text-primary-text/70">
            Need help? Reach us at support@bookstore.app
          </p>
        </motion.div>

        <div className="w-full px-6 py-12 sm:px-10 md:w-7/12">
          <div className="mx-auto flex w-full max-w-md flex-col gap-10">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-50">
                Welcome to Bookstore
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-300">
                Choose how you�d like to sign in. You can always update your
                preference later.
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
                onClick={() => navigate("/registration")}
              >
                Create Account
              </Button>
            </div>

            <div className="space-y-6">
              <div className="relative flex items-center">
                <span className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700"></span>
                <span className="mx-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-400">
                  Or continue with
                </span>
                <span className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700"></span>
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
                    className={`flex items-center justify-center rounded-2xl border border-gray-200 bg-main-secondary px-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-dark-tertiary/70 dark:hover:bg-dark-tertiary ${socialLoading === name ? "animate-pulse" : ""}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              By continuing you agree to our
              <button
                type="button"
                className="ml-1 font-medium text-secondary hover:text-secondary-hover"
              >
                Terms &amp; Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginReg;
