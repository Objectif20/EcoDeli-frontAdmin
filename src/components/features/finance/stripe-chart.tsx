"use client"

import {
  TrendingUp,
} from "lucide-react"
import {
  Area,
  Bar,
  Line,
  XAxis,
  AreaChart,
  RadialBar,
  RadialBarChart,
  BarChart,
} from "recharts"
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  CartesianGrid,
  LineChart,
} from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { PaymentStats, RevenueStats, TransactionStripe } from "@/api/finance.api"
import { useTranslation } from "react-i18next";

export const TransactionBarChart = ({ transactions }: { transactions: TransactionStripe[] }) => {
  const { t } = useTranslation();

  const chartConfig = {
    number: {
      label: t("pages.stripe.number"),
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.stripe.barChartTitle")}</CardTitle>
        <CardDescription>{t("pages.stripe.barChartDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={transactions}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="method"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="number" fill="var(--color-number)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {t("pages.stripe.increaseThisMonth")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {t("pages.stripe.totalVisitors")}
        </div>
      </CardFooter>
    </Card>
  )
}

export const RadialChartComponent = ({ payments }: { payments: PaymentStats }) => {
  const { t } = useTranslation();

  const chartData = payments.byMethod.map(method => ({
    method: method.method,
    value: method.value,
    fill: `hsl(var(--chart-${payments.byMethod.indexOf(method) + 1}))`
  }));

  const chartConfig = {
    value: {
      label: t("pages.stripe.value"),
    },
    ...payments.byMethod.reduce((acc, method, index) => {
      acc[method.method.toLowerCase().replace(' ', '')] = {
        label: method.method,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>)
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("pages.stripe.radialChartTitle")}</CardTitle>
        <CardDescription>{t("pages.stripe.radialChartDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="method" />}
            />
            <RadialBar dataKey="value" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {t("pages.stripe.increaseThisMonth")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {t("pages.stripe.totalVisitors")}
        </div>
      </CardFooter>
    </Card>
  );
};

export const RevenueProfitChart = ({ revenue }: { revenue: RevenueStats }) => {
  const { t } = useTranslation();

  const revenueChartConfig = {
    revenue: {
      label: t("pages.stripe.revenue"),
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: t("pages.stripe.profit"),
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.stripe.revenueProfit")}</CardTitle>
        <CardDescription>{t("pages.stripe.revenueProfitDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-full">
          <LineChart
            data={revenue.byPeriod}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="profit"
              type="monotone"
              stroke="var(--color-profit)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const GrossMarginChart = ({ revenue }: { revenue: RevenueStats }) => {
  const { t } = useTranslation();

  const marginChartConfig = {
    margin: {
      label: t("pages.stripe.margin"),
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.stripe.grossMargin")}</CardTitle>
        <CardDescription>{t("pages.stripe.grossMarginDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={marginChartConfig}>
          <AreaChart
            accessibilityLayer
            data={revenue.byPeriod}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="margin"
              type="natural"
              fill="var(--color-margin)"
              fillOpacity={0.4}
              stroke="var(--color-margin)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {t("pages.stripe.increaseThisMonth")} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {t("pages.stripe.januaryToJune2024")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
