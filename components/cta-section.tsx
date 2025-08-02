import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to transform your workflow?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of teams who have already streamlined their project management with SprintDeck.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/protected/projects" 
            className="apple-button bg-white text-blue-600 hover:shadow-lg"
          >
            Start Your Free Trial
          </Link>
          <button className="apple-button border-2 border-white/30 text-white hover:bg-white/10">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
} 