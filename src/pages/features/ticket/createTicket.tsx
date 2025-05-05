import { TicketService } from "@/api/ticket.api";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAdmins } from "@/api/admin.api";
import { useTranslation } from "react-i18next";
import { RootState } from "@/redux/store";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import { Input } from "@/components/ui/input";

interface AdminData {
  admin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
}

export const ticketSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, { message: t("pages.ticket.details.erreur") }),
    status: z.enum(["open", "closed"]).refine((value) => value === "open" || value === "closed", {
      message: t("pages.ticket.details.select.status.erreur"),
    }),
    priority: z.enum(["High", "Medium", "Low"]).refine((value) => value === "High" || value === "Medium" || value === "Low", {
      message: t("pages.ticket.details.select.priorite.erreur"),
    }),
    state: z.enum(["Pending", "Progress", "Done"]).refine((value) => value === "Pending" || value === "Progress" || value === "Done", {
      message: t("pages.ticket.details.select.etat.erreur"),
    }),
    admin_id_get: z.string().min(1, { message: t("pages.ticket.details.select.assigne.erreur") }),
    admin_id_attribute: z.optional(z.string().refine((value) => value === undefined || value.length > 0, ),)
  });

export type TicketFormValues = z.infer<ReturnType<typeof ticketSchema>>;

export default function CreateTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [description, setDescription] = useState<string>(t("pages.ticket.premierEcrit"));

  const admin = useSelector((state: RootState) => state.admin.admin);

  const canEdit = !!admin && admin.roles.includes("TICKET");

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema(t)),
    defaultValues: {
      title: "",
      status: "open",
      priority: "Medium",
      state: "Pending",
      admin_id_get: "",
      admin_id_attribute: admin?.admin_id || "",
    },
  });

  useEffect(() => {
    getAllAdmins().then((data) => {
      if (data) {
        setAdmins(data);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.ticket.breadcrumb.accueil"), t("pages.ticket.breadcrumb.ticket"), t("pages.ticket.breadcrumb.creer")],
        links: ["/office/dashboard", "/office/ticket"],
      })
    );
  }, [dispatch]);

  const getAdminInitials = (admin: AdminData) => {
    const firstNameInitial = admin.first_name.charAt(0).toUpperCase();
    const lastNameInitial = admin.last_name.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };

  const handleSubmit = async (values: TicketFormValues) => {
    const parsedDescription = description;

    const newTicket = {
      ...values,
      description: parsedDescription,
    };

    try {
      await TicketService.createTicket(newTicket);
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
    }

    navigate("/office/ticket");
  };

  const priorityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["open", "closed"];
  const stateOptions = ["Pending", "Progress", "Done"];

  return (
<div className="">
  <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card className="mx-auto md:max-w-2xl">
        <CardHeader>
          <CardTitle>Nouveau ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">

          <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">{t("pages.ticket.titreLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          {...field}
                          className="w-full p-2 border rounded"
                          disabled={!canEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status">{t("pages.ticket.details.select.status.label")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="status" className="h-auto ps-2 w-full">
                        <SelectValue
                          placeholder={t("pages.ticket.details.select.status.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`pages.ticket.details.select.status.${status.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priorite">{t("pages.ticket.details.select.priorite.label")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="priorite" className="h-auto ps-2 w-full">
                        <SelectValue
                          placeholder={t("pages.ticket.details.select.priorite.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {t(`pages.ticket.details.select.priorite.${priority.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="etat">{t("pages.ticket.details.select.etat.label")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="etat" className="h-auto ps-2 w-full">
                        <SelectValue
                          placeholder={t("pages.ticket.details.select.etat.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state}>
                            {t(`pages.ticket.details.select.etat.${state.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admin_id_get"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="admin_id_get">
                    {t("pages.ticket.details.select.assigne.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canEdit}
                    >
                      <SelectTrigger id="admin_id_get" className="h-auto ps-2 w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                        <SelectValue
                          placeholder={t("pages.ticket.details.select.assigne.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {admins.length > 0 ? (
                          admins.map((admin) => (
                            <SelectItem
                              key={admin.admin_id}
                              value={admin.admin_id}
                            >
                              <span className="flex items-center gap-2">
                                {admin.photo ? (
                                  <img
                                    className="rounded-full w-8 h-8 object-cover"
                                    src={admin.photo}
                                    alt={admin.first_name}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "";
                                    }}
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-secondary">
                                    {getAdminInitials(admin)}
                                  </div>
                                )}
                                <span>
                                  <span className="block font-medium text-left">
                                    {admin.first_name} {admin.last_name}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {admin.email}
                                  </span>
                                </span>
                              </span>
                            </SelectItem>
                          ))
                        ) : (
                          <></>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:w-3/4 lg:w-1/2 mx-auto mt-4">
        <MinimalTiptapEditor
          value={description}
          onChange={(value) => setDescription(value?.toString() || "")}
          className="w-full"
          editorContentClassName="p-5"
          output="html"
          placeholder={t("pages.ticket.details.wysiwyg.placeholder")}
          autofocus
          editable={canEdit}
          editorClassName="focus:outline-none"
          bucket="email"
        />
      </div>

      {canEdit && (
        <div className="flex justify-end mt-4">
          <Button type="submit">
            {t("pages.ticket.details.bouton.sauvegarder")}
          </Button>
        </div>
      )}
    </form>
  </Form>
</div>

  );
}
