import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Subscriptions, SubscriptionsApi } from "@/api/subscriptions.api";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function AddPlanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z.string().min(1, { message: t("pages.subscription.add.page.errors.required") }),
    price: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    priority_shipping_percentage: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    priority_months_offered: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.non_negative") }),
    max_insurance_coverage: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    extra_insurance_price: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    shipping_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    permanent_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    permanent_discount_percentage: z.string().refine((val) => !isNaN(Number(val)) || val === "", { message: t("pages.subscription.add.page.errors.valid_number") }).optional(),
    small_package_permanent_discount: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    first_shipping_free: z.boolean(),
    first_shipping_free_threshold: z.string().refine((val) => !isNaN(Number(val)), { message: t("pages.subscription.add.page.errors.valid_number") }),
    is_pro: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      priority_shipping_percentage: "",
      priority_months_offered: "",
      max_insurance_coverage: "",
      extra_insurance_price: "",
      shipping_discount: "",
      permanent_discount: "",
      permanent_discount_percentage: "",
      small_package_permanent_discount: "",
      first_shipping_free: false,
      first_shipping_free_threshold: "",
      is_pro: false,
    },
  });

  const { control, handleSubmit } = form;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.subscription.add.breadcrumb.home"),
          t("pages.subscription.add.breadcrumb.subscriptions"),
          t("pages.subscription.add.breadcrumb.add")
        ],
        links: ["/office/dashboard", 'office/finance/plans'],
      })
    );
  }, [dispatch, t]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data) {
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

      await SubscriptionsApi.addSubscription(apiData);

      navigate("/office/finance/plans");
    }
    console.log(data);
  }

  return (
    <div className="max-w-7xl w-5-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("pages.subscription.add.page.title")}
      </h1>
      <Card className="p-6 border rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.name_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.price")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.price_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_shipping_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.priority_shipping")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.priority_shipping_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_months_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.priority_months_offered")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.priority_months_offered_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="max_insurance_coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.max_insurance_coverage")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.max_insurance_coverage_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="extra_insurance_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.extra_insurance_price")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.extra_insurance_price_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="shipping_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.shipping_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.shipping_discount_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.permanent_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.permanent_discount_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="small_package_permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.small_package_permanent_discount")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.small_package_permanent_discount_description")}</FormDescription>
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
                  <FormLabel>{t("pages.subscription.add.page.form.first_shipping_free")}</FormLabel>
                  <FormDescription>{t("pages.subscription.add.page.form.first_shipping_free_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="first_shipping_free_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.subscription.add.page.form.first_shipping_free_threshold")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>{t("pages.subscription.add.page.form.first_shipping_free_threshold_description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit" className="btn btn-primary">
                {t("pages.subscription.add.page.form.add_button")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
