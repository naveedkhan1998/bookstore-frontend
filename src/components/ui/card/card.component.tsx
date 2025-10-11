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

  const interactiveSurface = twMerge(
    "rounded-2xl border border-gray-200 bg-main-secondary/90 text-main-text shadow-sm",
    "dark:border-gray-800 dark:bg-dark-secondary/85 dark:text-dark-text",
    "transition-all duration-300 ease-out",
    className,
  );

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    rgba(99, 102, 241, 0.18),
    transparent 70%
  )`;

  if (variant === "hover3d") {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onMouseMove={handleMouseMove}
        style={{ perspective: "1000px" }}
        className={interactiveSurface}
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
              className="relative overflow-hidden aspect-[3/4]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          )}
          <div className="p-5 flex flex-col gap-2">{children}</div>
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
        className={twMerge(interactiveSurface, "relative group")}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background }}
        />
        {image && (
          <motion.div
            className="relative overflow-hidden aspect-[3/4]"
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={image.src}
              alt={image.alt}
              className="object-cover w-full h-full"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        )}
        <motion.div
          className="relative z-20 p-5 flex flex-col gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(interactiveSurface, "shadow-sm hover:shadow-2xl")}
    >
      {image && (
        <motion.div
          className="relative overflow-hidden aspect-[3/4]"
          whileHover={{ scale: 1.02 }}
        >
          <motion.img
            src={image.src}
            alt={image.alt}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      )}
      <motion.div
        className="p-5 flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Card;
