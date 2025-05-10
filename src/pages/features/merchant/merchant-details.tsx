"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  ArrowLeft,
  Building,
  FileText,
  Globe,
  Package,
  AlertTriangle,
  CreditCard,
  User,
} from "lucide-react"

interface MerchantDetails {
  info: {
    profile_picture: string | null
    first_name: string
    last_name: string
    description: string
    email: string
    phone: string
    nbDemandeDeLivraison: number
    nomAbonnement: string
    nbSignalements: number
    entreprise: string
    siret: string
    pays: string
  }
}

export default function MerchantProfilePage() {
  const [merchantDetails, setMerchantDetails] = useState<MerchantDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const fakeMerchantDetails: MerchantDetails = {
    info: {
      profile_picture: "https://via.placeholder.com/150",
      first_name: "Alice",
      last_name: "Dupont",
      description: "Commerçant fidèle depuis 3 ans.",
      email: "alice.dupont@example.com",
      phone: "+33 1 23 45 67 89",
      nbDemandeDeLivraison: 15,
      nomAbonnement: "Premium",
      nbSignalements: 1,
      entreprise: "Entreprise XYZ",
      siret: "123 456 789 00012",
      pays: "France",
    },
  }

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        setLoading(true)
        setMerchantDetails(fakeMerchantDetails)
      } catch (error) {
        console.error("Error fetching merchant details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchantDetails()
  }, [id])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getSubscriptionBadgeColor = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case "premium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "pro":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "basic":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (loading) {
    return <MerchantProfileSkeleton />
  }

  if (!merchantDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <ArrowLeft className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Commerçant non trouvé</h2>
        <p className="text-muted-foreground mb-6">Les détails du commerçant n'ont pas pu être chargés.</p>
        <Button onClick={() => navigate("/office/profile/merchants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Button variant="ghost" onClick={() => navigate("/office/profile/merchants")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <div className="grid gap-6">
        <Card >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 ">
                <AvatarImage
                  src={merchantDetails.info.profile_picture || ""}
                  alt={`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`}
                />
                <AvatarFallback className="text-xl">
                  {getInitials(`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold">{`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`}</h1>
                  <Badge
                    variant="outline"
                    className={`${getSubscriptionBadgeColor(merchantDetails.info.nomAbonnement)} font-medium`}
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1" />
                    {merchantDetails.info.nomAbonnement}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{merchantDetails.info.description}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{merchantDetails.info.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{merchantDetails.info.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Livraisons</p>
                  <h3 className="text-3xl font-bold mt-2">{merchantDetails.info.nbDemandeDeLivraison}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Demandes totales</p>
                </div>
                <div className=" p-3 rounded-full">
                  <Package className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Abonnement</p>
                  <h3 className="text-3xl font-bold mt-2">{merchantDetails.info.nomAbonnement}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Formule active</p>
                </div>
                <div className=" p-3 rounded-full">
                  <CreditCard className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signalements</p>
                  <h3 className="text-3xl font-bold mt-2">{merchantDetails.info.nbSignalements}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Total reçus</p>
                </div>
                <div className=" p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Informations professionnelles
            </CardTitle>
            <CardDescription>Détails de l'entreprise et informations légales</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Entreprise</h3>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{merchantDetails.info.entreprise}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">SIRET</h3>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{merchantDetails.info.siret}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Pays</h3>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{merchantDetails.info.pays}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact principal</h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MerchantProfileSkeleton() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Skeleton className="h-10 w-24 mb-6" />

      <div className="grid gap-6">
        <Skeleton className="h-48 w-full rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
