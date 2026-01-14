"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateRate, RateInputs, RateOutputs } from "@/lib/calculations";
import { CurrencyToggle } from "@/components/calculator/currency-toggle";
import { BreakdownChart } from "@/components/calculator/breakdown-chart";
import { CookieBanner } from "@/components/calculator/cookie-banner";
import { AnalysisTabs } from "@/components/calculator/analysis-tabs";
import { ScenarioSwitcher } from "@/components/calculator/scenario-switcher";
import { Footer } from "@/components/layout/footer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Info, HelpCircle } from "lucide-react";

const DEFAULT_INPUTS: RateInputs = {
  monthlyNetIncome: 5000,
  weeklyBillableHours: 25,
  weeksOffYear: 4,
  taxRatePercent: 25,
  monthlyExpenses: 500,
  nonBillableHoursPerWeek: 10,
  monthlySavingsTarget: 1000,
  industryRole: "Strategy Consultant",
};

const INDUSTRY_BENCHMARKS: Record<string, { min: number; max: number; category: string }> = {
  // Tech & Digital
  "AI Solutions Architect": { min: 140, max: 280, category: "Tech & Digital" },
  "Cybersecurity Consultant": { min: 120, max: 250, category: "Tech & Digital" },
  "Data Scientist / ML Eng": { min: 100, max: 220, category: "Tech & Digital" },
  "Fullstack Engineer": { min: 85, max: 170, category: "Tech & Digital" },
  "Mobile App Developer": { min: 90, max: 190, category: "Tech & Digital" },
  "SEO Specialist": { min: 55, max: 120, category: "Tech & Digital" },
  "Technical Writer": { min: 65, max: 140, category: "Tech & Digital" },
  "UI/UX Designer": { min: 70, max: 140, category: "Tech & Digital" },

  // Finance & Strategy
  "Financial Advisor": { min: 100, max: 250, category: "Finance & Strategy" },
  "Quantitative Analyst": { min: 160, max: 380, category: "Finance & Strategy" },
  "Strategy Consultant": { min: 130, max: 320, category: "Finance & Strategy" },
  "Management Consultant": { min: 100, max: 220, category: "Finance & Strategy" },
  "Executive Coach": { min: 150, max: 400, category: "Finance & Strategy" },

  // Healthcare & Wellness
  "Dental Surgeon (Private)": { min: 180, max: 450, category: "Healthcare & Wellness" },
  "Private Medical Specialist": { min: 200, max: 600, category: "Healthcare & Wellness" },
  "Psychotherapist": { min: 90, max: 220, category: "Healthcare & Wellness" },

  // Creative & Marketing
  "Branding & Identity Lead": { min: 80, max: 180, category: "Creative & Marketing" },
  "Content Strategist": { min: 60, max: 130, category: "Creative & Marketing" },
  "Copywriter": { min: 45, max: 110, category: "Creative & Marketing" },
  "Digital Marketing Manager": { min: 65, max: 150, category: "Creative & Marketing" },
  "Motion Designer / Editor": { min: 60, max: 140, category: "Creative & Marketing" },

  // Legal & Compliance
  "Private Practice Lawyer": { min: 150, max: 500, category: "Legal & Compliance" },
  "Legal Consultant": { min: 110, max: 280, category: "Legal & Compliance" },
};

export default function TruRatePage() {
  const [scenarios, setScenarios] = useState<{ A: RateInputs, B: RateInputs }>({
    A: DEFAULT_INPUTS,
    B: DEFAULT_INPUTS,
  });
  const [activeScenario, setActiveScenario] = useState<'A' | 'B'>('A');
  const [currency, setCurrency] = useState("$");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [activeTab, setActiveTab] = useState<'analysis' | 'strategy' | 'quote'>('analysis');
  const [guideMode, setGuideMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("truerate_scenarios");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScenarios({
          A: { ...DEFAULT_INPUTS, ...parsed.A },
          B: { ...DEFAULT_INPUTS, ...parsed.B },
        });
      } catch (e) { }
    }
    const savedActive = localStorage.getItem("truerate_active_scenario") as 'A' | 'B';
    if (savedActive) setActiveScenario(savedActive);
    const savedCurrency = localStorage.getItem("truerate_currency");
    if (savedCurrency) setCurrency(savedCurrency);
    const savedCurrencyCode = localStorage.getItem("truerate_currency_code");
    if (savedCurrencyCode) setCurrencyCode(savedCurrencyCode);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("truerate_scenarios", JSON.stringify(scenarios));
      localStorage.setItem("truerate_active_scenario", activeScenario);
      localStorage.setItem("truerate_currency", currency);
      localStorage.setItem("truerate_currency_code", currencyCode);
    }
  }, [scenarios, activeScenario, currency, currencyCode, isLoaded]);

  const inputs = scenarios[activeScenario];
  const resultsA = useMemo(() => calculateRate(scenarios.A), [scenarios.A]);
  const resultsB = useMemo(() => calculateRate(scenarios.B), [scenarios.B]);

  const results = activeScenario === 'A' ? resultsA : resultsB;
  const alternateResults = activeScenario === 'A' ? resultsB : resultsA;

  const delta = results.hourlyRate - alternateResults.hourlyRate;
  const deltaPercent = alternateResults.hourlyRate > 0
    ? ((results.hourlyRate - alternateResults.hourlyRate) / alternateResults.hourlyRate) * 100
    : 0;

  const formatCurrency = (value: number, minimumFractionDigits = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits === 0 ? 0 : 2,
    }).format(value);
  };

  const fontSizeClass = useMemo(() => {
    const len = results.hourlyRate.toLocaleString().length;
    if (len > 8) return "text-[40px] sm:text-[50px] md:text-[60px]";
    if (len > 5) return "text-[60px] sm:text-[75px] md:text-[85px]";
    return "text-[70px] sm:text-[90px] md:text-[110px]";
  }, [results.hourlyRate]);

  const insights = useMemo(() => {
    const hourly = results.hourlyRate;
    const monthlyNet = inputs.monthlyNetIncome;
    const tax = inputs.taxRatePercent;
    const exp = inputs.monthlyExpenses;
    const savings = inputs.monthlySavingsTarget;

    const totalNeeded = monthlyNet + exp + savings;
    const taxImpact = totalNeeded * (tax / (100 - tax));

    return {
      summary: `To pocket ${formatCurrency(monthlyNet)} net, your architecture must generate ${formatCurrency(totalNeeded + taxImpact)} in gross revenue monthly.`,
      breakdown: `Your rate of ${formatCurrency(hourly, 2)} covers ${formatCurrency(taxImpact)} in taxes, ${formatCurrency(exp)} in overheads, and ${formatCurrency(savings)} in wealth building.`,
      efficiency: inputs.nonBillableHoursPerWeek > 5 ?
        `Reducing unbilled hours (${inputs.nonBillableHoursPerWeek}h/wk) could increase your effective rate by ${formatCurrency((results.hourlyRate - results.effectiveHourlyRate) / 2, 2)}.` :
        "Your operation is currently highly efficient with low unbilled drain."
    };
  }, [results, inputs, currencyCode]);

  const updateInput = (key: keyof RateInputs, value: number | string) => {
    setScenarios((prev) => ({
      ...prev,
      [activeScenario]: { ...prev[activeScenario], [key]: value },
    }));
  };

  const chartData = useMemo(() => [
    { name: "Take Home", value: results.annualNet, color: "#10b981" },
    { name: "Tax", value: results.annualTax, color: "#fb7185" },
    { name: "Expenses", value: results.annualExpenses, color: "#3f3f46" },
  ], [results]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans selection:bg-emerald-500/30">
      {/* Precision Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-24 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              T
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight leading-none mb-1">TruRate</h1>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Universal Rate Modeler</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-500 ${guideMode ? "bg-blue-500/10 border-blue-500/30" : "bg-zinc-900/50 border-white/5"}`}>
              <div className="flex items-center gap-2">
                <HelpCircle className={`w-3 h-3 ${guideMode ? "text-blue-400" : "text-zinc-600"}`} />
                <Label htmlFor="guide-mode" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer">Guide Mode</Label>
              </div>
              <Switch
                id="guide-mode"
                checked={guideMode}
                onCheckedChange={setGuideMode}
                className="scale-75 data-[state=checked]:bg-blue-500"
              />
            </div>
            <CurrencyToggle value={currency} onChange={(s, c) => { setCurrency(s); setCurrencyCode(c); }} />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Configuration Space */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">

            {/* Primary Objective Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">01. Setup</span>
                <div className="h-px flex-1 bg-zinc-900" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between group hover:border-white/5 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.02]" : "bg-zinc-900/20 border-white/[0.03] ring-1 ring-white/[0.02]"}`}>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Desired Take-Home</Label>
                    <p className="text-[10px] text-zinc-700">The net monthly cash you want to see in your pocket.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-mono text-xs">{currency}</span>
                      <input
                        type="number"
                        value={inputs.monthlyNetIncome}
                        onChange={(e) => updateInput("monthlyNetIncome", Number(e.target.value))}
                        className="bg-transparent text-right text-2xl font-semibold text-white focus:outline-none w-full font-sans tracking-tight"
                      />
                    </div>
                    <Slider
                      value={[inputs.monthlyNetIncome]}
                      onValueChange={([val]) => updateInput("monthlyNetIncome", val)}
                      max={20000}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between group hover:border-white/5 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.02]" : "bg-zinc-900/20 border-white/[0.03] ring-1 ring-white/[0.02]"}`}>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Billable Capacity</Label>
                    <p className="text-[10px] text-zinc-700">Hours per week spent on direct client work.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-mono text-xs">HRS</span>
                      <input
                        type="number"
                        value={inputs.weeklyBillableHours}
                        onChange={(e) => updateInput("weeklyBillableHours", Number(e.target.value))}
                        className="bg-transparent text-right text-2xl font-semibold text-white focus:outline-none w-full font-sans tracking-tight"
                      />
                    </div>
                    <Slider
                      value={[inputs.weeklyBillableHours]}
                      onValueChange={([val]) => updateInput("weeklyBillableHours", val)}
                      max={60}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                <div className={`p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between group hover:border-white/5 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.02]" : "bg-zinc-900/20 border-white/[0.03] ring-1 ring-white/[0.02]"}`}>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Practice Efficiency</Label>
                    <p className="text-[10px] text-zinc-700">Operational & Sales effort required to sustain billing.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-mono text-xs">HRS</span>
                      <input
                        type="number"
                        value={inputs.nonBillableHoursPerWeek}
                        onChange={(e) => updateInput("nonBillableHoursPerWeek", Number(e.target.value))}
                        className="bg-transparent text-right text-2xl font-semibold text-white focus:outline-none w-full font-sans tracking-tight"
                      />
                    </div>
                    <Slider
                      value={[inputs.nonBillableHoursPerWeek]}
                      onValueChange={([val]) => updateInput("nonBillableHoursPerWeek", val)}
                      max={40}
                      className="opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Overheads Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">02. Overheads</span>
                <div className="h-px flex-1 bg-zinc-900" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Tax Forecast", key: "taxRatePercent", unit: "%", desc: "Estimated government slice.", max: 50 },
                  { label: "Business Expenses", key: "monthlyExpenses", unit: currency, desc: "Tools, desks, subscriptions.", max: 5000 },
                  { label: "Wealth Goals", key: "monthlySavingsTarget", unit: currency, desc: "Mandatory savings target.", max: 10000 },
                  { label: "Vacation Weeks", key: "weeksOffYear", unit: "Wks", desc: "Annual rest and recovery.", max: 12 },
                ].map((item) => (
                  <div key={item.key} className={`p-6 rounded-2xl border flex flex-col justify-between group hover:border-white/10 transition-all duration-500 ${guideMode ? "ring-2 ring-blue-500/30 bg-blue-500/[0.01]" : "bg-zinc-900/10 border-white/5"}`}>
                    <div className="space-y-1 mb-4">
                      <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.label}</Label>
                      <p className="text-[8px] text-zinc-700 uppercase tracking-tight">{item.desc}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="number"
                        value={inputs[item.key as keyof RateInputs]}
                        onChange={(e) => updateInput(item.key as keyof RateInputs, Number(e.target.value))}
                        className="bg-transparent text-lg font-semibold text-zinc-300 focus:outline-none w-full"
                      />
                      <span className="text-[10px] font-mono text-zinc-700">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 lg:sticky lg:top-12">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 p-2 rounded-xl transition-all duration-500 ${guideMode ? "bg-blue-500/5 ring-1 ring-blue-500/30" : ""}`}>
              <div className="space-y-0.5">
                <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Financial Analysis</h2>
                {guideMode && <p className="text-[8px] text-blue-400 font-bold uppercase tracking-wider">Compare different financial outcomes</p>}
              </div>
              <ScenarioSwitcher active={activeScenario} onChange={setActiveScenario} />
            </div>

            <AnalysisTabs active={activeTab} onChange={setActiveTab} />

            <AnimatePresence mode="wait">
              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis-view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  {/* The Master Result */}
                  <div className={`p-1.5 rounded-[32px] transition-all duration-500 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.05]" : "bg-gradient-to-b from-white/10 to-transparent shadow-2xl"}`}>
                    <div className="bg-[#0c0c0e] rounded-[28px] p-12 text-center space-y-10 border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                      <div className="space-y-4 relative">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.6em]">Calculated Target Rate</p>
                          {Math.abs(delta) > 0.01 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.05em] px-3 py-1 rounded-full border shadow-lg backdrop-blur-md ${delta > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                            >
                              <span className="opacity-80">{delta > 0 ? '↑' : '↓'}</span>
                              <span>{currency}{Math.abs(delta).toFixed(2)}</span>
                              <span className="opacity-40 text-[8px]">•</span>
                              <span>{Math.abs(deltaPercent).toFixed(1)}%</span>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-4xl font-light text-zinc-600 font-sans tracking-tighter mt-4">{currency}</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={`${activeScenario}-${results.hourlyRate}`}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              className={`${fontSizeClass} font-bold text-white tracking-tighter font-mono leading-none`}
                            >
                              {results.hourlyRate.toLocaleString()}
                            </motion.span>
                          </AnimatePresence>
                          <div className="flex flex-col items-start gap-1 mt-8">
                            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">/ hr</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-10 border-t border-white/5 pt-10 mt-4 relative">
                        <div className="text-center group/rate relative">
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Standard Day</p>
                          <div className="flex flex-col items-center">
                            <p className="text-xl font-semibold text-zinc-300 font-mono tracking-tight">{formatCurrency(results.dayRate)}</p>
                            {Math.abs(delta) > 0.01 && (
                              <p className="text-[9px] font-bold text-white/10 font-mono absolute -bottom-4 tracking-tight">
                                {formatCurrency(alternateResults.dayRate)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-px h-8 bg-zinc-900" />
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Full Capacity</p>
                          <p className="text-xl font-semibold text-zinc-300 font-mono tracking-tight">{formatCurrency(results.monthlyGross)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Allocation Table */}
                  <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-zinc-900/10 space-y-8 flex flex-col relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Allocation Detail</h3>
                      <div className="w-16 h-16">
                        <BreakdownChart
                          data={[
                            { name: 'Net', value: inputs.monthlyNetIncome, color: '#10b981' },
                            { name: 'Tax', value: results.annualTax / 12, color: '#ef4444' },
                            { name: 'Overhead', value: inputs.monthlyExpenses, color: '#3b82f6' },
                            { name: 'Wealth', value: inputs.monthlySavingsTarget, color: '#8b5cf6' }
                          ]}
                          formatter={(val) => formatCurrency(Number(val))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 font-mono text-[11px]">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-900/50">
                        <span className="text-zinc-600 uppercase tracking-wider">Estimated Monthly Net</span>
                        <span className="text-emerald-500 font-bold">{formatCurrency(results.annualNet)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-900/50">
                        <span className="text-zinc-600 uppercase tracking-wider">Tax Reserves (Forecast)</span>
                        <span className="text-rose-500/60">-{formatCurrency(results.annualTax)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-900/50">
                        <span className="text-zinc-600 uppercase tracking-wider">Operating Expenses</span>
                        <span className="text-zinc-500">-{formatCurrency(results.annualExpenses)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insights Interpreter */}
                  <div className="p-6 rounded-2xl bg-zinc-900/10 border border-white/5 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Info className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <span>Insights Interpreter</span>
                        <div className="h-px flex-1 bg-zinc-800" />
                      </h4>
                    </div>
                    <div className="space-y-3 relative z-10">
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {insights.summary}
                      </p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed italic border-l border-zinc-800 pl-3">
                        {insights.breakdown}
                      </p>
                      <div className="pt-2">
                        <p className="text-[10px] text-blue-400/80 bg-blue-500/5 px-2 py-1 rounded inline-block">
                          {insights.efficiency}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'strategy' && (
                <motion.div
                  key="strategy-view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  {/* Market Intelligence Module */}
                  <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.05]" : "border-white/5 bg-zinc-900/10"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Market Intelligence</Label>
                      <select
                        value={inputs.industryRole}
                        onChange={(e) => updateInput("industryRole", e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-semibold text-zinc-300 focus:outline-none scrollbar-thin overflow-y-auto max-h-48"
                      >
                        {Array.from(new Set(Object.values(INDUSTRY_BENCHMARKS).map(b => b.category))).map(category => (
                          <optgroup key={category} label={category} className="bg-zinc-950 text-zinc-500 font-bold uppercase tracking-widest text-[8px]">
                            {Object.entries(INDUSTRY_BENCHMARKS)
                              .filter(([_, b]) => b.category === category)
                              .map(([role, _]) => (
                                <option key={role} value={role} className="text-zinc-300 bg-zinc-900 font-medium h-8">{role}</option>
                              ))
                            }
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-zinc-700">Low End</span>
                        <span className="text-zinc-500">Market Avg</span>
                        <span className="text-zinc-700">Premium</span>
                      </div>
                      <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/[0.02]">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-emerald-500/20 to-purple-500/20" />
                        <motion.div
                          initial={{ left: 0 }}
                          animate={{
                            left: `${Math.min(100, (results.hourlyRate / (INDUSTRY_BENCHMARKS[inputs.industryRole as keyof typeof INDUSTRY_BENCHMARKS]?.max || 200)) * 100)}%`
                          }}
                          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"
                        />
                      </div>
                      <p className="text-[10px] text-center text-zinc-500 font-medium">
                        Your rate is <span className="text-white">
                          {results.hourlyRate < INDUSTRY_BENCHMARKS[inputs.industryRole as keyof typeof INDUSTRY_BENCHMARKS].min ? "below" :
                            results.hourlyRate > INDUSTRY_BENCHMARKS[inputs.industryRole as keyof typeof INDUSTRY_BENCHMARKS].max ? "above" : "within"}
                        </span> typical {inputs.industryRole} benchmarks.
                        {currencyCode !== "USD" && (
                          <span className="block mt-1 text-[8px] text-zinc-600 uppercase tracking-tighter italic">
                            * Benchmarks are calculated in USD equivalents
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Hidden Drain Module */}
                  <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 space-y-6 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.05]" : "border-white/5 bg-zinc-900/10"}`}>
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Efficiency Audit</Label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {((inputs.weeklyBillableHours / (inputs.weeklyBillableHours + inputs.nonBillableHoursPerWeek)) * 100).toFixed(0)}% Utilized
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/[0.02] relative group/tooltip">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-[9px] font-bold text-zinc-600 uppercase">Effective Rate</p>
                          <Info className="w-2.5 h-2.5 text-zinc-800 group-hover/tooltip:text-blue-400 transition-colors" />
                        </div>
                        <p className="text-lg font-bold text-white font-mono">{formatCurrency(results.effectiveHourlyRate, 2)}</p>
                        <p className="text-[8px] text-zinc-700 uppercase mt-1"> factoring {inputs.nonBillableHoursPerWeek}h admin</p>

                        {/* Tooltip content */}
                        <div className="absolute bottom-full left-0 mb-2 w-40 sm:w-48 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-2xl">
                          <p className="text-[8px] sm:text-[9px] text-zinc-300 leading-relaxed italic">
                            "What you actually earn per hour when unbilled effort is factored in."
                          </p>
                        </div>
                      </div>
                      <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/[0.02] relative group/tooltip">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-[9px] font-bold text-zinc-600 uppercase">Opportunity Cost</p>
                          <Info className="w-2.5 h-2.5 text-zinc-800 group-hover/tooltip:text-rose-400 transition-colors" />
                        </div>
                        <p className="text-lg font-bold text-rose-500/80 font-mono">-{formatCurrency(inputs.nonBillableHoursPerWeek * results.hourlyRate)}</p>
                        <p className="text-[8px] text-zinc-700 uppercase mt-1">Unbilled monthly value</p>

                        {/* Tooltip content */}
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-2xl">
                          <p className="text-[9px] text-zinc-300 leading-relaxed italic text-right">
                            "The potential revenue lost to admin and sales effort."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wealth Accelerator Module */}
                  <div className="p-8 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-xs">✨</span>
                      </div>
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Wealth Accelerator</h4>
                    </div>
                    <div className="text-xs text-zinc-400 leading-relaxed group/tooltip relative inline-block">
                      To cover your <span className="text-white font-semibold">{formatCurrency(inputs.monthlySavingsTarget)}</span> savings goal,
                      your hourly rate carries a <span className="text-emerald-400 font-bold border-b border-emerald-500/20 border-dotted cursor-help">
                        {((inputs.monthlySavingsTarget / (inputs.monthlyNetIncome || 1)) * 100).toFixed(1)}%
                      </span> wealth premium.

                      {/* Tooltip content */}
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-zinc-900 border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-2xl">
                        <p className="text-[9px] text-zinc-300 leading-relaxed italic">
                          "The additional margin required to fund your savings after all costs and taxes."
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quote' && (
                <motion.div
                  key="quote-view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className={`p-8 rounded-2xl border transition-all duration-500 space-y-6 ${guideMode ? "ring-2 ring-blue-500/50 bg-blue-500/[0.05]" : "border-white/5 bg-zinc-900/10"}`}>
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Proposal Architect</Label>
                      <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                        Safety Buffer Active
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Small Sprint (20h)", hours: 20 },
                        { label: "Medium Project (80h)", hours: 80 },
                        { label: "Large Contract (160h)", hours: 160 },
                      ].map(proj => {
                        const base = proj.hours * results.hourlyRate;
                        const buffered = base * 1.2; // 20% safety buffer
                        return (
                          <div key={proj.label} className="p-4 rounded-xl bg-zinc-950/50 border border-white/[0.02] flex justify-between items-center group hover:border-white/10 transition-colors">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">{proj.label}</p>
                              <p className="text-[9px] text-zinc-700">Estimated value</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white font-mono">{formatCurrency(buffered)}</p>
                              <p className="text-[8px] text-zinc-600 line-through">Base: {formatCurrency(base)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-6 rounded-xl bg-blue-500/[0.02] border border-blue-500/10">
                      <p className="text-[10px] text-blue-400/80 leading-relaxed italic text-center">
                        "Quotes include a 20% safety margin for scope creep and unexpected revisions."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
