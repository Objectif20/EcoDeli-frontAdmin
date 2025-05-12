import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { useTranslation } from 'react-i18next';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddVehicleDialog } from "@/components/features/general/categories/add-dialog";
import { UpdateVehicleDialog } from "@/components/features/general/categories/update-dialog";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { VehicleCategory, GeneralApi } from "@/api/general.api";

export default function VehicleCategoriesPage() {
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fetchVehicleCategories = async () => {
    try {
      const categories = await GeneralApi.getVehiclesCategories();
      setVehicleCategories(categories.data);
    } catch (error) {
      console.error(t("pages.category.error.loading"), error);
    }
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.category.accueil"), t("pages.category.title")],
        links: ["/office/dashboard"],
      })
    );

    fetchVehicleCategories();
  }, [dispatch, t]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory | null>(null);

  const handleAddVehicle = async (vehicle: Omit<VehicleCategory, "id">) => {
    try {
      const newVehicle = await GeneralApi.addVehicleCategory(vehicle);
      setVehicleCategories([...vehicleCategories, newVehicle]);
      setAddDialogOpen(false);
      fetchVehicleCategories();
    } catch (error) {
      console.error(t("pages.category.error.adding"), error);
    }
  };

  const handleUpdateVehicle = async (updatedVehicle: VehicleCategory) => {
    try {
      const vehicle = await GeneralApi.updateVehicleCategory(updatedVehicle);
      setVehicleCategories(
        vehicleCategories.map((v) => (v.id === vehicle.id ? vehicle : v))
      );
      setUpdateDialogOpen(false);
      setSelectedVehicle(null);
      fetchVehicleCategories();
    } catch (error) {
      console.error(t("pages.category.error.updating"), error);
    }
  };

  const openUpdateDialog = (vehicle: VehicleCategory) => {
    setSelectedVehicle(vehicle);
    setUpdateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("pages.category.title")}</CardTitle>
            <CardDescription>{t("pages.category.description")}</CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("pages.category.addCategory")}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {vehicleCategories.slice(0, 3).map((vehicle) => (
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
                      <span className="text-muted-foreground">{t("pages.category.maxWeight")}</span>
                      <span className="font-medium">{vehicle.max_weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("pages.category.maxVolume")}</span>
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
                  <TableHead>{t("pages.category.name")}</TableHead>
                  <TableHead>{t("pages.category.maxWeightKg")}</TableHead>
                  <TableHead>{t("pages.category.maxVolumeM3")}</TableHead>
                  <TableHead className="text-right">{t("pages.category.actions")}</TableHead>
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
                        {t("pages.category.edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddVehicleDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddVehicle}
        existingCategories={vehicleCategories}
      />

      {selectedVehicle && (
        <UpdateVehicleDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          vehicle={selectedVehicle}
          onSubmit={handleUpdateVehicle}
          existingCategories={vehicleCategories}
        />
      )}
    </div>
  );
}
