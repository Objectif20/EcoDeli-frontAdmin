'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, ArrowLeft, Building, FileText, Globe } from 'lucide-react'

interface MerchantDetails {
  info: {
    profile_picture: string | null;
    first_name: string;
    last_name: string;
    description: string;
    email: string;
    phone: string;
    nbDemandeDeLivraison: number;
    nomAbonnement: string;
    nbSignalements: number;
    entreprise: string;
    siret: string;
    pays: string;
  };
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
  };

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        setLoading(true)
        setMerchantDetails(fakeMerchantDetails)
      } catch (error) {
        console.error('Error fetching merchant details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchantDetails()
  }, [id])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
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
        <Button onClick={() => navigate('/office/profile/merchants')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/office/profile/merchants')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={merchantDetails.info.profile_picture || ''} alt={`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`} />
              <AvatarFallback>{getInitials(`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{`${merchantDetails.info.first_name} ${merchantDetails.info.last_name}`}</h1>
            </div>
          </div>
        </div>
      </div>

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
              <p>{merchantDetails.info.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nombre de demandes de livraison</h3>
              <p>{merchantDetails.info.nbDemandeDeLivraison}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nombre de signalements</h3>
              <p>{merchantDetails.info.nbSignalements}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Entreprise</h3>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p>{merchantDetails.info.entreprise}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact</h3>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{merchantDetails.info.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{merchantDetails.info.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Abonnement</h3>
              <p>{merchantDetails.info.nomAbonnement}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">SIRET</h3>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p>{merchantDetails.info.siret}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Pays</h3>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <p>{merchantDetails.info.pays}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MerchantProfileSkeleton() {
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
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
