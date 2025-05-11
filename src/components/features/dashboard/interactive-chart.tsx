"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";
import { AreaChartData } from "@/api/finance.api";

const chartConfig = {
  visitors: {
    label: "Clients",
  },
  provider: {
    label: "Prestations",
    color: "hsl(var(--chart-1))",
  },
  delivery: {
    label: "Livraison",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: AreaChartData[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{t("pages.dashboard.chartAreaInteractive.title")}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            {t("pages.dashboard.chartAreaInteractive.description")}
          </span>
          <span className="@[540px]/card:hidden">
            {t("pages.dashboard.chartAreaInteractive.descriptionShort")}
          </span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              {t("pages.dashboard.chartAreaInteractive.toggleGroup.3months")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              {t("pages.dashboard.chartAreaInteractive.toggleGroup.1month")}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              {t("pages.dashboard.chartAreaInteractive.toggleGroup.1week")}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Choisissez une valeur"
            >
              <SelectValue placeholder={t("pages.dashboard.chartAreaInteractive.select.placeholder")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t("pages.dashboard.chartAreaInteractive.select.options.3months")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("pages.dashboard.chartAreaInteractive.select.options.1month")}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t("pages.dashboard.chartAreaInteractive.select.options.1week")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} key={timeRange + filteredData.length}>
            <defs>
              <linearGradient id="fillProvider" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-provider)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-provider)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDelivery" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-delivery)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-delivery)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="delivery"
              type="natural"
              fill="url(#fillDelivery)"
              stroke="var(--color-delivery)"
              stackId="a"
            />
            <Area
              dataKey="provider"
              type="natural"
              fill="url(#fillProvider)"
              stroke="var(--color-provider)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
