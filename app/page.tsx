"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { X, Sun, Moon, Twitter, Facebook, Github, Phone, Mail, ArrowRight } from "lucide-react"

// Spring configuration for smooth animations
const springConfig = { stiffness: 100, damping: 20 }

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", ...springConfig } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
}

const letterReveal = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", ...springConfig }
  }
}

const navOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } }
}

const navLinks = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", ...springConfig, delay: i * 0.1 }
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2, delay: (3 - i) * 0.05 }
  })
}

// Portfolio projects data
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and seamless checkout experience. Features include dynamic product catalogs, secure payment processing via Stripe, order tracking, and an intuitive admin dashboard for managing products, customers, and sales analytics.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Full-Stack"
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description: "Analytics dashboard with interactive data visualization and role-based access control. Built for enterprise teams to monitor KPIs, generate reports, and collaborate in real-time. Includes customizable widgets, data export functionality, and integration with popular business tools.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    category: "Web App"
  },
  {
    id: 3,
    title: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication and instant transfers. Users can manage accounts, pay bills, send money to contacts, and track spending with AI-powered insights. Achieved bank-level security compliance with 99.9% uptime.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    tech: ["React Native", "Firebase", "Node.js", "MongoDB"],
    category: "Mobile"
  },
  {
    id: 4,
    title: "AI Content Generator",
    description: "AI-powered platform for generating marketing copy, blog posts, and social media content. Leverages GPT models to create brand-consistent content at scale. Features include tone customization, content scheduling, plagiarism checking, and performance analytics.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tech: ["Python", "OpenAI", "FastAPI", "React"],
    category: "AI/ML"
  },
  {
    id: 5,
    title: "Real Estate Platform",
    description: "Property listing and management system with virtual tours and mortgage calculator. Connects buyers, sellers, and agents in a seamless marketplace. Features include 3D property walkthroughs, neighborhood insights, and automated lead management for agents.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    tech: ["Vue.js", "Laravel", "MySQL", "AWS"],
    category: "Marketplace"
  },
  {
    id: 6,
    title: "Fitness Tracking App",
    description: "Comprehensive fitness app with workout plans, nutrition tracking, and progress analytics. AI-powered form correction using device camera, personalized meal recommendations, and social challenges to keep users motivated on their fitness journey.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    tech: ["Flutter", "Dart", "Firebase", "TensorFlow"],
    category: "Mobile"
  }
]

// Navigation links
const navItems = ["Home", "About", "Portfolio", "Contact"]

// Theme Toggle Component
function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <motion.button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-secondary border border-border flex items-center px-1 cursor-pointer"
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", ...springConfig }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-3 h-3 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-3 h-3 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}

// Magnetic Button Component
function MagneticButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.2)
    y.set((e.clientY - centerY) * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Aperture Navigation Component
function ApertureNav({ isOpen, setIsOpen, isDark }: { isOpen: boolean; setIsOpen: (open: boolean) => void; isDark: boolean }) {
  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full bg-card/80 backdrop-blur-xl border border-border"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <motion.span
          className="w-5 h-0.5 bg-foreground rounded-full"
          animate={{ 
            rotate: isOpen ? 45 : 0, 
            y: isOpen ? 4 : 0,
            width: isOpen ? 20 : 20
          }}
          transition={{ type: "spring", ...springConfig }}
        />
        <motion.span
          className="w-5 h-0.5 bg-foreground rounded-full"
          animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="w-5 h-0.5 bg-foreground rounded-full"
          animate={{ 
            rotate: isOpen ? -45 : 0, 
            y: isOpen ? -4 : 0,
            width: isOpen ? 20 : 20
          }}
          transition={{ type: "spring", ...springConfig }}
        />
      </motion.button>

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={navOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  custom={i}
                  variants={navLinks}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setIsOpen(false)}
                  className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-foreground hover:text-primary transition-colors duration-300"
                >
                  {item}
                </motion.a>
              ))}
              
              {/* Social Links */}
              <motion.div
                className="flex items-center gap-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                exit={{ opacity: 0, y: -20 }}
              >
                <a
                  href="https://twitter.com/TitanTolux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/lucious.feranmi.17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hero Section Component
function HeroSection() {
  const headline = "Crafting Digital Excellence."
  const letters = headline.split("")

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 pointer-events-none" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      <motion.div
        className="relative z-10 text-center max-w-5xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Brand name */}
        <motion.p 
          className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground mb-6 font-mono"
          variants={fadeUp}
        >
          Tolux Titan
        </motion.p>

        {/* Main headline with staggered letter reveal */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter text-foreground mb-8 text-balance">
          <motion.span className="inline-block" variants={staggerContainer} initial="hidden" animate="visible">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                variants={letterReveal}
                className="inline-block"
                style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground tracking-wide mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.5 } }}
        >
          Architecture. Innovation. Entrepreneurship.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.5, type: "spring", ...springConfig } }}
        >
          <MagneticButton
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full overflow-hidden cursor-pointer"
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-titan-gold"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "spring", ...springConfig }}
            />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 2 } }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Pulse Status Card Component
function PulseStatusCard() {
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-30 max-w-[280px] md:max-w-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, type: "spring", ...springConfig }}
    >
      <motion.div
        className="relative px-4 py-3 rounded-xl bg-card/80 backdrop-blur-xl border border-border"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", ...springConfig }}
      >
        {/* Breathing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              "0 0 20px 0px rgba(16, 185, 129, 0.1)",
              "0 0 30px 5px rgba(16, 185, 129, 0.2)",
              "0 0 20px 0px rgba(16, 185, 129, 0.1)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        
        <div className="relative flex items-center gap-3">
          {/* Animated pulse dot */}
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-titan-emerald block" />
            <motion.span
              className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-titan-emerald"
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-sm text-foreground">
            Currently: <span className="font-medium">Available for Strategic Partnerships</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Portfolio Card Component
function PortfolioCard({ project, index, onSelect }: { project: typeof projects[0]; index: number; onSelect: (project: typeof projects[0]) => void }) {
  return (
    <motion.div
      onClick={() => onSelect(project)}
      className="group relative rounded-2xl bg-card/50 backdrop-blur-sm border border-border cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, type: "spring", ...springConfig }}
      whileHover={{ y: -5 }}
    >
      {/* Project Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm rounded-full text-foreground border border-border">
          {project.category}
        </span>
      </div>
      
      {/* Content */}
      <div className="relative p-5">
        <h3 className="text-lg font-serif font-bold text-foreground mb-2 tracking-tight">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs font-mono bg-secondary/50 rounded-full text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-mono bg-secondary/50 rounded-full text-muted-foreground">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Project Modal Component
function ProjectModal({ project, onClose }: { project: typeof projects[0] | null; onClose: () => void }) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (project) {
      window.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-3 sm:inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl z-50 rounded-2xl bg-card border border-border overflow-hidden flex flex-col max-h-[95vh] md:max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", ...springConfig }}
            style={{ 
              translateX: typeof window !== 'undefined' && window.innerWidth >= 768 ? "-50%" : "0%", 
              translateY: typeof window !== 'undefined' && window.innerWidth >= 768 ? "-50%" : "0%" 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors border border-border"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Project Image */}
            <div className="relative w-full aspect-video flex-shrink-0 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              
              {/* Category Badge */}
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm rounded-full text-foreground border border-border">
                {project.category}
              </span>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-3 tracking-tight">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                {project.description}
              </p>
              
              <div>
                <h4 className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm font-mono bg-secondary rounded-full text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Portfolio Section Component
function PortfolioSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", ...springConfig }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter text-foreground mb-4">
            Selected Work
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A curated collection of projects showcasing technical excellence and innovative solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <PortfolioCard 
              key={project.id} 
              project={project} 
              index={index} 
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* Project Modal - rendered outside the grid */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif font-bold tracking-tighter text-foreground mb-4">
              Tolux Titan
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Web Developer & Entrepreneur crafting digital excellence through architecture, innovation, and strategic partnerships.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/TitanTolux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/lucious.feranmi.17"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+2347032043623"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+234 703 204 3623</span>
              </a>
              <a
                href="mailto:hello@toluxtitan.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>hello@toluxtitan.com</span>
              </a>
            </div>
            
            <MagneticButton
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              Schedule a Consult
            </MagneticButton>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 Tolux Titan. Engineered with precision.</p>
          <p className="font-mono text-xs">v2.0.0</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function TitanNexus() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Handle theme persistence and system preference
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("titan-theme")
    if (stored) {
      setIsDark(stored === "dark")
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("titan-theme", isDark ? "dark" : "light")
  }, [isDark, mounted])

  // Prevent scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isNavOpen])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 left-6 z-50">
        <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
      </div>

      {/* Navigation */}
      <ApertureNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} isDark={isDark} />

      {/* Pulse Status Card */}
      <PulseStatusCard />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", ...springConfig }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tighter text-foreground mb-8">
              About
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              I&apos;m Tolux Titan, a Web Developer and Entrepreneur passionate about creating digital experiences that merge technical excellence with aesthetic precision. With expertise spanning full-stack development, UI/UX design, and business strategy, I help businesses transform their digital presence.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              My approach combines cutting-edge technologies with timeless design principles, ensuring every project delivers both immediate impact and long-term value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
