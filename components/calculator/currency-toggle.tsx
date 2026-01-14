"use client";

import { Button } from "@/components/ui/button";

const currencies = [
    { symbol: "$", name: "USD", code: "USD" },
    { symbol: "R", name: "ZAR", code: "ZAR" },
    { symbol: "€", name: "EUR", code: "EUR" },
    { symbol: "£", name: "GBP", code: "GBP" },
    { symbol: "₦", name: "NGN", code: "NGN" },
];

interface CurrencyToggleProps {
    value: string; // This is the symbol
    onChange: (symbol: string, code: string) => void;
}

export function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {currencies.map((curr) => (
                <Button
                    key={curr.code}
                    variant={value === curr.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(curr.symbol, curr.code)}
                    className="h-8 w-10 p-0 text-base font-medium"
                >
                    {curr.symbol}
                </Button>
            ))}
        </div>
    );
}
