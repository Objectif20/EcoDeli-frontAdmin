"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddVehicleDialog } from "@/components/features/general/categories/add-dialog"
import { UpdateVehicleDialog } from "@/components/features/general/categories/update-dialog"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"


export type VehicleCategory = {
  id: string
  name: string
  max_weight: number
  max_dimension: number
}

export default function VehicleCategoriesPage() {
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([
    { id: "1", name: "Camionnette", max_weight: 1500, max_dimension: 8 },
    { id: "2", name: "Camion léger", max_weight: 3500, max_dimension: 15 },
    { id: "3", name: "Poids lourd", max_weight: 7500, max_dimension: 30 },
  ])


  const dispatch = useDispatch()

    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Catégories"],
          links: ["/office/dashboard"],
        })
      );
  
    }, [dispatch]);

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory | null>(null)

  const handleAddVehicle = (vehicle: Omit<VehicleCategory, "id">) => {
    const newVehicle = {
      ...vehicle,
      id: Math.random().toString(36).substring(2, 9),
    }
    console.log("Nouvelle catégorie ajoutée:", newVehicle)
    setVehicleCategories([...vehicleCategories, newVehicle])
    setAddDialogOpen(false)
  }

  const handleUpdateVehicle = (updatedVehicle: VehicleCategory) => {
    console.log("Catégorie mise à jour:", updatedVehicle)
    setVehicleCategories(
      vehicleCategories.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle)),
    )
    setUpdateDialogOpen(false)
    setSelectedVehicle(null)
  }

  const openUpdateDialog = (vehicle: VehicleCategory) => {
    setSelectedVehicle(vehicle)
    setUpdateDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Catégories de véhicules</CardTitle>
            <CardDescription>Gérez les différentes catégories de véhicules disponibles.</CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {vehicleCategories.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => openUpdateDialog(vehicle)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Poids max:</span>
                      <span className="font-medium">{vehicle.max_weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume max:</span>
                      <span className="font-medium">{vehicle.max_dimension} m³</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Poids max (kg)</TableHead>
                  <TableHead>Volume max (m³)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleCategories.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.max_weight}</TableCell>
                    <TableCell>{vehicle.max_dimension}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openUpdateDialog(vehicle)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddVehicleDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSubmit={handleAddVehicle} />

      {selectedVehicle && (
        <UpdateVehicleDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          vehicle={selectedVehicle}
          onSubmit={handleUpdateVehicle}
        />
      )}
    </div>
  )
}
