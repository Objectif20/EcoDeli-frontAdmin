'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

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
import { Mail, Phone, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

// Définir une interface pour les détails du livreur
interface DeliverymanDetails {
  info: {
    profile_picture: string | null;
    first_name: string;
    last_name: string;
    validated: boolean | null;
    description: string;
    email: string;
    phone: string;
  };
}

export default function DeliverymanProfilePage() {
  const [deliverymanDetails, setDeliverymanDetails] = useState<DeliverymanDetails | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin)
  const isDeliverymanManager = admin?.roles.includes('DELIVERYMAN')

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
    },
  };

  useEffect(() => {
    const fetchDeliverymanDetails = async () => {
      try {
        setLoading(true)
        setDeliverymanDetails(fakeDeliverymanDetails)
      } catch (error) {
        console.error('Error fetching deliveryman details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeliverymanDetails()
  }, [id])

  const handleAccept = async () => {
    if (id) {
      setDeliverymanDetails({
        ...deliverymanDetails!,
        info: { ...deliverymanDetails!.info, validated: true },
      });
      setIsDialogOpen(false)
      navigate('/office/profile/deliverymen')
    } else {
      console.error('Deliveryman ID is undefined')
    }
  }

  const handleReject = async () => {
    if (id) {
      setDeliverymanDetails({
        ...deliverymanDetails!,
        info: { ...deliverymanDetails!.info, validated: false },
      });
      setIsDialogOpen(false)
      navigate('/office/profile/deliverymen')
    } else {
      console.error('Deliveryman ID is undefined')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
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
        <Button onClick={() => navigate('/office/profile/deliverymen')}>
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
          onClick={() => navigate('/office/profile/deliverymen')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={deliverymanDetails.info.profile_picture || ''} alt={`${deliverymanDetails.info.first_name} ${deliverymanDetails.info.last_name}`} />
              <AvatarFallback>{getInitials(`${deliverymanDetails.info.first_name} ${deliverymanDetails.info.last_name}`)}</AvatarFallback>
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
                  <DialogDescription>
                    Voulez-vous accepter ou refuser ce livreur ?
                  </DialogDescription>
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

      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
