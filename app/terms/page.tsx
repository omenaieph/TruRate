import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30">
            <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
                <header className="space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                        ← Back to Calculator
                    </Link>
                    <h1 className="text-4xl font-bold text-white tracking-tighter">Terms of Service</h1>
                    <p className="text-zinc-500 font-mono text-xs">Last Updated: January 14, 2026</p>
                </header>

                <section className="space-y-6 text-sm leading-relaxed text-zinc-400">
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">1. Use of Service</h2>
                        <p>
                            TruRate is a financial modeling utility. The results provided are estimates designed for informational purposes only.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">2. No Financial Advice</h2>
                        <p>
                            The calculations provided by TruRate do not constitute professional financial or tax advice. Consult with a certified accountant before making business decisions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">3. Limitation of Liability</h2>
                        <p>
                            TruRate shall not be held liable for any financial decisions or consequences resulting from the use of our modeling tools.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-white/5">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        TruRate Terms & Conditions
                    </p>
                </footer>
            </div>
        </div>
    );
}
