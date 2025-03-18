import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { enableA2F, validateA2F, disableA2F } from "@/api/auth.api";
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const admin = useSelector((state: RootState) => state.admin.admin);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { t } = useTranslation();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisableMode, setIsDisableMode] = useState<boolean>(false);

  useEffect(() => {
    dispatch({ type: 'UPDATE_ADMIN', payload: { ...admin, otp: !isDisableMode } });
  }, [isDisableMode, dispatch, admin]);

  const handleActivateOTP = async () => {
    if (!admin?.admin_id) {
      console.error("Admin ID is not available");
      return;
    }

    try {
      setIsLoading(true);
      const data = await enableA2F(admin.admin_id);
      setQrCode(data.qrCode);
      setIsDisableMode(false);
    } catch (error) {
      console.error("Failed to enable A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (!admin?.admin_id) {
      console.error("Admin ID is not available");
      return;
    }

    try {
      setIsLoading(true);
      await validateA2F(admin.admin_id, otp);
      setQrCode(null);
      setOtp("");
      setIsDisableMode(false);
    } catch (error) {
      console.error("Failed to validate A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableOTP = async () => {
    if (!admin?.admin_id) {
      console.error("Admin ID is not available");
      return;
    }

    setIsDisableMode(true);
    setQrCode("dummy_value");
  };

  const handleConfirmDisableOTP = async () => {
    if (!admin?.admin_id) {
      console.error("Admin ID is not available");
      return;
    }
    try {
      setIsLoading(true);
      await disableA2F(admin.admin_id, otp);
      console.log("OTP disabled successfully");
      setQrCode(null);
      setOtp("");
      setIsDisableMode(true);
    } catch (error) {
      console.error("Failed to disable A2F:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQrCode(null);
    setOtp("");
    setIsDisableMode(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t('pages.parametres.titre')}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/settings">{t('pages.parametres.breadcrumb.accueil')}</Link>
          <Link to="/office/settings/a2f" className="font-semibold text-primary">{t('pages.parametres.breadcrumb.parametres')}</Link>
        </nav>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.parametres.a2f.titre')}</CardTitle>
              <CardDescription>{t('pages.parametres.a2f.sousTitre')}</CardDescription>
            </CardHeader>
            <CardContent>
              {admin?.otp ? (
                <div>
                  <p>{t('pages.parametres.a2f.otpActivated')}</p>
                  <Button onClick={handleDisableOTP} disabled={isLoading}>
                    {isLoading ? t('pages.parametres.chargement') : t('pages.parametres.a2f.disableOtp')}
                  </Button>
                </div>
              ) : (
                <div>
                  <p>{t('pages.parametres.a2f.otpNotActivated')}</p>
                  <Button onClick={handleActivateOTP} disabled={isLoading}>
                    {isLoading ? t('pages.parametres.chargement') : t('pages.parametres.a2f.activateOtp')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {qrCode && (
        <>
          {!isMobile ? (
            <Dialog open={!!qrCode} onOpenChange={(open) => { if (!open) handleClose(); }}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{isDisableMode ? t('pages.parametres.a2f.disableOtp') : t('pages.parametres.a2f.activateOtp')}</DialogTitle>
                  <DialogDescription>
                    {isDisableMode
                      ? t('pages.parametres.a2f.enterOtp')
                      : t('pages.parametres.a2f.scanQrCode')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                  {!isDisableMode && <img src={qrCode} alt={t('pages.parametres.imageAlt')} className="mb-4" />}
                  <InputOTP maxLength={6} value={otp} onChange={(newValue: string) => setOtp(newValue)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button onClick={isDisableMode ? handleConfirmDisableOTP : handleValidateOTP} disabled={isLoading}>
                  {isLoading ? t('pages.parametres.chargement') : t('pages.connexion.valider')}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleClose}>
                    {t('pages.parametres.annuler')}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={!!qrCode} onClose={handleClose}>
              <DrawerContent className="sm:max-w-[425px]">
                <DrawerHeader>
                  <DrawerTitle>{isDisableMode ? t('pages.parametres.a2f.disableOtp') : t('pages.parametres.a2f.activateOtp')}</DrawerTitle>
                  <DrawerDescription>
                    {isDisableMode
                      ? t('pages.parametres.a2f.enterOtp')
                      : t('pages.parametres.a2f.scanQrCode')}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col items-center space-y-4 mb-4">
                  {!isDisableMode && <img src={qrCode} alt={t('pages.parametres.imageAlt')} className="mb-4" />}
                  <InputOTP maxLength={6} value={otp} onChange={(newValue: string) => setOtp(newValue)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button onClick={isDisableMode ? handleConfirmDisableOTP : handleValidateOTP} disabled={isLoading}>
                  {isLoading ? t('pages.parametres.chargement') : t('pages.connexion.valider')}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={handleClose}>
                    {t('pages.parametres.annuler')}
                  </Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
    </div>
  );
};

export default AdminSettings;
