"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Provider, type ProviderDetails } from "@/api/provider.api"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import {
  Building2,
  FileText,
  MapPin,
  Phone,
  Mail,
  Clock,
  Euro,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Download,
} from "lucide-react"
import { ServiceValidationDialog } from "@/components/features/provider/service-dialog"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"

export default function ProviderProfilePage() {
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin)
  const isProviderManager = admin?.roles.includes("PROVIDER")

  const dispatch = useDispatch()

    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Prestataires", "Détails du prestataire"],
          links: ["/office/dashboard" , "/office/profile/providers"],
        })
      );
    }, [dispatch]);

  useEffect(() => {
    if (!id) {
      navigate("/office/profile/providers")
    } else {
      const fetchProviderDetails = async () => {
        try {
          setLoading(true)
          const data = await Provider.getProviderDetails(id)
          setProviderDetails(data)
        } catch (error) {
          console.error("Error fetching provider details:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchProviderDetails()
    }
  }, [id, navigate])

  const handleDocumentClick = (url: string) => {
    if (url.endsWith(".pdf")) {
      window.open(url, "_blank")
    } else if (url.match(/\.(jpg|jpeg|png|gif)$/)) {
      window.open(url, "_blank")
    } else {
      const link = document.createElement("a")
      link.href = url
      link.download = url.split("/").pop() || "download"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAccept = async () => {
    if (id) {
      await Provider.updateProviderStatus(id, true)
      const data = await Provider.getProviderDetails(id)
      setProviderDetails(data)
      setIsDialogOpen(false)
    } else {
      console.error("Provider ID is undefined")
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
    return <ProviderProfileSkeleton />
  }

  if (!providerDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Prestataire non trouvé</h2>
        <p className="text-muted-foreground mb-6">Les détails du prestataire n'ont pas pu être chargés.</p>
        <Button onClick={() => navigate("/office/profile/providers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/office/profile/providers")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={providerDetails.info.profile_picture || ""} alt={providerDetails.info.name} />
              <AvatarFallback>{getInitials(providerDetails.info.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{providerDetails.info.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {providerDetails.info.validated === true && (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Validé
                  </Badge>
                )}
                {providerDetails.info.validated === false && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <XCircle className="mr-1 h-3 w-3" />
                    Refusé
                  </Badge>
                )}
                {providerDetails.info.validated === null && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    En attente
                  </Badge>
                )}
                <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                  <Building2 className="mr-1 h-3 w-3" />
                  {providerDetails.info.company}
                </Badge>
              </div>
            </div>
          </div>

          {(providerDetails.info.validated === null || providerDetails.info.validated === false) &&
            isProviderManager && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Valider le profil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Validation du profil</DialogTitle>
                    <DialogDescription>Voulez-vous accepter ce prestataire ?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                  <p>{providerDetails.info.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Adresse</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>
                      {providerDetails.info.address}, {providerDetails.info.postal_code} {providerDetails.info.city},{" "}
                      {providerDetails.info.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{providerDetails.info.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{providerDetails.info.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">SIRET</h3>
                  <p>{providerDetails.info.siret}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents
              </CardTitle>
              <CardDescription>Documents fournis par le prestataire</CardDescription>
            </CardHeader>
            <CardContent>
              {providerDetails.documents && providerDetails.documents.length > 0 ? (
                <div className="grid gap-3">
                  {providerDetails.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleDocumentClick(doc.url)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Soumis le {new Date(doc.submission_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        {doc.url.endsWith(".pdf") || doc.url.match(/\.(jpg|jpeg|png|gif)$/) ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">Aucun document disponible</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Contrats
              </CardTitle>
              <CardDescription>Contrats associés au prestataire</CardDescription>
            </CardHeader>
            <CardContent>
              {providerDetails.contracts && providerDetails.contracts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {providerDetails.contracts.map((contract) => (
                    <Card key={contract.id} className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{contract.company_name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4 pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">SIRET:</span> {contract.siret}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Adresse:</span> {contract.address}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">Aucun contrat disponible</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          {providerDetails.services && providerDetails.services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {providerDetails.services.map((service) => (
                <Card key={service.id} className="overflow-hidden flex flex-col h-full">
                  {service.images && service.images.length > 0 ? (
                    <div className="relative h-48 w-full">
                      <img
                        src={service.images[0].url || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">Aucune image</p>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ScrollArea className="h-24">
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-0">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{service.price} €</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.duration_minute} min</span>
                      </div>
                    </div>

                    {service.validated ? (
                      <div className="flex items-center gap-2 text-green-600 w-full">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Validé</span>
                      </div>
                    ) : (
                      isProviderManager && (
                        <ServiceValidationDialog
                          service={service}
                          onValidate={async (serviceId, newPrice) => {
                            try {
                              if (id) {
                                await Provider.validateService(id, serviceId, newPrice);
                                const updatedData = await Provider.getProviderDetails(id);
                                setProviderDetails(updatedData);
                              } else {
                                console.error("Provider ID is undefined");
                              }
                            } catch (error) {
                              console.error("Error validating service:", error);
                            }
                          }}
                        />
                      )
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-2">Aucun service disponible</p>
                <p className="text-sm text-muted-foreground">Ce prestataire n'a pas encore ajouté de services.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProviderProfileSkeleton() {
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

      <div className="w-full mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
