import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateAdminData, newPassword, getAdminData } from "@/api/admin.api";
import { useTranslation } from "react-i18next";
import { logout } from "@/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { ImagePlus } from "lucide-react";
import { TFunction } from "i18next";
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';


export const adminFormSchema = (t: TFunction) =>
  z.object({
    last_name: z
      .string()
      .min(2, { message: t("pages.parametres.nomTailleMin") })
      .max(255, { message: t("pages.parametres.nomTailleMax") }),
    first_name: z
      .string()
      .min(2, { message: t("pages.parametres.prenomTailleMin") })
      .max(255, { message: t("pages.parametres.prenomTailleMax") }),
    email: z.string().email({ message: t("pages.parametres.emailFormat") }),
  });

export type AdminFormValues = z.infer<ReturnType<typeof adminFormSchema>>;

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const admin = useSelector((state: RootState) => state.admin.admin);
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema(t)),
    defaultValues: {
      last_name: admin?.last_name || "",
      first_name: admin?.first_name || "",
      email: admin?.email || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(getAdminData());
    dispatch(setBreadcrumb({
      segments: [t("pages.parametres.breadcrumb.accueil"), t("pages.parametres.breadcrumb.parametres")],
      links: ['/office/dashboard'],
    }));
  }, [dispatch]);

  useEffect(() => {
    if (admin?.photo) {
      setPreviewUrl(admin.photo);
    }
  }, [admin]);

  const onSubmit = async (data: AdminFormValues) => {
    if (!admin?.admin_id) {
      console.error("Admin ID is not available");
      return;
    }

    try {
      setLoading(true);
      await dispatch(updateAdminData(data, admin.admin_id, photo || undefined));
    } catch (error) {
      console.error("Failed to update admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await newPassword()();
    } catch (error) {
      console.error("Failed to reset password:", error);
    }

    dispatch(logout());
    navigate("/auth/login");
  };

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(t("pages.parametres.imageTailleMax"));
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPhoto(file);
    }
  }, [t]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/settings" className="font-semibold text-primary">Général</Link>
          <Link to="/office/settings/a2f">Double authentification</Link>
        </nav>
        <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.parametres.titre')}</CardTitle>
            <CardDescription>{t('pages.parametres.sousTitre')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-32 mb-4 flex items-center justify-center">
              {previewUrl ? (
                <img
                  className="h-32 w-32 object-cover rounded-full"
                  src={previewUrl}
                  alt={t("pages.parametres.imageAlt")}
                />
              ) : (
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span>{t('pages.parametres.imageUpload')}</span>
                </div>
              )}
              <div className="absolute flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                  onClick={handleThumbnailClick}
                  aria-label={previewUrl ? t("pages.parametres.imageAction") : t("pages.parametres.imageUpload")}
                >
                  <ImagePlus />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                aria-label={t("pages.parametres.imageUpload")}
              />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.parametres.champNom')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("pages.parametres.placeholderNom")}
                          {...field}
                          disabled={loading}
                          className="placeholder:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.parametres.champPrenom')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("pages.parametres.placeholderPrenom")}
                          {...field}
                          disabled={loading}
                          className="placeholder:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pages.parametres.champEmail')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("pages.parametres.placeholderEmail")}
                          {...field}
                          disabled={loading}
                          className="placeholder:text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 relative">
                    <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                      {loading ? t("pages.parametres.chargement") : t("pages.parametres.sauvegarder")}
                    </Button>
                    {!isMobile && (
                      <div className="absolute right-0 top-0 md:static md:ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full md:w-auto">{t('pages.parametres.reinitialiser')}</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{t('pages.parametres.reinitialiser')}</DialogTitle>
                              <DialogDescription>
                                {t('pages.parametres.reinitialiserMessage')}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={handleResetPassword}>{t('pages.parametres.valider')}</Button>
                              <Button variant={"ghost"}>{t('pages.parametres.annuler')}</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    {isMobile && (
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="destructive" className="w-full md:w-auto">{t('pages.parametres.reinitialiser')}</Button>
                        </DrawerTrigger>
                        <DrawerContent className="sm:max-w-[425px]">
                          <DrawerHeader>
                            <DrawerTitle>{t('pages.parametres.reinitialiser')}</DrawerTitle>
                            <DrawerDescription>
                              {t('pages.parametres.reinitialiserMessage')}
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <Button onClick={handleResetPassword}>{t('pages.parametres.valider')}</Button>
                            <Button variant={"ghost"}>{t('pages.parametres.annuler')}</Button>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default AdminSettings;
