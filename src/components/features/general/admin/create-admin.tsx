import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { createAdmin } from "@/api/admin.api";

interface CreateAdminProps {
  onAdminCreated: () => void;
}

export default function CreateAdmin({ onAdminCreated }: CreateAdminProps) {
  const createAdminSchema = z.object({
    last_name: z.string(),
    first_name: z.string(),
    email: z.string(),
    roles: z.array(z.string()),
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createAdminSchema>>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      email: "",
      roles: [],
    },
  });

  async function onSubmit(data: z.infer<typeof createAdminSchema>) {
    data.roles = selectedRoles;
    console.log(data);
    await createAdmin(data)();
    form.reset(); 
    setSelectedRoles([]);
    setIsDialogOpen(false);
    onAdminCreated(); 
  }

  const rolesList = [
    { label: "Finance", value: "FINANCE" },
    { label: "Prestataire", value: "PROVIDER" },
    { label: "Transporteur", value: "DELIVERY" },
    { label: "Commerçant", value: "MERCHANT" },
    { label: "Ticket", value: "TICKET" },
    { label: "Mail", value: "MAIL" },
  ];

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Ajouter un utilisateur</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Création d'un compte administrateur</DialogTitle>
            <DialogDescription>
              Créer un profil administrateur
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de famille" {...field} />
                      </FormControl>
                      <FormDescription>Saisissez le nom</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormDescription>Saisissez le prénom</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type="email" />
                      </FormControl>
                      <FormDescription>Saisissez le mail</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <FormLabel>Rôles</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={rolesList}
                          onValueChange={setSelectedRoles}
                          defaultValue={selectedRoles}
                          placeholder="Choisissez un ou plusieurs rôles"
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                      <FormDescription>Sélectionnez les rôles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Créer l'administrateur</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
