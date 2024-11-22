"use client";

import { useTypingStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function StatsDisplay() {
  const results = useTypingStore((state) => state.results);

  const averageWPM = Math.round(
    results.reduce((acc, curr) => acc + curr.wpm, 0) / results.length || 0
  );

  const averageAccuracy = Math.round(
    results.reduce((acc, curr) => acc + curr.accuracy, 0) / results.length || 0
  );

  const totalTests = results.length;

  const chartData = results.map((result) => ({
    ...result,
    date: format(new Date(result.timestamp), "MMM d, HH:mm"),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Average WPM
          </h3>
          <p className="text-3xl font-bold">{averageWPM}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Accuracy
          </h3>
          <p className="text-3xl font-bold">{averageAccuracy}%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Tests
          </h3>
          <p className="text-3xl font-bold">{totalTests}</p>
        </Card>
      </motion.div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Progress Over Time</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ dy: 30 }}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                domain={['auto', 'auto']}
                label={{ value: 'WPM', angle: -90, position: 'insideLeft', dy: 50 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                label={{ value: 'Accuracy %', angle: 90, position: 'insideRight', dy: -50 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wpm"
                stroke="hsl(var(--primary))"
                name="WPM"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--destructive))"
                name="Accuracy %"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}