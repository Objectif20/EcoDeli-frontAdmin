import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Euro } from "lucide-react";

export function ServiceValidationDialog({
    service,
    onValidate,
  }: {
    service: { id: string; price: number; name: string; validated: boolean }
    onValidate: (serviceId: string, newPrice: number) => void
  }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newPrice, setNewPrice] = useState(service.price.toString())
  
    const handleValidateService = () => {
      onValidate(service.id, Number.parseFloat(newPrice))
      setIsDialogOpen(false)
    }
  
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default">
            Valider le service
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Valider le service</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider ce service "{service.name}" ? Il sera disponible partout sur EcoDeli.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="col-span-4 text-sm">
                Vous pouvez modifier le prix si vous estimez qu'il correspond mieux à la valeur du service :
              </label>
              <div className="relative col-span-4">
                <input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleValidateService}>Confirmer la validation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }