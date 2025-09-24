'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Nutrition } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type NutritionInfoProps = {
  nutrition: Nutrition;
};

const COLORS = {
    protein: 'hsl(var(--chart-1))',
    fat: 'hsl(var(--chart-2))',
    carbs: 'hsl(var(--chart-3))'
};

export function NutritionInfo({ nutrition }: NutritionInfoProps) {
  const calories = nutrition.nutrients.find((n) => n.name === 'Calories');
  const fat = nutrition.nutrients.find((n) => n.name === 'Fat');
  const protein = nutrition.nutrients.find((n) => n.name === 'Protein');
  const carbs = nutrition.nutrients.find((n) => n.name === 'Carbohydrates');

  const chartData = [
    { name: 'Protein', value: nutrition.caloricBreakdown.percentProtein, fill: COLORS.protein },
    { name: 'Fat', value: nutrition.caloricBreakdown.percentFat, fill: COLORS.fat },
    { name: 'Carbs', value: nutrition.caloricBreakdown.percentCarbs, fill: COLORS.carbs },
  ];

  const chartConfig = {
    value: {
      label: 'Value',
    },
    Protein: {
      label: 'Protein',
      color: COLORS.protein,
    },
    Fat: {
      label: 'Fat',
      color: COLORS.fat,
    },
    Carbs: {
      label: 'Carbs',
      color: COLORS.carbs,
    },
  }

  return (
    <Card className="mb-8 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Leaf className="text-primary" />
          Nutrition Facts
        </CardTitle>
        <CardDescription>
            {calories && `Approx. ${Math.round(calories.amount)} calories per serving.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className='p-2 rounded-lg bg-background'>
                    <p className="font-bold text-lg">{protein ? `${Math.round(protein.amount)}g` : 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className='p-2 rounded-lg bg-background'>
                    <p className="font-bold text-lg">{fat ? `${Math.round(fat.amount)}g` : 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                </div>
                <div className='p-2 rounded-lg bg-background'>
                    <p className="font-bold text-lg">{carbs ? `${Math.round(carbs.amount)}g` : 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
            </div>
             <div className="h-40">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value, name) => `${name}: ${value.toFixed(0)}%`}/>}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={40}
                      strokeWidth={2}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
