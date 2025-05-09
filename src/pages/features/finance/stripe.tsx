"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  LineChartIcon,
  RefreshCcw,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Area,
  Bar,
  BarChart as RechartBarChart,
  Line,
  ResponsiveContainer,
  XAxis,
  AreaChart,
  RadialBar,
  RadialBarChart,
  LabelList,
} from "recharts"
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  CartesianGrid,
  LineChart,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"

// Interfaces
interface StripeStats {
  revenue: RevenueStats;
  customers: CustomerStats;
  payments: PaymentStats;
  transactions: Transaction[];
}

interface RevenueStats {
  total: number;
  previousPeriod: number;
  percentChange: number;
  byPeriod: PeriodData[];
}

interface CustomerStats {
  total: number;
  new: number;
  percentChange: number;
  activeSubscribers: number;
}

interface PaymentStats {
  successRate: number;
  averageValue: number;
  refundRate: number;
  byMethod: PaymentMethod[];
}

interface PaymentMethod {
  method: string;
  count: number;
  value: number;
}

interface PeriodData {
  date: string;
  revenue: number;
  profit: number;
  margin: number;
}

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: "succeeded" | "failed" | "refunded";
  date: string;
  method: string;
}

// Données simulées
const mockStripeData: StripeStats = {
  revenue: {
    total: 48250,
    previousPeriod: 42100,
    percentChange: 14.6,
    byPeriod: [
      { date: "Jan", revenue: 4000, profit: 2400, margin: 60 },
      { date: "Fév", revenue: 4500, profit: 2700, margin: 60 },
      { date: "Mar", revenue: 5000, profit: 3000, margin: 60 },
      { date: "Avr", revenue: 4800, profit: 2880, margin: 60 },
      { date: "Mai", revenue: 5200, profit: 3120, margin: 60 },
      { date: "Juin", revenue: 5800, profit: 3480, margin: 60 },
      { date: "Juil", revenue: 6200, profit: 3720, margin: 60 },
      { date: "Août", revenue: 6800, profit: 4080, margin: 60 },
      { date: "Sep", revenue: 7200, profit: 4320, margin: 60 },
      { date: "Oct", revenue: 7800, profit: 4680, margin: 60 },
      { date: "Nov", revenue: 8200, profit: 4920, margin: 60 },
      { date: "Déc", revenue: 8500, profit: 5100, margin: 60 },
    ],
  },
  customers: {
    total: 1248,
    new: 128,
    percentChange: 8.2,
    activeSubscribers: 876,
  },
  payments: {
    successRate: 96.7,
    averageValue: 87.5,
    refundRate: 2.3,
    byMethod: [
      { method: "Credit Card", count: 850, value: 32500 },
      { method: "Apple Pay", count: 320, value: 12800 },
      { method: "Google Pay", count: 120, value: 4800 },
      { method: "Bank Transfer", count: 45, value: 1800 },
    ],
  },
  transactions: [
    {
      id: "pi_3OXYZaBC123456",
      customer: "John Doe",
      amount: 129.99,
      status: "succeeded",
      date: "2023-12-01",
      method: "Credit Card",
    },
    {
      id: "pi_3OXYZbBC123457",
      customer: "Jane Smith",
      amount: 79.99,
      status: "succeeded",
      date: "2023-12-01",
      method: "Apple Pay",
    },
    {
      id: "pi_3OXYZcBC123458",
      customer: "Bob Johnson",
      amount: 199.99,
      status: "refunded",
      date: "2023-12-02",
      method: "Credit Card",
    },
    {
      id: "pi_3OXYZdBC123459",
      customer: "Alice Brown",
      amount: 49.99,
      status: "succeeded",
      date: "2023-12-02",
      method: "Google Pay",
    },
    {
      id: "pi_3OXYZeBC123460",
      customer: "Charlie Wilson",
      amount: 299.99,
      status: "failed",
      date: "2023-12-03",
      method: "Credit Card",
    },
    {
      id: "pi_3OXYZfBC123461",
      customer: "Diana Miller",
      amount: 149.99,
      status: "succeeded",
      date: "2023-12-03",
      method: "Bank Transfer",
    },
    {
      id: "pi_3OXYZgBC123462",
      customer: "Edward Davis",
      amount: 89.99,
      status: "succeeded",
      date: "2023-12-04",
      method: "Apple Pay",
    },
    {
      id: "pi_3OXYZhBC123463",
      customer: "Fiona Clark",
      amount: 59.99,
      status: "succeeded",
      date: "2023-12-04",
      method: "Credit Card",
    },
    {
      id: "pi_3OXYZiBC123464",
      customer: "George White",
      amount: 129.99,
      status: "succeeded",
      date: "2023-12-05",
      method: "Credit Card",
    },
    {
      id: "pi_3OXYZjBC123465",
      customer: "Hannah Green",
      amount: 199.99,
      status: "succeeded",
      date: "2023-12-05",
      method: "Google Pay",
    },
  ],
};

// Composant de graphique radial
const RadialChartComponent = () => {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default function StripeDashboard() {
  const [period, setPeriod] = useState("30days");
  const [data, setData] = useState(mockStripeData);

  useEffect(() => {
    const filterDataByPeriod = () => {
      const now = new Date();
      let startDate = new Date(now);

      switch (period) {
        case "7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          startDate.setDate(now.getDate() - 90);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear(), 0, 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      const filteredTransactions = mockStripeData.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= now;
      });

      setData({
        ...mockStripeData,
        transactions: filteredTransactions,
      });
    };

    filterDataByPeriod();
  }, [period]);

  const formatCurrency = (amount : number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const revenueChartConfig = {
    revenue: {
      label: "Revenu",
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-2))",
    },
  };

  const marginChartConfig = {
    margin: {
      label: "Marge",
      color: "hsl(var(--chart-3))",
    },
  };

  const countChartConfig = {
    count: {
      label: "Compte",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Stripe</h1>
          <p className="text-muted-foreground">Surveillez vos statistiques de paiement et transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.revenue.percentChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={data.revenue.percentChange > 0 ? "text-green-500" : "text-red-500"}>
                {data.revenue.percentChange}%
              </span>
              <span className="ml-1">par rapport à la période précédente</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">{data.customers.percentChange}%</span>
              <span className="ml-1">par rapport à la période précédente</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.payments.successRate}%</div>
            <div className="text-xs text-muted-foreground">{data.payments.refundRate}% taux de remboursement</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Moyenne</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.payments.averageValue)}</div>
            <div className="text-xs text-muted-foreground">Par transaction réussie</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et Tableaux */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenu et Profit</CardTitle>
                <CardDescription>Tendances mensuelles de revenu et profit</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={revenueChartConfig} className="h-full">
                  <LineChart
                    data={data.revenue.byPeriod}
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
            <Card>
              <CardHeader>
                <CardTitle>Marge Brute</CardTitle>
                <CardDescription>Tendances mensuelles de la marge brute</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={marginChartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={data.revenue.byPeriod}
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
                      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      January - June 2024
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RadialChartComponent />
            <Card>
              <CardHeader>
                <CardTitle>Nombre de Transactions</CardTitle>
                <CardDescription>Nombre de transactions par méthode de paiement</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={countChartConfig} className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      data={data.payments.byMethod.map((method) => ({
                        name: method.method,
                        count: method.count,
                      }))}
                    >
                      <XAxis dataKey="name" />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des Clients</CardTitle>
              <CardDescription>Aperçu des données clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Abonnés Actifs</h3>
                  <div className="text-3xl font-bold">{data.customers.activeSubscribers}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((data.customers.activeSubscribers / data.customers.total) * 100).toFixed(1)}% des clients totaux
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Nouveaux Clients</h3>
                  <div className="text-3xl font-bold">{data.customers.new}</div>
                  <p className="text-sm text-muted-foreground mt-1">Pendant la période actuelle</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
