import { useState, useEffect } from "react";
import { FinanceApi, StripeStats } from "@/api/finance.api"; // Assurez-vous que le chemin est correct
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GrossMarginChart, RadialChartComponent, RevenueProfitChart, TransactionBarChart } from "@/components/features/finance/stripe-chart";

export default function StripeDashboard() {
  const [period, setPeriod] = useState("30days");
  const [data, setData] = useState<StripeStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stripeStats = await FinanceApi.getStripeStats();
        setData(stripeStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

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
