import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-accent/5 overflow-x-hidden flex items-center justify-center">
      {/* Hero Section */}
      <div className="text-center space-y-8 px-4 md:pt-0 pt-32">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:text-white text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Streamlining Committee Management
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            <span className="block bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Join Flow
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome! Register as a program committee member and help us make
            this event a tremendous success together. Your participation
            matters!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
          <Link
            href="/register"
            className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 dark:hover:border-primary/30"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="bg-primary text-primary-foreground rounded-2xl w-16 h-16 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-bold text-xl text-foreground">
                Register Committee
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign up as a program committee member and contribute to our
                event's success
              </p>
              <div className="pt-2">
                <span className="text-primary font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                  Get Started
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/admin"
            className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-destructive/50 dark:hover:border-destructive/30"
          >
            <div className="absolute inset-0 bg-linear-to-br from-destructive/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-4">
              <div className="bg-destructive text-destructive-foreground rounded-2xl w-16 h-16 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-bold text-xl text-foreground">Admin Panel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage committee registrations and oversee the entire process
                (Authorized personnel only)
              </p>
              <div className="pt-2">
                <span className="text-destructive font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                  Access Panel
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Info Section */}
        <div className="max-w-4xl mx-auto px-4 pt-16">
          <div className="bg-muted/50 border border-border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Join Our Committee?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Become part of a dynamic team shaping the future of our events.
              Your expertise and insights are invaluable in creating memorable
              experiences for all participants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
