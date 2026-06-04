import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Target } from "lucide-react";
import { NotificationSettings } from "@/components/notification-settings";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-xl font-sans tracking-tight">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#0F766E"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tracked
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant={location === "/dashboard" ? "secondary" : "ghost"} className={`rounded-xl font-medium ${location === "/dashboard" ? "bg-secondary/20 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/guidance">
                <Button variant={location === "/guidance" ? "secondary" : "ghost"} className={`rounded-xl font-medium ${location === "/guidance" ? "bg-secondary/20 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <Target className="mr-2 h-4 w-4" />
                  Guidance
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-sm font-medium text-foreground">
              {user?.firstName || "Student"}
            </div>
            <NotificationSettings />
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-border text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ redirectUrl: basePath || "/" })}
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border px-4 py-2 flex gap-2 overflow-x-auto">
          <Link href="/dashboard">
            <Button variant={location === "/dashboard" ? "secondary" : "ghost"} size="sm" className={`rounded-xl font-medium ${location === "/dashboard" ? "bg-secondary/20 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/guidance">
            <Button variant={location === "/guidance" ? "secondary" : "ghost"} size="sm" className={`rounded-xl font-medium ${location === "/guidance" ? "bg-secondary/20 text-secondary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Target className="mr-2 h-4 w-4" />
              Guidance
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="w-full border-t border-border bg-card/60 mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">
              © 2026 Attendance Tracker Dashboard
            </p>
            <p className="text-xs text-muted-foreground">
              Concept &amp; Product Design by{" "}
              <span className="font-semibold text-foreground/70">Aditya Narayan Parial</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground tracking-wide">
            Built with AI Assistance
          </p>
        </div>
      </footer>
    </div>
  );
}
