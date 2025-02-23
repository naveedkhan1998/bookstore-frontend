import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  image?: {
    src: string;
    alt: string;
  };
  variant?: "default" | "hover3d" | "gradient";
}

const Card = ({
  children,
  className,
  onClick,
  image,
  variant = "default",
}: CardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // Gradient animation properties
  const background = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(14, 165, 233, 0.07),
    transparent 80%
  )`;

  if (variant === "hover3d") {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onMouseMove={handleMouseMove}
        style={{
          perspective: "1000px",
        }}
        className={twMerge(
          "overflow-hidden rounded-lg bg-main-secondary dark:bg-dark-secondary",
          "transition-all duration-300 ease-out",
          "cursor-pointer",
          "border border-gray-200 dark:border-gray-700",
          className,
        )}
      >
        <motion.div
          style={{
            rotateX: useMotionTemplate`${mouseY}deg`,
            rotateY: useMotionTemplate`${mouseX}deg`,
          }}
          className="transform-gpu"
        >
          {image && (
            <motion.div
              className="aspect-[3/4] relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          )}
          <div className="p-4">{children}</div>
        </motion.div>
      </motion.div>
    );
  }

  if (variant === "gradient") {
    return (
      <motion.div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={twMerge(
          "overflow-hidden rounded-lg bg-main-secondary dark:bg-dark-secondary",
          "transition-all duration-300 ease-out",
          "cursor-pointer group relative",
          "border border-gray-200 dark:border-gray-700",
          className,
        )}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background }}
        />
        {image && (
          <motion.div
            className="aspect-[3/4] relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={image.src}
              alt={image.alt}
              className="object-cover w-full h-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        )}
        <motion.div
          className="p-4 relative z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        "overflow-hidden rounded-lg bg-main-secondary dark:bg-dark-secondary",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg",
        "cursor-pointer",
        "border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {image && (
        <motion.div
          className="aspect-[3/4] relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <motion.img
            src={image.src}
            alt={image.alt}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </motion.div>
      )}
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Card;
