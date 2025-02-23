import { motion } from "framer-motion";
import { HiCode, HiServer, HiSparkles, HiUserGroup } from "react-icons/hi";
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiExpress,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";

const AboutPage = () => {
  const techStacks = {
    frontend: [
      { name: "React", icon: SiReact, desc: "UI Library" },
      { name: "TypeScript", icon: SiTypescript, desc: "Language" },
      { name: "Tailwind CSS", icon: SiTailwindcss, desc: "Styling" },
      { name: "Redux Toolkit", icon: SiRedux, desc: "State Management" },
    ],
    backend: [
      { name: "Express", icon: SiExpress, desc: "Backend Framework" },
      { name: "MongoDB", icon: SiMongodb, desc: "Database" },
      { name: "Node.js", icon: SiNodedotjs, desc: "Runtime" },
    ],
  };

  const stats = [
    { label: "Active Users", value: "1,000+", icon: HiUserGroup },
    { label: "Books Available", value: "100,000+", icon: HiSparkles },
    { label: "Daily Visitors", value: "500+", icon: HiUserGroup },
  ];

  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-6 text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
          Welcome to Our Bookstore
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
          A modern platform for book enthusiasts, combining cutting-edge
          technology with a passion for literature.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
          >
            <stat.icon className="w-8 h-8 mb-4 text-indigo-500" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tech Stack Section */}
      <div className="mb-16">
        <SectionTitle icon={HiCode} title="Technology Stack" />
        <div className="grid grid-cols-2 gap-8 mt-8">
          {/* Frontend Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
          >
            <h3 className="mb-4 text-xl font-semibold">
              Frontend Technologies
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {techStacks.frontend.map((tech) => (
                <TechCard key={tech.name} {...tech} />
              ))}
            </div>
          </motion.div>

          {/* Backend Stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
          >
            <h3 className="mb-4 text-xl font-semibold">Backend Technologies</h3>
            <div className="grid grid-cols-2 gap-4">
              {techStacks.backend.map((tech) => (
                <TechCard key={tech.name} {...tech} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <SectionTitle icon={HiSparkles} title="Key Features" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <Icon className="w-6 h-6 text-indigo-500" />
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
);

const TechCard = ({
  name,
  icon: Icon,
  desc,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
  >
    <Icon className="w-8 h-8 mr-3 text-gray-700 dark:text-gray-300" />
    <div>
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ title, description, icon: Icon, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className="p-6 transition-shadow bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl"
  >
    <Icon className="w-8 h-8 mb-4 text-indigo-500" />
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

const features = [
  {
    title: "Google Books Integration",
    description:
      "Access millions of books through Google Books API integration",
    icon: HiSparkles,
  },
  {
    title: "Secure Authentication",
    description: "Protected user accounts with modern security practices",
    icon: HiUserGroup,
  },
  {
    title: "Advanced Search",
    description: "Find books quickly with our powerful search capabilities",
    icon: HiServer,
  },
  // Add more features as needed
];

export default AboutPage;
