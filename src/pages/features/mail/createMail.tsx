import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { useTranslation } from "react-i18next";
import { RootState } from "@/redux/store";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { MailService } from "@/api/mail.api";
import { MultiSelect } from "@/components/ui/multiselect";
import DateTimePicker from "@/components/ui/calendar-time";

export const mailSchema = (t: (key: string) => string) =>
  z.object({
    subject: z.string().min(1, { message: t("pages.mail.createTicket.error.required") }),
    profiles: z.array(z.enum(["provider", "deliveryman", "merchant", "client", "admin"])).optional(),
    day: z.string().optional(),
    hour: z.string().optional(),
  });

export type MailFormValues = z.infer<ReturnType<typeof mailSchema>>;

export default function CreateTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [description, setDescription] = useState<string>(t("pages.mail.createTicket.firstWrite"));

  const admin = useSelector((state: RootState) => state.admin.admin);
  const canEdit = !!admin && admin.roles.includes("MAIL");

  const form = useForm<MailFormValues>({
    resolver: zodResolver(mailSchema(t)),
    defaultValues: {
      subject: "",
      profiles: [],
    },
  });

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.mail.createTicket.breadcrumb.home"),
          t("pages.mail.createTicket.breadcrumb.mails"),
          t("pages.mail.createTicket.breadcrumb.create"),
        ],
        links: ["/office/dashboard", "/office/mail"],
      })
    );
  }, [dispatch, t]);

  const handleSubmit = async (values: MailFormValues) => {
    const parsedDescription = description;
    if (selectedDate) {
      values.day = selectedDate.toISOString().split('T')[0];
    }
    if (selectedTime) {
      values.hour = selectedTime;
    } else {
      if (values.day) {
        values.hour = "12:00";
      }
    }

    const newMail = {
      ...values,
      htmlContent: parsedDescription,
    };

    try {
      if (values.day) {
        await MailService.createScheduleMail({
          ...newMail,
          day: values.day || "",
          hour: values.hour || "",
          profiles: values.profiles || null,
        });
      } else {
        if (!values.profiles || values.profiles.length === profileList.length) {
          await MailService.sendMailtoEveryone(newMail);
        } else {
          await MailService.sendMail({
            ...newMail,
            profiles: values.profiles ? values.profiles : [],
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
    }

    navigate("/office/mail");
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>("12:00");

  const handleDateTimeChange = (date: Date | null, time: string | null) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const profileList = [
    { value: "merchant", label: t("pages.mail.table.profileLabels.merchant") },
    { value: "provider", label: t("pages.mail.table.profileLabels.provider") },
    { value: "client", label: t("pages.mail.table.profileLabels.client") },
    { value: "deliveryman", label: t("pages.mail.table.profileLabels.deliveryman") },
    { value: "admin", label: t("pages.mail.table.profileLabels.admin") },
  ];

  const [selectedProfile, setSelectedProfile] = useState<{ label: string; value: string }[]>([]);

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="mx-auto md:max-w-2xl">
            <CardHeader>
              <CardTitle>{t("pages.mail.createTicket.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title">{t("pages.mail.createTicket.form.subject")}</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          {...field}
                          className="w-full p-2 border rounded"
                          disabled={!canEdit}
                          placeholder={t("pages.mail.createTicket.form.placeholder.subject")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profiles"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="profiles">{t("pages.mail.createTicket.form.profiles")}</FormLabel>
                      <MultiSelect
                        options={profileList}
                        onValueChange={(value) => {
                          setSelectedProfile(value.map(v => profileList.find(p => p.value === v)!));
                          form.setValue('profiles', value as ["provider" | "deliveryman" | "merchant" | "client" | "admin"]);
                        }}
                        defaultValue={selectedProfile.map(profile => profile.value)}
                        placeholder={t("pages.mail.createTicket.form.placeholder.profiles")}
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                        id="profiles"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="day"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("pages.mail.createTicket.form.dateTime")}</FormLabel>
                      <DateTimePicker onDateTimeChange={handleDateTimeChange} />
                      <FormDescription>{t("pages.mail.createTicket.form.description")}</FormDescription>
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
              placeholder={t("pages.mail.createTicket.editor.placeholder")}
              autofocus
              editable={canEdit}
              editorClassName="focus:outline-none"
              bucket="email"
            />
          </div>

          {canEdit && (
            <div className="flex justify-end mt-4">
              <Button type="submit">
                {t("pages.mail.createTicket.form.button.save")}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
