import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import GridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Link } from "react-router-dom";

export default function Home() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };
  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <GridPattern
          numSquares={80}
          maxOpacity={0.3}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] skew-y-12 -z-10",
            "h-[100vh] my-auto",
          )}
        />
        <motion.div
          className="flex flex-col w-full h-screen justify-center items-center gap-2"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="flex flex-col items-center gap-1 mb-2"
            variants={childVariants}
          >
            <GradientHeading
              className="drop-shadow-glow"
              size={"xxl"}
              weight={"bold"}
            >
              MovrSync
            </GradientHeading>
          </motion.div>
          <motion.div className="mb-6" variants={childVariants}>
            <p className="text-xl font-medium tracking-tight">
            Transforming real-world assets into synthetic treasures for seamless trading
            </p>
          </motion.div>
          <motion.div variants={childVariants}>
            <Link to="/dashboard">
              <Button
                className="rounded-full tracking-tight"
                variant={"expandIcon"}
                size={"lg"}
                Icon={MoveRight}
                iconPlacement="right"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      ̛
    </>
  );
}
