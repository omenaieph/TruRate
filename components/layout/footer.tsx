import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-zinc-950/50 py-12 mt-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-[10px] font-bold text-black font-sans">T</div>
                        <span className="text-sm font-bold tracking-tight text-white">TruRate</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} TruRate Financial Modeler
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                    <Link
                        href="/privacy"
                        className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Terms of Service
                    </Link>
                    <a
                        href="mailto:ephraimsdesign@gmail.com"
                        className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        Support
                    </a>
                </nav>
            </div>
        </footer>
    );
}
