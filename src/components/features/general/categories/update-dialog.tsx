import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VehicleCategory } from "@/api/general.api";

const getFormSchema = (t: (key: string) => string) => z.object({
  id: z.string(),
  name: z.string().min(2, { message: t("pages.category.error.nameMinChars") }),
  max_weight: z.coerce.number().positive({ message: t("pages.category.error.weightPositive") }),
  max_dimension: z.coerce.number().positive({ message: t("pages.category.error.volumePositive") }),
});

interface UpdateVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VehicleCategory;
  onSubmit: (values: VehicleCategory) => Promise<void>;
  existingCategories: VehicleCategory[];
}

export function UpdateVehicleDialog({ open, onOpenChange, vehicle, onSubmit, existingCategories }: UpdateVehicleDialogProps) {
  const { t } = useTranslation();

  const formSchema = getFormSchema(t);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: vehicle.id,
      name: vehicle.name,
      max_weight: vehicle.max_weight,
      max_dimension: vehicle.max_dimension,
    },
  });

  useEffect(() => {
    form.reset({
      id: vehicle.id,
      name: vehicle.name,
      max_weight: vehicle.max_weight,
      max_dimension: vehicle.max_dimension,
    });
  }, [vehicle, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const isNameUnique = !existingCategories.some(category => category.name === values.name && category.id !== values.id);
      if (!isNameUnique) {
        form.setError("name", {
          type: "manual",
          message: t("pages.category.error.uniqueName"),
        });
        return;
      }

      onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error(t("pages.category.error.updating"), error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("pages.category.editVehicleCategory")}</DialogTitle>
          <DialogDescription>{t("pages.category.editCategoryInfo")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.category.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.category.maxWeightKg")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max_dimension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.category.maxVolumeM3")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{t("pages.category.saveChanges")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
