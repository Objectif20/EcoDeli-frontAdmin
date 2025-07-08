"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: boolean;
  error?: string;
}

export function PasswordInput({
  label = "Mot de passe",
  showLabel = true,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          id={props.id || "password"}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-foreground" />
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
