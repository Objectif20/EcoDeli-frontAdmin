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

const chartData = [
  { date: "2024-04-01", provider: 222, delivery: 150 },
  { date: "2024-04-02", provider: 97, delivery: 180 },
  { date: "2024-04-03", provider: 167, delivery: 120 },
  { date: "2024-04-04", provider: 242, delivery: 260 },
  { date: "2024-04-05", provider: 373, delivery: 290 },
  { date: "2024-04-06", provider: 301, delivery: 340 },
  { date: "2024-04-07", provider: 245, delivery: 180 },
  { date: "2024-04-08", provider: 409, delivery: 320 },
  { date: "2024-04-09", provider: 59, delivery: 110 },
  { date: "2024-04-10", provider: 261, delivery: 190 },
  { date: "2024-04-11", provider: 327, delivery: 350 },
  { date: "2024-04-12", provider: 292, delivery: 210 },
  { date: "2024-04-13", provider: 342, delivery: 380 },
  { date: "2024-04-14", provider: 137, delivery: 220 },
  { date: "2024-04-15", provider: 120, delivery: 170 },
  { date: "2024-04-16", provider: 138, delivery: 190 },
  { date: "2024-04-17", provider: 446, delivery: 360 },
  { date: "2024-04-18", provider: 364, delivery: 410 },
  { date: "2024-04-19", provider: 243, delivery: 180 },
  { date: "2024-04-20", provider: 89, delivery: 150 },
  { date: "2024-04-21", provider: 137, delivery: 200 },
  { date: "2024-04-22", provider: 224, delivery: 170 },
  { date: "2024-04-23", provider: 138, delivery: 230 },
  { date: "2024-04-24", provider: 387, delivery: 290 },
  { date: "2024-04-25", provider: 215, delivery: 250 },
  { date: "2024-04-26", provider: 75, delivery: 130 },
  { date: "2024-04-27", provider: 383, delivery: 420 },
  { date: "2024-04-28", provider: 122, delivery: 180 },
  { date: "2024-04-29", provider: 315, delivery: 240 },
  { date: "2024-04-30", provider: 454, delivery: 380 },
  { date: "2024-05-01", provider: 165, delivery: 220 },
  { date: "2024-05-02", provider: 293, delivery: 310 },
  { date: "2024-05-03", provider: 247, delivery: 190 },
  { date: "2024-05-04", provider: 385, delivery: 420 },
  { date: "2024-05-05", provider: 481, delivery: 390 },
  { date: "2024-05-06", provider: 498, delivery: 520 },
  { date: "2024-05-07", provider: 388, delivery: 300 },
  { date: "2024-05-08", provider: 149, delivery: 210 },
  { date: "2024-05-09", provider: 227, delivery: 180 },
  { date: "2024-05-10", provider: 293, delivery: 330 },
  { date: "2024-05-11", provider: 335, delivery: 270 },
  { date: "2024-05-12", provider: 197, delivery: 240 },
  { date: "2024-05-13", provider: 197, delivery: 160 },
  { date: "2024-05-14", provider: 448, delivery: 490 },
  { date: "2024-05-15", provider: 473, delivery: 380 },
  { date: "2024-05-16", provider: 338, delivery: 400 },
  { date: "2024-05-17", provider: 499, delivery: 420 },
  { date: "2024-05-18", provider: 315, delivery: 350 },
  { date: "2024-05-19", provider: 235, delivery: 180 },
  { date: "2024-05-20", provider: 177, delivery: 230 },
  { date: "2024-05-21", provider: 82, delivery: 140 },
  { date: "2024-05-22", provider: 81, delivery: 120 },
  { date: "2024-05-23", provider: 252, delivery: 290 },
  { date: "2024-05-24", provider: 294, delivery: 220 },
  { date: "2024-05-25", provider: 201, delivery: 250 },
  { date: "2024-05-26", provider: 213, delivery: 170 },
  { date: "2024-05-27", provider: 420, delivery: 460 },
  { date: "2024-05-28", provider: 233, delivery: 190 },
  { date: "2024-05-29", provider: 78, delivery: 130 },
  { date: "2024-05-30", provider: 340, delivery: 280 },
  { date: "2024-05-31", provider: 178, delivery: 230 },
  { date: "2024-06-01", provider: 178, delivery: 200 },
  { date: "2024-06-02", provider: 470, delivery: 410 },
  { date: "2024-06-03", provider: 103, delivery: 160 },
  { date: "2024-06-04", provider: 439, delivery: 380 },
  { date: "2024-06-05", provider: 88, delivery: 140 },
  { date: "2024-06-06", provider: 294, delivery: 250 },
  { date: "2024-06-07", provider: 323, delivery: 370 },
  { date: "2024-06-08", provider: 385, delivery: 320 },
  { date: "2024-06-09", provider: 438, delivery: 480 },
  { date: "2024-06-10", provider: 155, delivery: 200 },
  { date: "2024-06-11", provider: 92, delivery: 150 },
  { date: "2024-06-12", provider: 492, delivery: 420 },
  { date: "2024-06-13", provider: 81, delivery: 130 },
  { date: "2024-06-14", provider: 426, delivery: 380 },
  { date: "2024-06-15", provider: 307, delivery: 350 },
  { date: "2024-06-16", provider: 371, delivery: 310 },
  { date: "2024-06-17", provider: 475, delivery: 520 },
  { date: "2024-06-18", provider: 107, delivery: 170 },
  { date: "2024-06-19", provider: 341, delivery: 290 },
  { date: "2024-06-20", provider: 408, delivery: 450 },
  { date: "2024-06-21", provider: 169, delivery: 210 },
  { date: "2024-06-22", provider: 317, delivery: 270 },
  { date: "2024-06-23", provider: 480, delivery: 530 },
  { date: "2024-06-24", provider: 132, delivery: 180 },
  { date: "2024-06-25", provider: 141, delivery: 190 },
  { date: "2024-06-26", provider: 434, delivery: 380 },
  { date: "2024-06-27", provider: 448, delivery: 490 },
  { date: "2024-06-28", provider: 149, delivery: 200 },
  { date: "2024-06-29", provider: 103, delivery: 160 },
  { date: "2024-06-30", provider: 446, delivery: 400 },
]


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

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
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
          <AreaChart data={filteredData}>
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
