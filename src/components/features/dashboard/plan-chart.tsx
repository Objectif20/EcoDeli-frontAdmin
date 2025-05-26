"use client";

import { Cell, LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PlanChartData } from "@/api/finance.api";

interface PlanChartProps {
  data: PlanChartData[];
}

export default function PlanChart({ data }: PlanChartProps) {
  const { t } = useTranslation();

  const dynamicChartConfig = data.reduce((acc, item) => {
    const colorIndex = (Number(item.colorIndex) % 5) + 1;
    acc[item.plan] = {
      label: item.plan,
      color: `hsl(var(--chart-${colorIndex}))`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const chartConfig: Record<string, { label: string; color?: string }> = {
    number: { label: "Clients" },
    ...dynamicChartConfig,
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("pages.dashboard.planChart.title")}</CardTitle>
        <CardDescription>{t("pages.dashboard.planChart.description")}</CardDescription>
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
              <Pie data={data} dataKey="number">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.plan]?.color}
                  />
                ))}
                <LabelList
                  dataKey="plan"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: string) => chartConfig[value]?.label}
                />
              </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {t("pages.dashboard.planChart.footer.increase")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {t("pages.dashboard.planChart.footer.totalParcels")}
        </div>
      </CardFooter>
    </Card>
  );
}
