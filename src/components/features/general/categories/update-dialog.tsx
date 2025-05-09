"use client"

import { useEffect } from "react"
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
import { VehicleCategory } from "@/pages/features/general/categories/vehicles-category"

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  max_weight: z.coerce.number().positive({ message: "Le poids doit être un nombre positif" }),
  max_dimension: z.coerce.number().positive({ message: "Le volume doit être un nombre positif" }),
})

type FormValues = z.infer<typeof formSchema>

interface UpdateVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: VehicleCategory
  onSubmit: (values: VehicleCategory) => void
}

export function UpdateVehicleDialog({ open, onOpenChange, vehicle, onSubmit }: UpdateVehicleDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: vehicle.id,
      name: vehicle.name,
      max_weight: vehicle.max_weight,
      max_dimension: vehicle.max_dimension,
    },
  })

  useEffect(() => {
    form.reset({
      id: vehicle.id,
      name: vehicle.name,
      max_weight: vehicle.max_weight,
      max_dimension: vehicle.max_dimension,
    })
  }, [vehicle, form])

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie de véhicule</DialogTitle>
          <DialogDescription>Modifiez les informations de la catégorie de véhicule.</DialogDescription>
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
                  <FormLabel>Poids maximum (kg)</FormLabel>
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
                  <FormLabel>Volume maximum (m³)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
