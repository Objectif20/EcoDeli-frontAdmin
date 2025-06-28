import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/redux/store";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, AlertCircle, ArrowLeft, CheckCircle2, XCircle, User, Car, FileText } from "lucide-react";
import { DeliverymanApi, DeliverymanDetails, Vehicle } from "@/api/deliveryman.api";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";

export default function DeliverymanProfilePage() {
  const [deliverymanDetails, setDeliverymanDetails] = useState<DeliverymanDetails | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);
  const isDeliverymanManager = admin?.roles.includes("DELIVERY");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.deliveryman-details.breadcrumb.home"),
          t("pages.deliveryman-details.breadcrumb.deliverymen"),
          t("pages.deliveryman-details.breadcrumb.deliveryman-details"),
        ],
        links: ["/office/dashboard", "/office/profile/deliverymen"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const details = await DeliverymanApi.getDeliverymanDetails(id);
          setDeliverymanDetails(details);
          setVehicles(details.vehicles);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAccept = async () => {
    if (id) {
      setDeliverymanDetails({
        ...deliverymanDetails!,
        info: { ...deliverymanDetails!.info, validated: true },
      });
      await DeliverymanApi.validateDeliveryman(id);
      const details = await DeliverymanApi.getDeliverymanDetails(id);
      setDeliverymanDetails(details);
      setVehicles(details.vehicles);
      setIsDialogOpen(false);
    } else {
      console.error("Deliveryman ID is undefined");
    }
  };

  const handleValidateVehicle = async (vehicleId: string) => {
    console.log(`Vehicle with ID ${vehicleId} has been validated.`);
    if (id) {
      await DeliverymanApi.validateVehicle(vehicleId, id);
      const details = await DeliverymanApi.getDeliverymanDetails(id);
      setDeliverymanDetails(details);
      setVehicles(details.vehicles);
    } else {
      console.error("Deliveryman ID is undefined");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <DeliverymanProfileSkeleton />;
  }

  if (!deliverymanDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("pages.deliveryman-details.not-found.title")}</h2>
        <p className="text-muted-foreground mb-6">{t("pages.deliveryman-details.not-found.description")}</p>
        <Button onClick={() => navigate("/office/profile/deliverymen")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("pages.deliveryman-details.back-to-list")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/office/profile/deliverymen")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("pages.deliveryman-details.back-to-list")}
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage
                src={deliverymanDetails.info.profile_picture || ""}
                alt={`${deliverymanDetails.info.first_name} ${deliverymanDetails.info.last_name}`}
              />
              <AvatarFallback>
                {getInitials(`${deliverymanDetails.info.first_name} ${deliverymanDetails.info.last_name}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{`${deliverymanDetails.info.first_name} ${deliverymanDetails.info.last_name}`}</h1>
              <div className="flex items-center gap-2 mt-1">
                {deliverymanDetails.info.validated === true && (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {t("pages.deliveryman-details.status.validated")}
                  </Badge>
                )}
                {deliverymanDetails.info.validated === false && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <XCircle className="mr-1 h-3 w-3" />
                    {t("pages.deliveryman-details.status.refused")}
                  </Badge>
                )}
                {deliverymanDetails.info.validated === null && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {t("pages.deliveryman-details.status.pending")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {(deliverymanDetails.info.validated === null || deliverymanDetails.info.validated === false) && isDeliverymanManager && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t("pages.deliveryman-details.validate-profile")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("pages.deliveryman-details.validation.profile-validation")}</DialogTitle>
                  <DialogDescription>{t("pages.deliveryman-details.validation.accept-deliveryman")}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("pages.deliveryman-details.cancel")}
                  </Button>
                  <Button variant="default" onClick={handleAccept}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("pages.deliveryman-details.accept")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("pages.deliveryman-details.profile")}
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            {t("pages.deliveryman-details.vehicles")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {t("pages.deliveryman-details.general-information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {deliverymanDetails.info.description && deliverymanDetails.info.description.trim() !== "" && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("pages.deliveryman-details.description")}</h3>
                    <p>{deliverymanDetails.info.description}</p>
                  </div>
                )}

                {deliverymanDetails.info.document && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("pages.deliveryman-details.document")}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(deliverymanDetails.info.document, "_blank")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {t("pages.deliveryman-details.view-document")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">{t("pages.deliveryman-details.contact")}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{deliverymanDetails.info.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{deliverymanDetails.info.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                {t("pages.deliveryman-details.deliveryman-vehicles")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t("pages.deliveryman-details.no-vehicles")}</div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} onValidate={handleValidateVehicle} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DeliverymanProfileSkeleton() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-24 mb-4" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Skeleton className="h-12 w-full mb-6" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onValidate: (vehicleId: string) => void;
}

function VehicleCard({ vehicle, onValidate }: VehicleCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} className="w-full h-full object-cover" />
        <Badge
          className={`absolute top-2 right-2 ${
            vehicle.allow
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {vehicle.allow ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
          {vehicle.allow ? t("pages.deliveryman-details.status.validated") : t("pages.deliveryman-details.status.refused")}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pages.deliveryman-details.registration")}:</span>
            <span className="font-medium">{vehicle.matricule}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pages.deliveryman-details.co2-emission")}:</span>
            <span className="font-medium">{vehicle.co2} g/km</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => window.open(vehicle.justification_file, "_blank")}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("pages.deliveryman-details.view-justification")}
          </Button>
          {!vehicle.allow && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-2">
                  {t("pages.deliveryman-details.validate-vehicle")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("pages.deliveryman-details.validate-vehicle")}</DialogTitle>
                  <DialogDescription>
                    {t("pages.deliveryman-details.validation.validate-vehicle-confirmation")}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("pages.deliveryman-details.cancel")}
                  </Button>
                  <Button variant="default" onClick={() => {
                    onValidate(vehicle.id);
                    setIsDialogOpen(false);
                  }}>
                    {t("pages.deliveryman-details.yes")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
