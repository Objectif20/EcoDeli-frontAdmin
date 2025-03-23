import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Provider, ProviderDetails } from '@/api/provider.api';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

export default function ProviderProfilePage() {
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);

  const isProviderManager = admin?.roles.includes('PROVIDER');

  useEffect(() => {
    if (!id) {
      navigate('/office/profile/providers');
    } else {
      const fetchProviderDetails = async () => {
        try {
          const data = await Provider.getProviderDetails(id);
          setProviderDetails(data);
        } catch (error) {
          console.error('Error fetching provider details:', error);
        }
      };

      fetchProviderDetails();
    }
  }, [id, navigate]);

  if (!providerDetails) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  const handleDocumentClick = (url: string) => {
    if (url.endsWith('.pdf')) {
      window.open(url, '_blank');
    } else if (url.match(/\.(jpg|jpeg|png|gif)$/)) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAccept = async () => {
    if (id) {
      await Provider.updateProviderStatus(id, true);
      setIsDialogOpen(false);
      navigate('/office/profile/providers');
    } else {
      console.error('Provider ID is undefined');
    }
  };

  const handleReject = async () => {
    if (id) {
        await Provider.updateProviderStatus(id, false);
        setIsDialogOpen(false);
        navigate('/office/profile/providers');
      } else {
        console.error('Provider ID is undefined');
      }
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="px-4 py-2 font-semibold">Profil</TabsTrigger>
          <TabsTrigger value="services" className="px-4 py-2 font-semibold">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
  <div className="space-y-6">
    <div className="flex justify-between items-start space-x-6">
      <div className="flex items-center space-x-4">
        <img
          src={providerDetails.info.profile_picture || ''}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold">{providerDetails.info.name}</h3>
          <p className="text-lg mt-2">{providerDetails.info.description}</p>
          <p className="text-sm mt-4">
            {providerDetails.info.company}, {providerDetails.info.address}, {providerDetails.info.postal_code} {providerDetails.info.city}, {providerDetails.info.country}
          </p>
          <p className="text-sm">
            {providerDetails.info.email} • {providerDetails.info.phone} • SIRET: {providerDetails.info.siret}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {providerDetails.info.validated === true && (
          <div className="text-green-600 font-semibold">Compte validé.</div>
        )}
        {providerDetails.info.validated === false && (
          <div className="text-red-600 font-semibold">Compte refusé.</div>
        )}
        {providerDetails.info.validated === null && isProviderManager && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Valider le profil</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-xl font-semibold'>Que faire de ce profil ?</DialogTitle>
                <DialogDescription>
                  Voulez-vous accepter ou refuser ce prestataire ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={handleAccept}>Accepter</Button>
                <Button onClick={handleReject}>Refuser</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>

    <div className="mt-6">
      <h3 className="text-2xl font-semibold">Documents</h3>
      {providerDetails.documents && providerDetails.documents.length > 0 ? (
        <ul className="space-y-2">
          {providerDetails.documents.map((doc) => (
            <li
              key={doc.id}
              onClick={() => handleDocumentClick(doc.url)}
              className="cursor-pointer hover:underline"
            >
              {doc.name} ({new Date(doc.submission_date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun document disponible.</p>
      )}
    </div>

    <div className="mt-6">
      <h3 className="text-2xl font-semibold">Contrats</h3>
      {providerDetails.contracts && providerDetails.contracts.length > 0 ? (
        <ul className="space-y-2">
          {providerDetails.contracts.map((contract) => (
            <li key={contract.id} className="border p-4 rounded-lg shadow-md">
              <div><strong>Entreprise:</strong> {contract.company_name}</div>
              <div><strong>SIRET:</strong> {contract.siret}</div>
              <div><strong>Adresse:</strong> {contract.address}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun contrat disponible.</p>
      )}
    </div>
  </div>
</TabsContent>


        <TabsContent value="services">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providerDetails.services && providerDetails.services.length > 0 ? (
                providerDetails.services.map((service) => (
                  <Card key={service.id} className="border rounded-lg shadow-md p-4 flex flex-row items-start">
                    {service.images && service.images.length > 0 && (
                      <img
                        src={service.images[0].url}
                        alt={service.name}
                        className="w-24 h-24 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between mt-4">
                        <span className="text-lg font-semibold">Prix: {service.price} €</span>
                        <span className="text-sm">Durée: {service.duration_minute} min</span>
                      </CardFooter>
                    </div>
                  </Card>
                ))
              ) : (
                <p>Aucun service disponible.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
