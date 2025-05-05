"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

const chartData = [
  { month: "Janvier", subscription: 186 },
  { month: "Février", subscription: 305 },
  { month: "Mars", subscription: 237 },
  { month: "Avril", subscription: 273 },
  { month: "Mai", subscription: 209 },
  { month: "Juin", subscription: 214 },
];

const chartConfig = {
  subscription: {
    label: "Abonnement",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function SubscriptionChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>{t("pages.dashboard.subscriptionChart.title")}</CardTitle>
        <CardDescription>
          {t("pages.dashboard.subscriptionChart.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="subscription"
              fill="var(--color-subscription)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {t("pages.dashboard.subscriptionChart.footer.increase")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {t("pages.dashboard.subscriptionChart.footer.period")}
        </div>
      </CardFooter>
    </Card>
  );
}
