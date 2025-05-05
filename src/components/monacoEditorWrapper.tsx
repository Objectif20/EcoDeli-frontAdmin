"use client";

import Editor, { type Monaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { getLightTheme, getDarkTheme } from "@/lib/monaco-theme";

interface MonacoEditorWrapperProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onValidationChange: (isValid: boolean) => void;
  language?: string;
  height?: string;
  options?: Record<string, any>;
}

type Theme = "dark" | "light" | "system";

export default function MonacoEditorWrapper({
  value,
  onChange,
  onValidationChange,
  language = "json",
  height = "400px",
  options = {},
}: MonacoEditorWrapperProps) {
  const storageKey = "vite-ui-theme";

  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = (localStorage.getItem(storageKey) as Theme) || "system";

      if (savedTheme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      } else {
        setTheme(savedTheme);
      }
    };

    updateTheme();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey) {
        updateTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    setMounted(true);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [storageKey]);

  const handleEditorWillMount = (monaco: Monaco) => {
    try {
      monaco.editor.defineTheme("shadcn-light", getLightTheme());
      monaco.editor.defineTheme("shadcn-dark", getDarkTheme());
    } catch (error) {
      console.error("Error defining Monaco themes:", error);
    }
  };

  const handleValidationChange = (markers: any[]) => {
    const isValid = markers.every((marker) => marker.severity !== 8);
    onValidationChange(isValid);
  };

  if (!mounted) {
    return <div style={{ height }} className="border rounded-md bg-muted" />;
  }

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      onValidate={handleValidationChange}
      theme={theme === "dark" ? "shadcn-dark" : "shadcn-light"}
      beforeMount={handleEditorWillMount}
      options={{
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        ...options,
      }}
    />
  );
}
