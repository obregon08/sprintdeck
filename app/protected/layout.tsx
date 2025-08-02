import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex items-center">
                <Link href={"/"} className="font-signature text-2xl font-bold">SprintDeck</Link>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/protected/projects" className="text-sm hover:text-foreground/80">
                  Projects
                </Link>
                <span className="text-foreground/40">|</span>
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              </div>
            </div>
          </nav>
          <div className="flex-1 flex flex-col gap-20 w-full max-w-5xl p-5">
            {children}
          </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Made with ❤️ by{" "}
              <a
                href="https://georgeobregon.com"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                GeorgeObregon.com
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    </QueryProvider>
  );
}
