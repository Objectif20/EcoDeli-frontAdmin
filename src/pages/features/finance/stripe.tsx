import { useState, useEffect } from "react";
import { FinanceApi, StripeStats } from "@/api/finance.api";
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
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function StripeDashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("30days");
  const [data, setData] = useState<StripeStats | null>(null);
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.stripe.breadcrumb.home"), t("pages.stripe.breadcrumb.stripeManagement")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

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
          <h1 className="text-3xl font-bold tracking-tight">{t("pages.stripe.dashboardTitle")}</h1>
          <p className="text-muted-foreground">{t("pages.stripe.dashboardDescription")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("pages.stripe.period.30days")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t("pages.stripe.period.7days")}</SelectItem>
              <SelectItem value="30days">{t("pages.stripe.period.30days")}</SelectItem>
              <SelectItem value="90days">{t("pages.stripe.period.90days")}</SelectItem>
              <SelectItem value="year">{t("pages.stripe.period.year")}</SelectItem>
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
            <CardTitle className="text-sm font-medium">{t("pages.stripe.totalRevenue")}</CardTitle>
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
              <span className="ml-1">{t("pages.stripe.comparedToPreviousPeriod")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages.stripe.customers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">{data.customers.percentChange}%</span>
              <span className="ml-1">{t("pages.stripe.comparedToPreviousPeriod")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages.stripe.successRate")}</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.payments.successRate}%</div>
            <div className="text-xs text-muted-foreground">{data.payments.refundRate}% {t("pages.stripe.refundRate")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pages.stripe.averageTransaction")}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.payments.averageValue)}</div>
            <div className="text-xs text-muted-foreground">{t("pages.stripe.perSuccessfulTransaction")}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("pages.stripe.overview")}</TabsTrigger>
          <TabsTrigger value="customers">{t("pages.stripe.customersTab")}</TabsTrigger>
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
              <CardTitle>{t("pages.stripe.customerStats")}</CardTitle>
              <CardDescription>{t("pages.stripe.customerStatsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("pages.stripe.activeSubscribers")}</h3>
                  <div className="text-3xl font-bold">{data.customers.activeSubscribers}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((data.customers.activeSubscribers / data.customers.total) * 100).toFixed(1)}% {t("pages.stripe.ofTotalCustomers")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("pages.stripe.newCustomers")}</h3>
                  <div className="text-3xl font-bold">{data.customers.new}</div>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.stripe.duringCurrentPeriod")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}