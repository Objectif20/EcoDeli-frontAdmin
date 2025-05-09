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
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GrossMarginChart, RadialChartComponent, RevenueProfitChart, StripeStats, TransactionBarChart } from "@/components/features/finance/stripe-chart"




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
      { method: "Carte de crédit", count: 850, value: 32500 },
      { method: "Apple Pay", count: 320, value: 12800 },
      { method: "Google Pay", count: 120, value: 4800 },
      { method: "Virement bancaire", count: 45, value: 1800 },
    ],
  },
  transactions: [
    {
      method: "CB",
      number: 850,
    },
    {
      method: "Apple",
      number: 320,
    },
    {
      method: "Google",
      number: 120,
    },
    {
      method: "Cash",
      number: 30,
    },
    {
      method: "Check",
      number: 15,
    },
  ]
};

export default function StripeDashboard() {
  const [period, setPeriod] = useState("30days");
  const [data, setData] = useState(mockStripeData);

  useEffect(() => {
    const filterDataByPeriod = () => {
      setData({
        ...mockStripeData,
        transactions: mockStripeData.transactions,
      });
    };

    filterDataByPeriod();
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueProfitChart revenue={data.revenue} />
            <GrossMarginChart revenue={data.revenue} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RadialChartComponent payments={data.payments} />
            <TransactionBarChart transactions={data.transactions} />
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
