"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Eye } from 'lucide-react';
import MonacoEditorWrapper from "@/components/monacoEditorWrapper";
import { useTranslation } from "react-i18next";

interface UpdatedLanguage {
  language_name: string;
  iso_code: string;
  active: boolean;
  file: File | null;
}

interface JsonField {
  key: string;
  value: string;
  path: string;
}

export default function UpdateLanguage() {
  const { t } = useTranslation();
  const mockInitialData = {
    language_name: "Français",
    iso_code: "fr",
    active: true,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.languages.breadcrumb.home"), t("pages.languages.breadcrumb.languages"), t("pages.languages.breadcrumb.updateLanguage")],
        links: ["/office/dashboard", "/office/general/languages"],
      })
    );
  }, [dispatch, t]);

  const [updatedLanguage, setUpdatedLanguage] = useState<UpdatedLanguage>({
    language_name: mockInitialData.language_name,
    iso_code: mockInitialData.iso_code,
    active: mockInitialData.active,
    file: null,
  });

  const [jsonContent, setJsonContent] = useState<string>(
    JSON.stringify(
      {
        greeting: "Bonjour",
        farewell: "Au revoir",
        question: "Comment ça va ?",
        test : {
          test2 : "test3",
          test4 : "test5",
          test6 : "test7",
          test8 : {
            test9 : "test10",
            test11 : "test12",
            test13 : "test14",
          }
        }
      },
      null,
      2
    )
  );

  const [updateMethod, setUpdateMethod] = useState<"editor" | "file" | "visual">("editor");
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [jsonFields, setJsonFields] = useState<JsonField[]>([]);

  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      const fields: JsonField[] = [];

      const extractFields = (obj: any, parentPath = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = parentPath ? `${parentPath}.${key}` : key;

          if (typeof value === "object" && value !== null) {
            fields.push({
              key,
              value: JSON.stringify(value),
              path: currentPath,
            });
            extractFields(value, currentPath);
          } else {
            fields.push({
              key,
              value: String(value),
              path: currentPath,
            });
          }
        });
      };

      extractFields(parsedJson);
      setJsonFields(fields);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [jsonContent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUpdatedLanguage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setUpdatedLanguage((prev) => ({
      ...prev,
      file,
    }));

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            const json = JSON.parse(event.target.result as string);
            setJsonContent(JSON.stringify(json, null, 2));
            setUpdateMethod("editor");
            setIsJsonValid(true);
          } catch (error) {
            console.error("Invalid JSON file", error);
            setIsJsonValid(false);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJsonChange = (value: string | undefined) => {
    setJsonContent(value || "");
  };

  const handleJsonValidationChange = (isValid: boolean) => {
    setIsJsonValid(isValid);
  };

  const handleFieldChange = (path: string, newValue: string) => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      const pathParts = path.split(".");

      let current = parsedJson;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = newValue;

      const updatedJson = JSON.stringify(parsedJson, null, 2);
      setJsonContent(updatedJson);
      setIsJsonValid(true);
    } catch (error) {
      console.error("Error updating JSON:", error);
      setIsJsonValid(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (updateMethod === "editor" || updateMethod === "visual") {
        downloadJsonFile();
      } else {
        console.log("File to upload:", updatedLanguage.file);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la langue", error);
    }
  };

  const downloadJsonFile = () => {
    try {
      const parsedJson = JSON.parse(jsonContent);

      const blob = new Blob([JSON.stringify(parsedJson, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${updatedLanguage.iso_code}_translations.json`;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Invalid JSON format", error);
      alert(t("pages.languages.updateLanguage.form.invalidJsonAlert"));
    }
  };

  const renderJsonField = (field: JsonField) => {
    return (
      <div key={field.path} className="mb-4 flex items-start gap-2">
        <div className="flex-1">
          <Label htmlFor={field.path}>{field.key}</Label>
          <Input
            id={field.path}
            value={field.value}
            onChange={(e) => handleFieldChange(field.path, e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t("pages.languages.updateLanguage.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("pages.languages.updateLanguage.form.languageName")}</Label>
                <Input
                  name="language_name"
                  placeholder={t("pages.languages.updateLanguage.form.languageName")}
                  value={updatedLanguage.language_name}
                  onChange={handleChange}
                  id="name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="iso_code">{t("pages.languages.updateLanguage.form.isoCode")}</Label>
                <Input
                  name="iso_code"
                  placeholder={t("pages.languages.updateLanguage.form.isoCode")}
                  value={updatedLanguage.iso_code}
                  onChange={handleChange}
                  id="iso_code"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="active"
                name="active"
                checked={updatedLanguage.active}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: {
                      name: "active",
                      checked: checked as boolean,
                      type: "checkbox",
                      value: "",
                    },
                  } as ChangeEvent<HTMLInputElement>)
                }
              />
              <Label htmlFor="active">{t("pages.languages.updateLanguage.form.active")}</Label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="editor" onValueChange={(value) => setUpdateMethod(value as "editor" | "file" | "visual")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">
              <Download className="h-4 w-4 mr-2" />
              {t("pages.languages.updateLanguage.tabs.editor")}
            </TabsTrigger>
            <TabsTrigger value="file">
              <Upload className="h-4 w-4 mr-2" />
              {t("pages.languages.updateLanguage.tabs.file")}
            </TabsTrigger>
            <TabsTrigger value="visual">
              <Eye className="h-4 w-4 mr-2" />
              {t("pages.languages.updateLanguage.tabs.visual")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-2 block">{t("pages.languages.updateLanguage.form.jsonEditor")}</Label>
                <div className="h-[400px] border rounded-md overflow-hidden">
                  <MonacoEditorWrapper
                    value={jsonContent}
                    onChange={handleJsonChange}
                    onValidationChange={handleJsonValidationChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <Label htmlFor="file" className="mb-2 block">
                  {t("pages.languages.updateLanguage.form.uploadFile")}
                </Label>
                <Input
                  accept=".json"
                  type="file"
                  onChange={handleFileChange}
                  id="file"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("pages.languages.updateLanguage.form.uploadDescription")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mt-6">
                  {jsonFields.map((field) => renderJsonField(field))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" disabled={!isJsonValid && (updateMethod === "editor" || updateMethod === "visual")}>
            {updateMethod === "file" ? t("pages.languages.updateLanguage.form.updateButton") : t("pages.languages.updateLanguage.form.submitButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
