import { ReactNode } from "react";
import {
  BarChart,
  GitBranch,
  LineChart,
  HeartPulse,
  BookPlus,
  Sun,
  TypeIcon,
} from "lucide-react";

import MovingGradient from "./moving-gradient";
import { cn } from "@/lib/utils";

function BentoCard({
  title,
  icon,
  description,
  gradient,
  className,
}: {
  title: ReactNode;
  icon: ReactNode;
  gradient?: string;
  description: ReactNode;
  className?: string;
}) {
  return (
    <MovingGradient
      animated={false}
      className={cn("rounded-md", className)}
      gradientClassName={cn("opacity-10", gradient)}
    >
      <section className="flex h-full flex-col gap-2 p-4">
        <header>
          <div className="mb-2 flex items-center gap-2">
            {icon}
            <p className="text-md line-clamp-1 font-bold">{title}</p>
          </div>
        </header>
        <div className="flex-1 text-sm font-medium text-opacity-80">
          {description}
        </div>
      </section>
    </MovingGradient>
  );
}

const features = [
  {
    title: "Efficient Petition Handling",
    description:
      "Automates petition categorization, ensuring quicker redirection to relevant departments.",
    icon: <BarChart size={24} />,
    gradient: "from-cyan-900 via-60% via-sky-600 to-indigo-600",
    className: "col-span-1 row-span-2", // First card spans 2 rows
  },
  {
    title: "Prioritization & Urgency Detection",
    description:
      "AI can flag urgent cases, helping officials address critical grievances faster.",
    icon: <GitBranch size={24} />,
    gradient: "from-red-300 via-60% via-rose-300 to-red-200",
  },
  {
    title: "Transparency & Accountability",
    description:
      "Tracks petition status and provides real-time updates to petitioners, reducing ambiguity.",
    icon: <LineChart size={24} />,
    gradient: "from-lime-300 via-60% via-green-200 to-lime-200",
  },
  {
    title: "Reduces Manual Effort",
    description:
      "Minimizes human intervention, reducing errors and workload for government officials.",
    icon: <HeartPulse size={24} />,
    gradient: "from-yellow-300 via-60% via-orange-300 to-red-300",
  },
  {
    title: "Data-Driven Insights",
    description:
      "Identifies repetitive grievances, enabling authorities to address systemic issues proactively.",
    icon: <BookPlus size={24} />,
    gradient: "from-purple-400 via-60% via-indigo-400 to-blue-400",
  },
  {
    title: "Timely Follow-ups",
    description:
      "Automated reminders ensure that officials do not overlook pending petitions.",
    icon: <Sun size={24} />,
    gradient: "from-pink-400 via-60% via-red-400 to-yellow-400",
  },
  {
    title: "Scalability",
    description:
      "The AI model can handle large volumes of petitions efficiently, making it suitable for widespread implementation.",
    icon: <TypeIcon size={24} />,
    gradient: "from-gray-400 via-60% via-zinc-400 to-black-400",
  },
];

export default function FeaturesGrid() {
  return (
    <div className="bg-zinc-950 p-4 m-2 rounded-lg ">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 text-black">
        {features.map(
          ({ title, description, icon, gradient, className }) => (
            <BentoCard
              key={title}
              title={title}
              icon={icon}
              description={description}
              gradient={gradient}
              className={cn("col-span-1 row-span-1", className)} // Default to 1x1, but first card is 1x2
            />
          )
        )}
      </div>
    </div>
  );
}
