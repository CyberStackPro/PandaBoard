"use client";

import Link from "next/link";
import { ModeToggle } from "./_components/theme-toggler";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import { MailQuestion, Github, Car } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";

const features = [
  {
    title: "Real-time Collaboration",
    description: "Work together seamlessly with your team in real-time.",
  },
  {
    title: "Rich Text Editor",
    description: "Powerful WYSIWYG editor with markdown support.",
  },
  {
    title: "Database Views",
    description: "Organize your data with flexible views and filters.",
  },
  {
    title: "Version History",
    description: "Track changes and restore previous versions easily.",
  },
];

const techStack = [
  {
    title: "Frontend",
    items: ["Next.js 14", "TypeScript", "Tailwind CSS", "Shadcn UI"],
  },
  {
    title: "Backend",
    items: ["NestJS", "PostgreSQL", "Prisma", "WebSocket"],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "AWS", "Redis", "NextAuth.js"],
  },
];

const Page = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [1000, 300], [0, 50]);
  // const bgTranslateY = useTransform(scrollY, [0, 300], [0, -100]);
  const rotate = useTransform(scrollY, [0, 300], [0, -10]);
  const opacity = useTransform(scrollY, [0, 150], [0, 1]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* <Spotlight /> */}
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <MailQuestion className="h-6 w-6" />
              <span className="font-bold text-xl">Notion Clone</span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {features.map((feature) => (
                        <ListItem
                          key={feature.title}
                          title={feature.title}
                          href="#"
                        >
                          {feature.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Technology</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3">
                      {techStack.map((stack) => (
                        <ListItem
                          key={stack.title}
                          title={stack.title}
                          href="#"
                        >
                          {stack.items.join(", ")}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Documentation
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-28 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="text-center z-50 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl scroll-m-20 font-extrabold tracking-tight lg:text-6xl bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-primary bg-clip-text text-transparent relative">
                Your Workspace, Re imagined
                {/* Decorative SVG line */}
                {/* <svg
                  width="1146"
                  height="161"
                  viewBox="0 0 1146 161"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 104C80.8925 10.6851 185.487 -19.7927 303 16C385.272 41.0589 389.325 136.121 473 156C578.306 181.018 624.888 65.195 733 60C850.022 54.3769 913.603 190.816 1021 144C1084.8 116.189 1119.23 80.649 1145 16"
                    stroke="black"
                  />
                </svg> */}
                <motion.svg
                  width="100%"
                  height="20"
                  viewBox="0 0 400 20"
                  initial="hidden"
                  animate="visible"
                  className="absolute -bottom-4 left-0 w-full"
                >
                  <motion.path
                    d="M0,10 Q100,5 200,10 T400,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    variants={draw}
                    className="text-primary/80"
                  />
                </motion.svg>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-7 [&:not(:first-child)]:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              An all-in-one collaboration platform combining note-taking,
              knowledge management, and real-time collaboration. Built with
              modern technologies.
            </motion.p>

            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg">Try for Free</Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </header>

          <motion.div
            className="mb-24 perspective-[100px] ml-auto mr-auto"
            style={{
              scale,
              // rotateX: "-50deg",
              rotateX: "20deg",
              // rotateY: "0",
              // rotateZ: "-30deg",
            }}
          >
            <div className="relative w-full max-w-[1200px] mx-auto">
              {/* Background glow effect */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl",
                  theme === "light"
                    ? "bg-gradient-to-b from-primary/10 to-primary/0"
                    : "bg-gradient-to-b from-primary/20 to-primary/0"
                )}
                style={{
                  filter: "blur(40px)",
                  transform: "translateY(-20px) scale(0.95)",
                }}
              />

              {/* Main image container */}
              <motion.div
                className="relative rounded-2xl flex justify-center items-center  overflow-hidden"
                style={{ y, rotate }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* Glass effect overlay */}
                {/* <div
                  className={cn(
                    "absolute inset-0 rounded-2xl",
                    theme === "dark"
                      ? "bg-gradient-to-b from-black/30 to-black/10"
                      : "bg-gradient-to-b from-black/30 to-black/10"
                  )}
                  style={{
                    backdropFilter: "blur(1px)",
                  }}
                /> */}

                {/* Main image */}
                <div className="relative  backdrop-blur-[2px]  rounded-2xl overflow-hidden">
                  <motion.div
                    className="w-full"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                  >
                    <Image
                      src={
                        theme === "light"
                          ? "/image/light-mode/Analyze Data.svg"
                          : "/image/dark-mode/Analyze Data.svg"
                      }
                      alt="Notion Clone Demo"
                      width={800}
                      height={800}
                      className={cn(
                        "relative  transition-all duration-300",
                        theme === "light"
                          ? "filter brightness-105"
                          : "filter brightness-110"
                      )}
                    />

                    {/* Animated gradient overlay */}
                    {/* <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          "linear-gradient(45deg, rgba(var(--primary-rgb), 0) 0%, rgba(var(--primary-rgb), 0.1) 50%, rgba(var(--primary-rgb), 0) 100%)",
                          "linear-gradient(45deg, rgba(var(--primary-rgb), 0) 100%, rgba(var(--primary-rgb), 0.1) 150%, rgba(var(--primary-rgb), 0) 200%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    /> */}

                    {/* Edge highlight effect */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-2xl",
                        theme === "dark"
                          ? "bg-gradient-to-b from-primary/20 to-transparent"
                          : "bg-gradient-to-b from-primary/10 to-transparent"
                      )}
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, transparent, black)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, transparent, black)",
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          {/*  floating elements around the main image */}
          {/* <motion.div
            className="absolute top-1/2 left-[15%] w-20 h-20"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          > */}
          {/* <Car className="w-full h-full" /> */}
          {/* </motion.div> */}
        </div>
      </main>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Page;
