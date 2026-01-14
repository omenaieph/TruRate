import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
            <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
                <header className="space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                        ← Back to Calculator
                    </Link>
                    <h1 className="text-4xl font-bold text-white tracking-tighter">Privacy Policy</h1>
                    <p className="text-zinc-500 font-mono text-xs">Last Updated: January 14, 2026</p>
                </header>

                <section className="space-y-6 text-sm leading-relaxed text-zinc-400">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">1. Information We Collect</h2>
                        <p>
                            TruRate is a calculation tool. Most data you enter remains local to your browser session.
                            We use functional cookies to remember your workspace settings (like currency preference).
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">2. Advertising & Analytics</h2>
                        <p>
                            We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site based on your prior visits to our website or other websites.
                        </p>
                        <p>
                            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">3. Data Security</h2>
                        <p>
                            We prioritize your privacy. No personal financial data is stored on our servers. All calculations are performed client-side.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-white/5">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        TruRate Compliance & Protection
                    </p>
                </footer>
            </div>
        </div>
    );
}
