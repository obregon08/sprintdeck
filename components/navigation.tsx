import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { getSession } from "@/lib/auth-server";
import Link from "next/link";

export async function Navigation() {
  const session = await getSession();

  return (
    <nav className="w-full glass-effect sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-signature text-2xl font-bold gradient-text">
            SprintDeck
          </Link>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {session && (
            <>
              <Link href="/protected/projects" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Projects
              </Link>
              <span className="text-gray-700 dark:text-gray-300"> | </span>
            </>
          )}

          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
} 