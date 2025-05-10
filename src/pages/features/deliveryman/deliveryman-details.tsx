"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, AlertCircle, ArrowLeft, CheckCircle2, XCircle, User, Car, MapPin, FileText } from "lucide-react"

interface DeliverymanDetails {
  info: {
    profile_picture: string | null
    first_name: string
    last_name: string
    validated: boolean | null
    description: string
    email: string
    phone: string
    document?: string
  }
}

interface Vehicle {
  id: string
  name: string
  matricule: string
  co2: number
  allow: boolean
  image: string
  justification_file: string
}

interface Route {
  id: string
  from: string
  to: string
  permanent: boolean
  coordinates: {
    origin: [number, number]
    destination: [number, number]
  }
  date?: string
  weekday?: string
  tolerate_radius: number
  comeback_today_or_tomorrow: "today" | "tomorrow" | "later"
}

export default function DeliverymanProfilePage() {
  const [deliverymanDetails, setDeliverymanDetails] = useState<DeliverymanDetails | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const { id } = useParams()
  const navigate = useNavigate()

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin)
  const isDeliverymanManager = admin?.roles.includes("DELIVERYMAN")

  // Données fictives pour tester l'interface
  const fakeDeliverymanDetails: DeliverymanDetails = {
    info: {
      profile_picture: "https://via.placeholder.com/150",
      first_name: "John",
      last_name: "Doe",
      validated: null,
      description: "Livreur expérimenté avec 5 ans d'expérience.",
      email: "john.doe@example.com",
      phone: "+33 1 23 45 67 89",
      document: "https://example.com/document.pdf",
    },
  }

  const fakeVehicles: Vehicle[] = [
    {
      id: "v1",
      name: "Peugeot 208",
      matricule: "AB-123-CD",
      co2: 95,
      allow: true,
      image: "https://via.placeholder.com/300",
      justification_file: "https://example.com/justification1.pdf",
    },
    {
      id: "v2",
      name: "Vélo électrique",
      matricule: "N/A",
      co2: 0,
      allow: true,
      image: "https://via.placeholder.com/300",
      justification_file: "https://example.com/justification2.pdf",
    },
  ]

  const fakeRoutes: Route[] = [
    {
      id: "r1",
      from: "Paris",
      to: "Lyon",
      permanent: true,
      coordinates: {
        origin: [48.8566, 2.3522],
        destination: [45.764, 4.8357],
      },
      weekday: "1",
      tolerate_radius: 5,
      comeback_today_or_tomorrow: "tomorrow",
    },
    {
      id: "r2",
      from: "Marseille",
      to: "Nice",
      permanent: false,
      coordinates: {
        origin: [43.2965, 5.3698],
        destination: [43.7102, 7.262],
      },
      date: "2025-06-15",
      tolerate_radius: 3,
      comeback_today_or_tomorrow: "today",
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Simuler des appels API
        setDeliverymanDetails(fakeDeliverymanDetails)
        setVehicles(fakeVehicles)
        setRoutes(fakeRoutes)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAccept = async () => {
    if (id) {
      setDeliverymanDetails({
        ...deliverymanDetails!,
        info: { ...deliverymanDetails!.info, validated: true },
      })
      setIsDialogOpen(false)
      navigate("/office/profile/deliverymen")
    } else {
      console.error("Deliveryman ID is undefined")
    }
  }

  const handleReject = async () => {
    if (id) {
      setDeliverymanDetails({
        ...deliverymanDetails!,
        info: { ...deliverymanDetails!.info, validated: false },
      })
      setIsDialogOpen(false)
      navigate("/office/profile/deliverymen")
    } else {
      console.error("Deliveryman ID is undefined")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return <DeliverymanProfileSkeleton />
  }

  if (!deliverymanDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Livreur non trouvé</h2>
        <p className="text-muted-foreground mb-6">Les détails du livreur n'ont pas pu être chargés.</p>
        <Button onClick={() => navigate("/office/profile/deliverymen")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/office/profile/deliverymen")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
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
                    Validé
                  </Badge>
                )}
                {deliverymanDetails.info.validated === false && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <XCircle className="mr-1 h-3 w-3" />
                    Refusé
                  </Badge>
                )}
                {deliverymanDetails.info.validated === null && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    En attente
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {deliverymanDetails.info.validated === null && isDeliverymanManager && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Valider le profil</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Validation du profil</DialogTitle>
                  <DialogDescription>Voulez-vous accepter ou refuser ce livreur ?</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleReject}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Refuser
                  </Button>
                  <Button variant="default" onClick={handleAccept}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accepter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Véhicules
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Trajets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                  <p>{deliverymanDetails.info.description}</p>
                </div>

                {deliverymanDetails.info.document && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Document</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(deliverymanDetails.info.document, "_blank")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le document
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact</h3>
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
                Véhicules du livreur
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Aucun véhicule enregistré</div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Trajets du livreur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoutesList routes={routes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
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
  )
}

interface VehicleCardProps {
  vehicle: Vehicle
}

function VehicleCard({ vehicle }: VehicleCardProps) {
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
          {vehicle.allow ? "Autorisé" : "Non autorisé"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Immatriculation:</span>
            <span className="font-medium">{vehicle.matricule}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Émission CO2:</span>
            <span className="font-medium">{vehicle.co2} g/km</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => window.open(vehicle.justification_file, "_blank")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Voir le justificatif
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

interface RoutesListProps {
  routes: Route[]
}

function RoutesList({ routes }: RoutesListProps) {
  const { activeRoutes, pastRoutes } = routes.reduce(
    (acc, route) => {
      if (route.permanent) {
        acc.activeRoutes.push(route)
      } else if (route.date) {
        const routeDate = new Date(route.date)
        if (routeDate < new Date()) {
          acc.pastRoutes.push(route)
        } else {
          acc.activeRoutes.push(route)
        }
      }
      return acc
    },
    { activeRoutes: [] as Route[], pastRoutes: [] as Route[] },
  )

  if (routes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Aucun trajet enregistré</div>
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-3">Trajets actifs et permanents</h3>
        {activeRoutes.length === 0 ? (
          <Card className="bg-muted">
            <CardContent className="p-4 text-center text-muted-foreground">Aucun trajet actif ou permanent</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </section>

      {pastRoutes.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Trajets passés</h3>
          <div className="space-y-4">
            {pastRoutes.map((route) => (
              <RouteCard key={route.id} route={route} disabled />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

interface RouteCardProps {
  route: Route
  disabled?: boolean
}

function RouteCard({ route, disabled = false }: RouteCardProps) {
  const weekdayName = route.weekday !== undefined ? daysOfWeek[Number.parseInt(route.weekday, 10)] : ""

  return (
    <Card className={`${disabled ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="font-medium">
              <span>{route.from}</span>
              <span className="mx-2">→</span>
              <span>{route.to}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {route.permanent ? (
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                Permanent - {weekdayName}
              </Badge>
            ) : route.date ? (
              <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                {new Date(route.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Rayon de tolérance: <span className="font-medium text-foreground">{route.tolerate_radius} km</span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">
              Retour:{" "}
              <span className="font-medium text-foreground">
                {route.comeback_today_or_tomorrow === "today"
                  ? "Le même jour"
                  : route.comeback_today_or_tomorrow === "tomorrow"
                    ? "Le lendemain"
                    : "Plus tard"}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
