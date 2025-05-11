import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { ChartAreaInteractive } from "@/components/features/dashboard/interactive-chart";
import SubscriptionChart from "@/components/features/dashboard/subscription-chart";
import PlanChart from "@/components/features/dashboard/plan-chart";
import { ParcelsChart } from "@/components/features/dashboard/parcels-chart";
import { useTranslation } from "react-i18next";
import { DashboardStats, FinanceApi } from "@/api/finance.api";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    plan: [],
    parcels: [],
    area: [],
    subscription: [],
  });

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.dashboard.breadcrumb.home")],
        links: ["/office/dashboard"],
      })
    );

    const fetchDashboardStats = async () => {
      try {
        const stats = await FinanceApi.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [dispatch, t]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t("pages.dashboard.title")}</h1>
      <ChartAreaInteractive data={dashboardStats.area} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SubscriptionChart data={dashboardStats.subscription} />
        <PlanChart data={dashboardStats.plan} />
        <ParcelsChart data={dashboardStats.parcels} />
      </div>
    </div>
  );
};

export default Dashboard;
