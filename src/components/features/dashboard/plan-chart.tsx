"use client"

import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

const chartData = [
  { plan: "free", number: 275, fill: "var(--color-free)" },
  { plan: "starter", number: 200, fill: "var(--color-starter)" },
  { plan: "premium", number: 187, fill: "var(--color-premium)" },
]

const chartConfig = {
  number: {
    label: "Clients",
  },
  free: {
    label: "Free",
    color: "hsl(var(--chart-1))",
  },
  starter: {
    label: "Starter",
    color: "hsl(var(--chart-2))",
  },
  premium: {
    label: "Premium",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function PlanChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des abonnements</CardTitle>
        <CardDescription>Répartition des abonnements en fonction des plans</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="number" hideLabel />}
            />
            <Pie data={chartData} dataKey="number" label>
              <LabelList
                dataKey="plan"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string | number) => chartConfig[value as keyof typeof chartConfig]?.label || value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Augmentation de 7.8% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total de colis expédiés
        </div>
      </CardFooter>
    </Card>
  )
}
