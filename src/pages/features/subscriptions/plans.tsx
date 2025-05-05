import { GetSubscriptions, Subscriptions } from "@/api/subscriptions.api";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PlansPage() {
  const { t } = useTranslation();
  const [plansDetail, setPlansDetail] = useState<Subscriptions[] | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.subscription.plan.breadcrumb.home"),
          t("pages.subscription.plan.breadcrumb.subscriptions"),
        ],
        links: ["/office/dashboard"],
      })
    );

    const fetchPlans = async () => {
      try {
        const data = await GetSubscriptions();
        setPlansDetail(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, [dispatch, t]);

  const navigate = useNavigate();

  const handleEdit = (planId: string) => {
    navigate(`/office/finance/plans/${planId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("pages.subscription.plan.page.title")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plansDetail?.map((plan) => (
          <Card key={plan.plan_id} className="p-2 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-auto">
            <CardHeader className="text-center mb-4">
              <CardTitle className="text-lg font-bold text-primary flex flex-col items-center">
                {plan.name}
                <Button variant={"ghost"} size="sm" className="mt-2" onClick={() => handleEdit(plan.plan_id!)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription className="text-xl font-semibold">
                {plan.price === 0
                  ? t("pages.subscription.plan.page.free")
                  : t("pages.subscription.plan.page.price", { price: plan.price })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  {t("pages.subscription.plan.page.priority_shipping", { percentage: plan.priority_shipping_percentage })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  {t("pages.subscription.plan.page.priority_months_offered", { months: plan.priority_months_offered })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  {t("pages.subscription.plan.page.max_insurance_coverage", { coverage: plan.max_insurance_coverage })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span>
                  {t("pages.subscription.plan.page.extra_insurance_price", { price: plan.extra_insurance_price })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span>
                  {t("pages.subscription.plan.page.shipping_discount", { discount: plan.shipping_discount })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span>
                  {t("pages.subscription.plan.page.permanent_discount", { discount: plan.permanent_discount })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span>
                  {t("pages.subscription.plan.page.small_package_permanent_discount", { discount: plan.small_package_permanent_discount })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  {t("pages.subscription.plan.page.first_shipping_free", { free: plan.first_shipping_free ? "Oui" : "Non" })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span>
                  {t("pages.subscription.plan.page.first_shipping_free_threshold", { threshold: plan.first_shipping_free_threshold })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>
                  {t("pages.subscription.plan.page.is_pro", { isPro: plan.is_pro ? "Oui" : "Non" })}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center mt-4">
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
