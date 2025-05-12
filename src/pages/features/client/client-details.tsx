"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  ArrowLeft,
  Package,
  AlertTriangle,
  CreditCard,
  Truck,
  ClipboardList,
  ExternalLink,
} from "lucide-react"
import { ClientApi, ClientDetails } from "@/api/client.api"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"

export default function ClientProfilePage() {
  const { t } = useTranslation()
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.client-details.breadcrumb.home"), t("pages.client-details.breadcrumb.clients"), t("pages.client-details.breadcrumb.client-details")],
        links: ["/office/dashboard" , "/office/profile/providers"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true)
        if (id) {
          const details = await ClientApi.getClientDetails(id)
          setClientDetails(details)
        }
      } catch (error) {
        console.error("Error fetching client details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientDetails()
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
    return <ClientProfileSkeleton />
  }

  if (!clientDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <ArrowLeft className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("pages.client-details.client-not-found")}</h2>
        <p className="text-muted-foreground mb-6">{t("pages.client-details.client-details-not-loaded")}</p>
        <Button onClick={() => navigate("/office/profile/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("pages.client-details.back-to-list")}
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Button variant="ghost" onClick={() => navigate("/office/profile/clients")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("pages.client-details.back-to-list")}
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={clientDetails.info.profile_picture || ""}
                  alt={`${clientDetails.info.first_name} ${clientDetails.info.last_name}`}
                />
                <AvatarFallback className="text-xl">
                  {getInitials(`${clientDetails.info.first_name} ${clientDetails.info.last_name}`)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold">{`${clientDetails.info.first_name} ${clientDetails.info.last_name}`}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`${getSubscriptionBadgeColor(clientDetails.info.nomAbonnement)} font-medium`}
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      {clientDetails.info.nomAbonnement}
                    </Badge>

                    {clientDetails.info.profilTransporteur && (
                      <Badge variant="outline" className="bg-teal-100 text-teal-800 hover:bg-teal-100 font-medium">
                        <Truck className="w-3.5 h-3.5 mr-1" />
                        {t("pages.client-details.delivery-status")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{clientDetails.info.email}</span>
                  </div>
                </div>

                {clientDetails.info.profilTransporteur && clientDetails.info.idTransporteur && (
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => navigate(`/office/profile/deliverymen/${clientDetails.info.idTransporteur}`)}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    {t("pages.client-details.view-delivery-profile")}
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("pages.client-details.delivery-requests")}</p>
                  <h3 className="text-3xl font-bold mt-2">{clientDetails.info.nbDemandeDeLivraison}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.client-details.total-requests")}</p>
                </div>
                <div className=" p-3 rounded-full">
                  <Package className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("pages.client-details.services")}</p>
                  <h3 className="text-3xl font-bold mt-2">{clientDetails.info.nombreDePrestations}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.client-details.services-completed")}</p>
                </div>
                <div className=" p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("pages.client-details.reports")}</p>
                  <h3 className="text-3xl font-bold mt-2">{clientDetails.info.nbSignalements}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("pages.client-details.total-received")}</p>
                </div>
                <div className=" p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 " />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {t("pages.client-details.detailed-information")}
            </CardTitle>
            <CardDescription>{t("pages.client-details.detailed-information")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">{t("pages.client-details.subscription")}</h3>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{clientDetails.info.nomAbonnement}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">{t("pages.client-details.contact")}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{clientDetails.info.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">{t("pages.client-details.delivery-status")}</h3>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">
                    {clientDetails.info.profilTransporteur
                      ? t("pages.client-details.active", { id: clientDetails.info.idTransporteur })
                      : t("pages.client-details.inactive")}
                  </p>
                </div>
                {clientDetails.info.profilTransporteur && clientDetails.info.idTransporteur && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate(`/office/profile/deliverymen/${clientDetails.info.idTransporteur}`)}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    {t("pages.client-details.view-delivery-profile")}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClientProfileSkeleton() {
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
