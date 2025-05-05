import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { ChartAreaInteractive } from "@/components/features/dashboard/interactive-chart";
import SubscriptionChart from "@/components/features/dashboard/subscription-chart";
import PlanChart from "@/components/features/dashboard/plan-chart";
import { ParcelsChart } from "@/components/features/dashboard/parcels-chart";
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.dashboard.breadcrumb.home")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t("pages.dashboard.title")}</h1>
      <ChartAreaInteractive />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SubscriptionChart />
        <PlanChart />
        <ParcelsChart />
      </div>
    </div>
  );
};

export default Dashboard;
