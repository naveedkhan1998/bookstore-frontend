import { motion } from "framer-motion";
import { HiCode, HiServer, HiSparkles, HiUserGroup } from "react-icons/hi";
import { Info } from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiExpress,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";
import PageContent from "../layouts/PageContent";
import { Section, Grid, ContentCard } from "../layouts/ContentComponents";

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
    <PageContent
      title="About Our Bookstore"
      subtitle="A modern platform for book enthusiasts, combining cutting-edge technology with a passion for literature"
      icon={Info}
    >
      {/* Stats Section */}
      <Section>
        <Grid cols={{ default: 1, md: 3 }} gap={8}>
          {stats.map((stat) => (
            <motion.div key={stat.label} whileHover={{ scale: 1.05 }}>
              <ContentCard hoverable className="p-6">
                <stat.icon className="w-8 h-8 mb-4 text-indigo-500" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </ContentCard>
            </motion.div>
          ))}
        </Grid>
      </Section>

      {/* Tech Stack Section */}
      <Section title="Technology Stack" className="mt-12">
        <Grid cols={{ default: 1, md: 2 }} gap={8}>
          {/* Frontend Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ContentCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <HiCode className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-semibold">Frontend Technologies</h3>
              </div>
              <Grid cols={{ default: 1, sm: 2 }} gap={4}>
                {techStacks.frontend.map((tech) => (
                  <TechCard key={tech.name} {...tech} />
                ))}
              </Grid>
            </ContentCard>
          </motion.div>

          {/* Backend Stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ContentCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <HiServer className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-semibold">Backend Technologies</h3>
              </div>
              <Grid cols={{ default: 1, sm: 2 }} gap={4}>
                {techStacks.backend.map((tech) => (
                  <TechCard key={tech.name} {...tech} />
                ))}
              </Grid>
            </ContentCard>
          </motion.div>
        </Grid>
      </Section>

      {/* Features Section */}
      <Section title="Key Features" className="mt-12">
        <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </Grid>
      </Section>
    </PageContent>
  );
};

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
