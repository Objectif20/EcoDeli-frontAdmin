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
import { useState } from "react";

const getFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t("pages.category.error.nameMinChars") }),
  max_weight: z.coerce.number().positive({ message: t("pages.category.error.weightPositive") }),
  max_dimension: z.coerce.number().positive({ message: t("pages.category.error.volumePositive") }),
});

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>;
  existingCategories: VehicleCategory[];
}

export function AddVehicleDialog({ open, onOpenChange, onSubmit, existingCategories }: AddVehicleDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = getFormSchema(t);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      max_weight: 0,
      max_dimension: 0,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const isNameUnique = !existingCategories.some(category => category.name === values.name);
      if (!isNameUnique) {
        form.setError("name", {
          type: "manual",
          message: t("pages.category.error.uniqueName"),
        });
        return;
      }

      setIsSubmitting(true);

      onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(t("pages.category.error.adding"), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("pages.category.addVehicleCategory")}</DialogTitle>
          <DialogDescription>
            {t("pages.category.createNewCategory")}
          </DialogDescription>
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
                    <Input placeholder={t("pages.category.placeholderName")} {...field} />
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
                    <Input type="number" placeholder={t("pages.category.placeholderWeight")} {...field} />
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
                    <Input type="number" placeholder={t("pages.category.placeholderVolume")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("pages.category.adding") : t("pages.category.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
