"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { VehicleCategory } from "@/api/general.api"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  max_weight: z.coerce.number().positive({ message: "Le poids doit être un nombre positif" }),
  max_dimension: z.coerce.number().positive({ message: "Le volume doit être un nombre positif" }),
})

type FormValues = z.infer<typeof formSchema>

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  existingCategories: VehicleCategory[];
}

export function AddVehicleDialog({ open, onOpenChange, onSubmit, existingCategories }: AddVehicleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          message: "Le nom de la catégorie doit être unique",
        });
        return;
      }

      setIsSubmitting(true);

      onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie de véhicule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie de véhicule</DialogTitle>
          <DialogDescription>
            Créez une nouvelle catégorie de véhicule en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Camionnette, Camion, etc." {...field} />
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
                  <FormLabel>Poids maximum (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
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
                  <FormLabel>Volume maximum (m³)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ajout en cours..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
