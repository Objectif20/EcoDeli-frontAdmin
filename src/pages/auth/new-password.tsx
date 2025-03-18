import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.svg";
import auth1 from "@/assets/illustrations/auth1.svg";
import otpSvg from "@/assets/illustrations/otp.svg";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { newPassword, newPasswordA2F } from "@/api/auth.api";

export default function NewPasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [is2faRequired, setIs2faRequired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { secretCode } = useParams<{ secretCode: string }>();

  useEffect(() => {
    if (!secretCode) {
      navigate("/error");
      return;
    }
  }, [secretCode, navigate]);

  const validatePassword = (password: string) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasUpperCase && hasSpecialChar && hasNumber;
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await newPassword(password, secretCode as string);

      if ((res as any).two_factor_required) {
        setIs2faRequired(true);
      } else {
        navigate("/auth/login");
      }
    } catch (err) {
      setError("Erreur lors de la modification du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordA2F = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await newPasswordA2F(password, otp, secretCode as string);

      setIs2faRequired(false);
      navigate("/auth/login");
    } catch (err: any) {
      setError(`Erreur lors de la validation 2FA: ${err.message}`);
      setOtp("");
      console.error("Erreur lors de la validation 2FA:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src={logo} alt="Logo" className="h-16 w-16" />
            EcoDeli
          </Link>
        </div>

        {!is2faRequired ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form className="flex flex-col gap-6" onSubmit={handleNewPassword}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Veuillez entrer votre nouveau mot de passe.
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Changement en cours..." : "Changer le mot de passe"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form className="flex flex-col gap-6" onSubmit={handleNewPasswordA2F}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Validation 2FA</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Veuillez entrer le code 2FA envoyé à votre adresse email.
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Code 2FA</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                  </div>
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Validation en cours..." : "Valider"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="relative hidden lg:block bg-primary">
        <img
          src={is2faRequired ? otpSvg : auth1}
          alt="Illustration"
          className="absolute inset-0 object-cover w-3/5 h-auto mx-auto my-auto"
        />
      </div>
    </div>
  );
}
