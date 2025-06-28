import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Subscriptions, SubscriptionsApi } from "@/api/subscriptions.api";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function EditPlanPage() {
  const { t } = useTranslation();
  const [planDetail, setPlanDetail] = useState<Subscriptions | null>(null);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  if (!id) {
    navigate("/office/finance/plans");
  }

  const formSchema = z.object({
    name: z.string().min(1, { message: t("pages.subscription.update.page.errors.required") }),
    price: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    priority_shipping_percentage: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    priority_months_offered: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.non_negative") }),
    max_insurance_coverage: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    extra_insurance_price: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    shipping_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    permanent_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    permanent_discount_percentage: z.string().refine((val) => !isNaN(Number(val)) || val === "", { message: t("pages.subscription.update.page.errors.valid_number") }).optional(),
    small_package_permanent_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    first_shipping_free: z.boolean(),
    first_shipping_free_threshold: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.update.page.errors.valid_number") }),
    is_pro: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: planDetail?.name || "",
      price: planDetail?.price ? String(planDetail.price) : "",
      priority_shipping_percentage: planDetail?.priority_shipping_percentage ? String(planDetail.priority_shipping_percentage) : "",
      priority_months_offered: planDetail?.priority_months_offered ? String(planDetail.priority_months_offered) : "",
      max_insurance_coverage: planDetail?.max_insurance_coverage ? String(planDetail.max_insurance_coverage) : "",
      extra_insurance_price: planDetail?.extra_insurance_price ? String(planDetail.extra_insurance_price) : "",
      shipping_discount: planDetail?.shipping_discount ? String(planDetail.shipping_discount) : "",
      permanent_discount: planDetail?.permanent_discount ? String(planDetail.permanent_discount) : "",
      permanent_discount_percentage: planDetail?.permanent_discount_percentage ? String(planDetail.permanent_discount_percentage) : "",
      small_package_permanent_discount: planDetail?.small_package_permanent_discount ? String(planDetail.small_package_permanent_discount) : "",
      first_shipping_free: planDetail?.first_shipping_free || false,
      first_shipping_free_threshold: planDetail?.first_shipping_free_threshold ? String(planDetail.first_shipping_free_threshold) : "",
      is_pro: planDetail?.is_pro || false,
    },
  });

  const { control, handleSubmit, setValue } = form;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (id) {
          const data = await SubscriptionsApi.GetSubscriptionById(id);
          setPlanDetail(data);
          setValue("name", data.name || "");
          setValue("price", String(data.price) || "");
          setValue("priority_shipping_percentage", String(data.priority_shipping_percentage) || "");
          setValue("priority_months_offered", String(data.priority_months_offered) || "");
          setValue("max_insurance_coverage", String(data.max_insurance_coverage) || "");
          setValue("extra_insurance_price", String(data.extra_insurance_price) || "");
          setValue("shipping_discount", String(data.shipping_discount) || "");
          setValue("permanent_discount", String(data.permanent_discount) || "");
          setValue("small_package_permanent_discount", String(data.small_package_permanent_discount) || "");
          setValue("first_shipping_free", data.first_shipping_free || false);
          setValue("first_shipping_free_threshold", String(data.first_shipping_free_threshold) || "");
          setValue("is_pro", data.is_pro || false);
        } else {
          console.error('Error: id is undefined');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
      }
    };

    fetchPlan();
  }, [id, setValue]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.subscription.update.breadcrumb.home"),
          t("pages.subscription.update.breadcrumb.subscriptions"),
          planDetail?.name || ""
        ],
        links: ["/office/dashboard", 'office/finance/plans'],
      })
    );
  }, [planDetail, dispatch, t]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data && id) {
      const apiData: Subscriptions = {
        ...data,
        price: Number(data.price),
        priority_shipping_percentage: (data.priority_shipping_percentage),
        priority_months_offered: Number(data.priority_months_offered),
        max_insurance_coverage: (data.max_insurance_coverage),
        extra_insurance_price: (data.extra_insurance_price),
        shipping_discount: (data.shipping_discount),
        permanent_discount: (data.permanent_discount),
        permanent_discount_percentage: data.permanent_discount_percentage ? (data.permanent_discount_percentage) : undefined,
        small_package_permanent_discount: (data.small_package_permanent_discount),
        first_shipping_free_threshold: (data.first_shipping_free_threshold),
      };

      await SubscriptionsApi.updateSubscription(id, apiData);

      navigate("/office/finance/plans");
    }
    console.log(data);
  }

  if (!planDetail) {
    return <div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("pages.subscription.update.page.title")}
      </h1>
      <Card className="p-6 border rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.name_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.price")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.price_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_shipping_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.priority_shipping")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.priority_shipping_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_months_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.priority_months_offered")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.priority_months_offered_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="max_insurance_coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.max_insurance_coverage")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.max_insurance_coverage_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="extra_insurance_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.extra_insurance_price")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.extra_insurance_price_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="shipping_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.shipping_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.shipping_discount_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.permanent_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.permanent_discount_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="small_package_permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.small_package_permanent_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.small_package_permanent_discount_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="first_shipping_free"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel>{t("pages.subscription.update.page.form.first_shipping_free")}</FormLabel>
                  <FormDescription>{t("pages.subscription.update.page.form.first_shipping_free_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="first_shipping_free_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.update.page.form.first_shipping_free_threshold")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.update.page.form.first_shipping_free_threshold_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit" className="btn btn-primary">
                {t("pages.subscription.update.page.form.update_button")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
