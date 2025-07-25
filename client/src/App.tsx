
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import type { 
  PortfolioProject, 
  CreateContactSubmissionInput 
} from '../../server/src/schema';

// Testimonials data for the portfolio website
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Working Parent",
    avatar: "👩‍💼",
    quote: "Jasmine's Nanny Black Book completely transformed how I manage childcare. It's like having a personal assistant!"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Tech Startup Founder",
    avatar: "👨‍💻",
    quote: "The digital platform Jasmine built for us exceeded all expectations. Her tech vision is incredible."
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Busy Mom of 3",
    avatar: "👩‍👧‍👦",
    quote: "Finally, a tool that actually makes my life easier! The interface is so intuitive and fun to use."
  }
];

// Fallback projects data when backend is not available
const fallbackProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Nanny Black Book",
    description: "A comprehensive platform connecting families with trusted childcare providers. Features real-time scheduling, background checks, and community reviews.",
    image_url: null,
    project_url: "https://nannyblackbook.com",
    github_url: null,
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    is_featured: true,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    id: 2,
    title: "Tech Founder Hub",
    description: "A SaaS platform for early-stage founders to track metrics, manage investor relations, and collaborate with their teams.",
    image_url: null,
    project_url: null,
    github_url: "https://github.com/jasmine/tech-founder-hub",
    technologies: ["Next.js", "TypeScript", "Prisma", "Tailwind"],
    is_featured: true,
    created_at: new Date('2023-11-20'),
    updated_at: new Date('2023-11-20')
  },
  {
    id: 3,
    title: "Digital Product Suite",
    description: "A collection of micro-tools and digital products designed to solve everyday problems for busy professionals.",
    image_url: null,
    project_url: null,
    github_url: null,
    technologies: ["React Native", "Firebase", "Figma", "Framer"],
    is_featured: false,
    created_at: new Date('2023-08-10'),
    updated_at: new Date('2023-08-10')
  }
];

function App() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [contactForm, setContactForm] = useState<CreateContactSubmissionInput>({
    name: '',
    email: '',
    message: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const result = await trpc.getFeaturedProjects.query();
        setProjects(result.length > 0 ? result : fallbackProjects.filter(p => p.is_featured));
      } catch (error) {
        console.error('Failed to load projects, using fallback data:', error);
        setProjects(fallbackProjects.filter(p => p.is_featured));
      }
    };
    loadProjects();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactLoading(true);
    try {
      await trpc.createContactSubmission.mutate(contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    } finally {
      setIsContactLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterLoading(true);
    try {
      await trpc.createNewsletterSubscription.mutate({ email: newsletterEmail });
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              JM ✨
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection(heroRef)} className="text-gray-700 hover:text-purple-600 transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection(servicesRef)} className="text-gray-700 hover:text-purple-600 transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection(projectsRef)} className="text-gray-700 hover:text-purple-600 transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection(aboutRef)} className="text-gray-700 hover:text-purple-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection(contactRef)} className="text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Hey, I'm Jasmine Monique
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tech founder building digital products that make life easier, more fun, and way more organized. 
              I turn crazy ideas into reality with a splash of color and a lot of code. 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => scrollToSection(projectsRef)}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                See My Work ✨
              </Button>
              <Button 
                onClick={() => scrollToSection(contactRef)}
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold rounded-full transition-all"
              >
                Let's Chat 💬
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">What I Do 🎯</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              I specialize in creating digital solutions that solve real problems for real people.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 bg-gradient-to-br from-purple-100 to-pink-100">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🍼</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Childcare Tech</h3>
                <p className="text-gray-600 leading-relaxed">
                  Building platforms that connect families with trusted childcare providers. 
                  Making parenting a little easier, one app at a time.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 bg-gradient-to-br from-yellow-100 to-orange-100">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Tech Platforms</h3>
                <p className="text-gray-600 leading-relaxed">
                  Full-stack web applications and SaaS platforms that scale. 
                  From MVP to millions of users, I've got you covered.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 bg-gradient-to-br from-green-100 to-blue-100">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Digital Products</h3>
                <p className="text-gray-600 leading-relaxed">
                  Mobile apps, web tools, and digital experiences that people actually want to use. 
                  Beautiful design meets powerful functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Projects 🌟</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here are some of the things I've been building. Each project solves a real problem for real people.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project: PortfolioProject) => (
              <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-48 flex items-center justify-center">
                    <div className="text-6xl">🚀</div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.project_url && (
                        <Button 
                          variant="outline" 
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                          onClick={() => window.open(project.project_url || '', '_blank')}
                        >
                          View Live 🌐
                        </Button>
                      )}
                      {project.github_url && (
                        <Button 
                          variant="outline" 
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          onClick={() => window.open(project.github_url || '', '_blank')}
                        >
                          GitHub 👨‍💻
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">What People Say 💬</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take my word for it - here's what amazing people have to say about working with me.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{testimonial.avatar}</div>
                    <h4 className="font-bold text-lg text-gray-800">{testimonial.name}</h4>
                    <p className="text-purple-600 font-medium">{testimonial.role}</p>
                  </div>
                  <blockquote className="text-gray-600 italic text-center leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-white">Stay in the Loop 📬</h2>
            <p className="text-xl text-purple-100 mb-8">
              Get updates on new projects, beta access, and behind-the-scenes content. 
              No spam, just good vibes and cool tech stuff!
            </p>
            {newsletterSuccess ? (
              <div className="bg-white/20 text-white p-4 rounded-lg mb-4">
                🎉 Awesome! You're now subscribed to updates!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsletterEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isNewsletterLoading}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  {isNewsletterLoading ? 'Subscribing...' : 'Subscribe ✨'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">About Me 🌈</h2>
            <div className="text-6xl mb-8">👩‍💻</div>
            <div className="text-lg text-gray-600 leading-relaxed space-y-6">
              <p>
                Hey there! I'm Jasmine, a tech founder who believes that software should make life more colorful, 
                not more complicated. I've been building digital products for over 5 years, and I still get excited 
                every time I solve a problem that makes someone's day a little bit better.
              </p>
              <p>
                When I'm not coding, you'll find me brainstorming the next big idea over way too much coffee, 
                or testing my latest creation on anyone willing to give me feedback. I'm direct, I'm fun, 
                and I'm not afraid to take risks on wild ideas that might just change everything.
              </p>
              <p>
                My superpower? Taking complex problems and turning them into simple, beautiful solutions 
                that people actually want to use. Let's build something amazing together! 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">Let's Work Together 🤝</h2>
              <p className="text-xl text-gray-600">
                Have a project in mind? Want to chat about an idea? I'd love to hear from you!
              </p>
            </div>
            {contactSuccess ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thanks for reaching out! I'll get back to you within 24 hours.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Tell me about your project or idea..."
                        value={contactForm.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, message: e.target.value }))
                        }
                        rows={6}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isContactLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                    >
                      {isContactLoading ? 'Sending...' : 'Send Message 📨'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Jasmine Monique
            </div>
            <p className="text-gray-400 mb-6">
              Building the future, one colorful pixel at a time ✨
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://twitter.com/jasminemonique" className="text-gray-400 hover:text-purple-400 transition-colors">
                Twitter 🐦
              </a>
              <a href="https://linkedin.com/in/jasminemonique" className="text-gray-400 hover:text-purple-400 transition-colors">
                LinkedIn 💼
              </a>
              <a href="https://github.com/jasminemonique" className="text-gray-400 hover:text-purple-400 transition-colors">
                GitHub 👩‍💻
              </a>
              <a href="mailto:hello@jasminemonique.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                Email 📧
              </a>
            </div>
            <Separator className="bg-gray-800 mb-6" />
            <div className="text-sm text-gray-500">
              <p>© 2024 Jasmine Monique. Made with 💜 and lots of coffee.</p>
              <p className="mt-2">
                This site is built with React, TypeScript, and a whole lot of personality.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
