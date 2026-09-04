"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const number = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-semibold text-brand">{format(value)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

export function RoiCalculator() {
  const [visitors, setVisitors] = useState(1000);
  const [currentRate, setCurrentRate] = useState(1.6);
  const [currentAov, setCurrentAov] = useState(70);
  const [targetRate, setTargetRate] = useState(3.5);
  const [targetAov, setTargetAov] = useState(85);

  const stats = useMemo(() => {
    const currentConversions = visitors * (currentRate / 100);
    const currentRevenue = currentConversions * currentAov;
    const newConversions = visitors * (targetRate / 100);
    const newRevenue = newConversions * targetAov;
    const additionalRevenue = newRevenue - currentRevenue;
    const percentIncrease =
      currentRevenue > 0 ? (additionalRevenue / currentRevenue) * 100 : 0;

    return {
      currentConversions,
      currentRevenue,
      newConversions,
      newRevenue,
      additionalRevenue,
      percentIncrease,
    };
  }, [visitors, currentRate, currentAov, targetRate, targetAov]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-ink">Your Current Metrics</h3>
        <p className="text-sm text-muted">Tell us where your site stands today.</p>

        <div className="mt-6 space-y-6">
          <SliderField
            label="Monthly Website Visitors"
            value={visitors}
            onChange={setVisitors}
            min={100}
            max={50000}
            step={100}
            format={number}
          />
          <SliderField
            label="Current Conversion Rate"
            value={currentRate}
            onChange={setCurrentRate}
            min={0.1}
            max={10}
            step={0.1}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <SliderField
            label="Current Average Order Value"
            value={currentAov}
            onChange={setCurrentAov}
            min={10}
            max={500}
            step={5}
            format={currency}
          />
        </div>

        <h3 className="mt-8 text-lg font-semibold text-ink">Target Improvements</h3>
        <p className="text-sm text-muted">After working with {"DgConcept"}.</p>

        <div className="mt-6 space-y-6">
          <SliderField
            label="New Conversion Rate"
            value={targetRate}
            onChange={setTargetRate}
            min={0.1}
            max={10}
            step={0.1}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <SliderField
            label="New Average Order Value"
            value={targetAov}
            onChange={setTargetAov}
            min={10}
            max={500}
            step={5}
            format={currency}
          />
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Current Performance
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Conversions / mo</p>
              <p className="text-2xl font-bold text-ink">
                {number(stats.currentConversions)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Monthly Revenue</p>
              <p className="text-2xl font-bold text-ink">
                {currency(stats.currentRevenue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-none bg-gradient-to-br from-brand to-accent p-6 text-white">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/90">
            <TrendingUp className="h-3.5 w-3.5" />
            After Optimization
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/80">New Conversions / mo</p>
              <p className="text-2xl font-bold">{number(stats.newConversions)}</p>
            </div>
            <div>
              <p className="text-xs text-white/80">New Total Revenue</p>
              <p className="text-2xl font-bold">{currency(stats.newRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-white/80">Revenue Increase</p>
              <p className="text-2xl font-bold">
                {stats.percentIncrease >= 0 ? "+" : ""}
                {stats.percentIncrease.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-white/80">Additional Monthly Revenue</p>
              <p className="text-2xl font-bold">
                {stats.additionalRevenue >= 0 ? "+" : ""}
                {currency(stats.additionalRevenue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brand" />
          <h3 className="mt-2 text-lg font-semibold text-ink">
            Ready to unlock this revenue?
          </h3>
          <p className="mt-1 text-sm text-muted">
            Let&apos;s turn these numbers into reality with a high-converting
            website or Shopify build.
          </p>
          <Button asChild className="mt-4">
            <Link href="/contact">Start a Project →</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
