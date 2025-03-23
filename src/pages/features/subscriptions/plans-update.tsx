import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { GetSubscriptionById, Subscriptions, updateSubscription } from "@/api/subscriptions.api";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";

export default function EditPlanPage() {
  const [planDetail, setPlanDetail] = useState<Subscriptions | null>(null);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  if (!id) {
    navigate("/office/finance/plans");
  }

  const formSchema = z.object({
    name: z.string().min(1, { message: "Le nom est requis." }),
    price: z.number().min(0, { message: "Le prix doit être un nombre valide." }),
    priority_shipping_percentage: z.number().min(0, { message: "Le pourcentage doit être un nombre valide." }),
    priority_months_offered: z.number().min(0, { message: "Le nombre de mois doit être supérieur ou égal à 0." }),
    max_insurance_coverage: z.number().min(0, { message: "La couverture d'assurance doit être un nombre valide." }),
    extra_insurance_price: z.number().min(0, { message: "Le prix de l'assurance supplémentaire doit être un nombre valide." }),
    shipping_discount: z.number().min(0, { message: "La réduction sur la livraison doit être un nombre valide." }),
    permanent_discount: z.number().min(0, { message: "La réduction permanente doit être un nombre valide." }),
    permanent_discount_percentage: z.number().min(0, { message: "Le pourcentage de réduction doit être un nombre valide." }).optional(),
    small_package_permanent_discount: z.number().min(0, { message: "La réduction pour petits colis doit être un nombre valide." }),
    first_shipping_free: z.boolean(),
    first_shipping_free_threshold: z.number().min(0, { message: "Le seuil doit être un nombre valide." }),
    is_pro: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: planDetail?.name || "",
      price: planDetail?.price ? Number(planDetail.price) : 0,
      priority_shipping_percentage: planDetail?.priority_shipping_percentage ? Number(planDetail.priority_shipping_percentage) : 0,
      priority_months_offered: planDetail?.priority_months_offered || 0,
      max_insurance_coverage: planDetail?.max_insurance_coverage ? Number(planDetail.max_insurance_coverage) : 0,
      extra_insurance_price: planDetail?.extra_insurance_price ? Number(planDetail.extra_insurance_price) : 0,
      shipping_discount: planDetail?.shipping_discount ? Number(planDetail.shipping_discount) : 0,
      permanent_discount: planDetail?.permanent_discount ? Number(planDetail.permanent_discount) : 0,
      permanent_discount_percentage: planDetail?.permanent_discount_percentage ? Number(planDetail.permanent_discount_percentage) : undefined,
      small_package_permanent_discount: planDetail?.small_package_permanent_discount ? Number(planDetail.small_package_permanent_discount) : 0,
      first_shipping_free: planDetail?.first_shipping_free || false,
      first_shipping_free_threshold: planDetail?.first_shipping_free_threshold ? Number(planDetail.first_shipping_free_threshold) : 0,
      is_pro: planDetail?.is_pro || false,
    },
  });

  const { control, handleSubmit, setValue } = form;

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchPlan = async () => {
      try {
        if (id) {
          const data = await GetSubscriptionById(id);
          setPlanDetail(data);
          setValue("name", data.name || "");
          setValue("price", Number(data.price) || 0);
          setValue("priority_shipping_percentage", Number(data.priority_shipping_percentage) || 0);
          setValue("priority_months_offered", Number(data.priority_months_offered) || 0);
          setValue("max_insurance_coverage", Number(data.max_insurance_coverage) || 0);
          setValue("extra_insurance_price", Number(data.extra_insurance_price) || 0);
          setValue("shipping_discount", Number(data.shipping_discount) || 0);
          setValue("permanent_discount", Number(data.permanent_discount) || 0);
          setValue("small_package_permanent_discount", Number(data.small_package_permanent_discount) || 0);
          setValue("first_shipping_free", data.first_shipping_free || false);
          setValue("first_shipping_free_threshold", Number(data.first_shipping_free_threshold) || 0);
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
        segments: ["Accueil", "Abonnements", planDetail?.name || ""],
        links: ["/office/dashboard", 'office/finance/plans'],
      })
    );
  }, [planDetail, dispatch]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (data && id) {
      const apiData: Subscriptions = {
        ...data,
        priority_shipping_percentage: String(data.priority_shipping_percentage),
        max_insurance_coverage: String(data.max_insurance_coverage),
        extra_insurance_price: String(data.extra_insurance_price),
        shipping_discount: String(data.shipping_discount),
        permanent_discount: String(data.permanent_discount),
        permanent_discount_percentage: data.permanent_discount_percentage ? String(data.permanent_discount_percentage) : undefined,
        small_package_permanent_discount: String(data.small_package_permanent_discount),
        first_shipping_free_threshold: String(data.first_shipping_free_threshold),
      };
  
      await updateSubscription(id, apiData);

      navigate("/office/finance/plans");
      
    }
    console.log(data);
  }

  if (!planDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Modifier la Formule d'Abonnement</h1>
      <Card className="p-6 border rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Nom de la formule</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Prix de la formule en euros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_shipping_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Livraison prioritaire (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Pourcentage de livraison prioritaire</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority_months_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mois de priorité offerts</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Nombre de mois de priorité offerts</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="max_insurance_coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couverture d'assurance maximale (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Couverture d'assurance maximale en euros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="extra_insurance_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de l'assurance supplémentaire (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Prix de l'assurance supplémentaire en euros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="shipping_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réduction sur la livraison (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Réduction sur la livraison en euros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réduction permanente (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Réduction permanente en euros</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="small_package_permanent_discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réduction permanente pour petits colis (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Réduction permanente pour petits colis en euros</FormDescription>
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
                  <FormLabel>Première livraison gratuite</FormLabel>
                  <FormDescription>La première livraison est-elle gratuite ?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="first_shipping_free_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seuil pour la première livraison gratuite (€)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Seuil en euros pour la première livraison gratuite</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="is_pro"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel>Formule professionnelle</FormLabel>
                  <FormDescription>Est-ce une formule professionnelle ?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit" className="btn btn-primary">
                Mettre à jour
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
