'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  RotateCw,
  Move,
  MousePointer,
  Sparkles,
  Zap,
  ArrowDown,
  Code,
} from 'lucide-react';

export default function FramerMotionDemoPage() {
  const [showBox, setShowBox] = useState(true);
  const [counter, setCounter] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Framer Motion Demo</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A comprehensive showcase of Framer Motion's powerful animation features
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Tabs defaultValue="basics" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="gestures">Gestures</TabsTrigger>
          <TabsTrigger value="scroll">Scroll & Parallax</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* BASICS TAB */}
        <TabsContent value="basics" className="space-y-6">
          {/* Simple Animations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Simple Animations
              </CardTitle>
              <CardDescription>
                Basic opacity, position, scale, and rotation animations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Fade In</p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-20 bg-primary rounded-lg"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Slide Up</p>
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-20 bg-green-500 rounded-lg"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Scale</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-20 bg-blue-500 rounded-lg"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Rotate</p>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="h-20 bg-purple-500 rounded-lg flex items-center justify-center"
                  >
                    <RotateCw className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variants System</CardTitle>
              <CardDescription>
                Reusable animation states with parent-child orchestration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid grid-cols-4 gap-4"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }}
                    className="h-16 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center text-white font-bold"
                  >
                    {i}
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          {/* AnimatePresence */}
          <Card>
            <CardHeader>
              <CardTitle>AnimatePresence</CardTitle>
              <CardDescription>
                Animate elements when they enter or leave the DOM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setShowBox(!showBox)}>
                {showBox ? 'Hide' : 'Show'} Box
              </Button>
              <div className="min-h-32 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showBox && (
                    <motion.div
                      key="box"
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: 180 }}
                      transition={{ duration: 0.5 }}
                      className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg"
                    />
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Spring Physics */}
          <Card>
            <CardHeader>
              <CardTitle>Spring Physics</CardTitle>
              <CardDescription>
                Natural, physics-based animations with bounce and damping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Bouncy</p>
                  <motion.div
                    animate={{ y: -30 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      type: 'spring',
                      stiffness: 300,
                      damping: 10,
                    }}
                    className="h-20 w-20 mx-auto bg-orange-500 rounded-full"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Smooth</p>
                  <motion.div
                    animate={{ y: -30 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                    }}
                    className="h-20 w-20 mx-auto bg-teal-500 rounded-full"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Gentle</p>
                  <motion.div
                    animate={{ y: -30 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      type: 'spring',
                      stiffness: 50,
                      damping: 30,
                    }}
                    className="h-20 w-20 mx-auto bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GESTURES TAB */}
        <TabsContent value="gestures" className="space-y-6">
          {/* Hover Animations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Hover Effects
              </CardTitle>
              <CardDescription>Interactive hover animations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg cursor-pointer flex items-center justify-center text-white font-bold"
                >
                  Hover Me
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                  className="h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg cursor-pointer flex items-center justify-center text-white font-bold"
                >
                  Lift Up
                </motion.div>

                <motion.div
                  whileHover={{ borderRadius: '50%' }}
                  transition={{ duration: 0.3 }}
                  className="h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg cursor-pointer flex items-center justify-center text-white font-bold"
                >
                  Morph
                </motion.div>

                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg cursor-pointer flex items-center justify-center text-white font-bold"
                >
                  Shake
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Tap/Click Animations */}
          <Card>
            <CardHeader>
              <CardTitle>Tap/Click Effects</CardTitle>
              <CardDescription>Responsive feedback on user interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="h-24 bg-primary text-primary-foreground rounded-lg font-semibold"
                >
                  Click Me
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95, rotate: -5 }}
                  className="h-24 bg-secondary text-secondary-foreground rounded-lg font-semibold"
                >
                  Press
                </motion.button>

                <motion.button
                  whileTap={{ scale: 1.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="h-24 bg-accent text-accent-foreground rounded-lg font-semibold"
                >
                  Tap
                </motion.button>
              </div>
            </CardContent>
          </Card>

          {/* Drag */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="h-5 w-5" />
                Drag Interactions
              </CardTitle>
              <CardDescription>Drag, constrain, and snap elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border-2 border-dashed rounded-lg p-4 min-h-64 relative">
                  <p className="text-sm font-medium mb-2">Free Drag</p>
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 200, top: 0, bottom: 200 }}
                    dragElastic={0.1}
                    className="w-20 h-20 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold"
                  >
                    Drag
                  </motion.div>
                </div>

                <div className="border-2 border-dashed rounded-lg p-4 min-h-64 relative">
                  <p className="text-sm font-medium mb-2">Horizontal Only</p>
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 200 }}
                    className="w-20 h-20 bg-green-500 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold"
                  >
                    Drag X
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCROLL & PARALLAX TAB */}
        <TabsContent value="scroll" className="space-y-6">
          {/* Scroll Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5" />
                Scroll Progress
              </CardTitle>
              <CardDescription>
                Track and animate based on scroll position (see top progress bar)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="relative h-40 bg-gradient-to-r from-primary/20 to-primary rounded-lg overflow-hidden"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-lg font-bold">Scroll to see progress</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Parallax Effect */}
          <Card>
            <CardHeader>
              <CardTitle>Parallax Scrolling</CardTitle>
              <CardDescription>Elements move at different speeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 overflow-hidden rounded-lg bg-gradient-to-b from-sky-400 to-blue-600">
                <motion.div
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [0, -100]),
                  }}
                  className="absolute top-20 left-20 w-32 h-32 bg-yellow-300 rounded-full"
                />
                <motion.div
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [0, -200]),
                  }}
                  className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"
                />
                <motion.div
                  style={{
                    y: useTransform(scrollYProgress, [0, 1], [0, 100]),
                  }}
                  className="absolute bottom-0 inset-x-0 h-32 bg-green-600 rounded-t-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Scroll Into View */}
          <Card>
            <CardHeader>
              <CardTitle>Scroll Into View</CardTitle>
              <CardDescription>
                Animate elements when they enter the viewport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                >
                  Scroll to reveal #{i}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Layout Animations */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Animations</CardTitle>
              <CardDescription>
                Smooth transitions when layout changes (click to reorder)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div layout className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    layout
                    onClick={() => setCounter(counter + 1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg cursor-pointer font-semibold"
                  >
                    Item {(i + counter) % 6 + 1}
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          {/* Path Animations */}
          <Card>
            <CardHeader>
              <CardTitle>SVG Path Animation</CardTitle>
              <CardDescription>Animate SVG paths with pathLength</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <svg width="200" height="200" viewBox="0 0 200 200" className="border rounded-lg">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-primary"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                />
                <motion.path
                  d="M 50 100 Q 100 50 150 100 T 250 100"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-purple-500"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                />
              </svg>
            </CardContent>
          </Card>

          {/* useInView Hook */}
          <Card>
            <CardHeader>
              <CardTitle>useInView Hook</CardTitle>
              <CardDescription>Detect when element is in viewport</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                ref={inViewRef}
                animate={{
                  scale: isInView ? 1 : 0.8,
                  opacity: isInView ? 1 : 0.5,
                }}
                className="h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold"
              >
                {isInView ? '👀 In View!' : '👁️ Out of View'}
              </motion.div>
            </CardContent>
          </Card>

          {/* Complex Keyframes */}
          <Card>
            <CardHeader>
              <CardTitle>Complex Keyframe Animations</CardTitle>
              <CardDescription>Multiple keyframes for complex motion</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                animate={{
                  scale: [1, 2, 2, 1, 1],
                  rotate: [0, 0, 180, 180, 0],
                  borderRadius: ['10%', '10%', '50%', '50%', '10%'],
                }}
                transition={{
                  duration: 3,
                  ease: 'easeInOut',
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                }}
                className="w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 mx-auto"
              />
            </CardContent>
          </Card>

          {/* Text Animation */}
          <Card>
            <CardHeader>
              <CardTitle>Text Reveal Animation</CardTitle>
              <CardDescription>Stagger individual letters</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.h2
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="text-4xl font-bold text-center"
              >
                {'FRAMER MOTION'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h2>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Learn more about Framer Motion:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <a
                  href="https://www.framer.com/motion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Official Docs
                </a>
              </Badge>
              <Badge variant="secondary">
                <a
                  href="https://www.framer.com/motion/examples/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Examples
                </a>
              </Badge>
              <Badge variant="secondary">
                <a
                  href="https://www.framer.com/motion/animation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Animation Guide
                </a>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
