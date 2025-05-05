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
import { useTranslation } from "react-i18next";

interface CreateAdminProps {
  onAdminCreated: () => void;
}

export default function CreateAdmin({ onAdminCreated }: CreateAdminProps) {
  const { t } = useTranslation();
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
    { label: t("pages.admin.create.roles_options.finance"), value: "FINANCE" },
    { label: t("pages.admin.create.roles_options.provider"), value: "PROVIDER" },
    { label: t("pages.admin.create.roles_options.delivery"), value: "DELIVERY" },
    { label: t("pages.admin.create.roles_options.merchant"), value: "MERCHANT" },
    { label: t("pages.admin.create.roles_options.ticket"), value: "TICKET" },
    { label: t("pages.admin.create.roles_options.mail"), value: "MAIL" },
  ];

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>{t("pages.admin.list.actions.add_user")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pages.admin.list.actions.create_admin_title")}</DialogTitle>
            <DialogDescription>
              {t("pages.admin.list.actions.create_admin_description")}
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
                      <FormLabel>{t("pages.admin.list.actions.last_name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("pages.admin.list.actions.last_name_placeholder")} {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.admin.list.actions.last_name_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.admin.list.actions.first_name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("pages.admin.list.actions.first_name_placeholder")} {...field} />
                      </FormControl>
                      <FormDescription>{t("pages.admin.list.actions.first_name_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pages.admin.list.actions.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("pages.admin.list.actions.email_placeholder")} {...field} type="email" />
                      </FormControl>
                      <FormDescription>{t("pages.admin.list.actions.email_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t("pages.admin.list.actions.roles")}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={rolesList}
                          onValueChange={setSelectedRoles}
                          defaultValue={selectedRoles}
                          placeholder={t("pages.admin.list.actions.select_roles")}
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                        />
                      </FormControl>
                      <FormDescription>{t("pages.admin.list.actions.roles_description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("pages.admin.list.actions.create_admin")}</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
