import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Project Management
            <span className="block gradient-text">
              Made <span className="squiggly-underline">Simple</span>.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            This is a demo project management application. It showcases modern web development 
            practices with Next.js, TypeScript, and Supabase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/protected/projects" 
              className="apple-button-dark"
            >
              Try the demo
            </Link>
            <a 
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="apple-button-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch video
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 