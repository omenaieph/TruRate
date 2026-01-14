export interface RateInputs {
    monthlyNetIncome: number;
    weeklyBillableHours: number;
    weeksOffYear: number;
    taxRatePercent: number;
    monthlyExpenses: number;
    // Phase 2 Fields
    nonBillableHoursPerWeek: number;
    monthlySavingsTarget: number;
    industryRole: string;
}

export interface RateOutputs {
    hourlyRate: number;
    dayRate: number;
    annualGross: number;
    annualTax: number;
    annualExpenses: number;
    annualNet: number;
    monthlyGross: number;
    totalBillableHours: number;
    // Phase 2 Outputs
    effectiveHourlyRate: number;
    annualSavings: number;
    totalWorkHoursPerYear: number;
}

export function calculateRate(inputs: RateInputs): RateOutputs {
    const {
        monthlyNetIncome = 0,
        weeklyBillableHours = 0,
        weeksOffYear = 0,
        taxRatePercent = 0,
        monthlyExpenses = 0,
        nonBillableHoursPerWeek = 0,
        monthlySavingsTarget = 0,
    } = inputs;

    // Phase 2: Add Savings to the required annual net
    const annualNet = (monthlyNetIncome + monthlySavingsTarget) * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualSavings = monthlySavingsTarget * 12;
    const taxRateDecimal = taxRatePercent / 100;

    const divisor = 1 - taxRateDecimal;
    const annualGross = divisor > 0 ? (annualNet + annualExpenses) / divisor : (annualNet + annualExpenses);

    const annualTax = annualGross - annualNet - annualExpenses;

    const weeksWorkedYear = (52 - weeksOffYear);
    const totalBillableHours = weeklyBillableHours * weeksWorkedYear;
    const totalWorkHoursPerYear = (weeklyBillableHours + nonBillableHoursPerWeek) * weeksWorkedYear;

    const hourlyRate = totalBillableHours > 0 ? annualGross / totalBillableHours : 0;
    const effectiveHourlyRate = totalWorkHoursPerYear > 0 ? annualGross / totalWorkHoursPerYear : 0;
    const dayRate = hourlyRate * 8;
    const monthlyGross = annualGross / 12;

    return {
        hourlyRate,
        dayRate,
        annualGross,
        annualTax,
        annualExpenses,
        annualNet,
        monthlyGross,
        totalBillableHours,
        effectiveHourlyRate,
        annualSavings,
        totalWorkHoursPerYear,
    };
}
