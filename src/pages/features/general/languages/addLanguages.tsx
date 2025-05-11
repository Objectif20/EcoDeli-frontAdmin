"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Eye } from "lucide-react";
import MonacoEditorWrapper from "@/components/monacoEditorWrapper";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LanguageApi } from "@/api/languages.api";

interface NewLanguage {
  language_name: string;
  iso_code: string;
  active: boolean;
  file: File | null;
}

interface JsonField {
  key: string;
  path: string;
  isObject?: boolean;
}

export default function AddLanguage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.languages.breadcrumb.home"),
          t("pages.languages.breadcrumb.languages"),
          t("pages.languages.breadcrumb.addLanguage"),
        ],
        links: ["/office/dashboard", "/office/general/languages"],
      })
    );
  }, [dispatch, t]);

  const [newLanguage, setNewLanguage] = useState<NewLanguage>({
    language_name: "",
    iso_code: "",
    active: true,
    file: null,
  });

  const [jsonContent, setJsonContent] = useState<string>("");

  useEffect(() => {
    const fetchDefaultLanguage = async () => {
      try {
        const data = await LanguageApi.getFrenchLanguage();
  
        const emptyValues = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(emptyValues);
          } else if (obj && typeof obj === 'object') {
            return Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [key, emptyValues(value)])
            );
          } else {
            return "";
          }
        };
  
        const emptiedData = emptyValues(data);
        setJsonContent(JSON.stringify(emptiedData, null, 2));
      } catch (error) {
        console.error("Erreur lors de la récupération de la langue par défaut", error);
      }
    };
  
    fetchDefaultLanguage();
  }, []);

  const [updateMethod, setUpdateMethod] = useState<"editor" | "file" | "visual">("editor");
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [jsonFields, setJsonFields] = useState<JsonField[]>([]);

  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonContent);
      const fields: JsonField[] = [];

      const extractFields = (obj: any, parentPath: string = "") => {
        Object.keys(obj).forEach((key) => {
          const currentPath = parentPath ? `${parentPath}.${key}` : key;

          if (typeof obj[key] === "object" && obj[key] !== null) {
            fields.push({ key, path: currentPath, isObject: true });
            extractFields(obj[key], currentPath);
          } else {
            fields.push({ key, path: currentPath, isObject: false });
          }
        });
      };

      extractFields(parsedJson);
      setJsonFields(fields);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [jsonContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewLanguage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewLanguage((prev) => ({ ...prev, file }));

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          try {
            const json = JSON.parse(event.target.result);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { language_name, iso_code, active, file } = newLanguage;
      const newLanguageData: NewLanguage = { language_name, iso_code, active, file };

      let jsonFile: File | null = null;

      if (updateMethod === "editor" || updateMethod === "visual") {
        const blob = new Blob([jsonContent], { type: "application/json" });
        jsonFile = new File([blob], `${iso_code}_translations.json`, { type: "application/json" });
      } else if (updateMethod === "file" && file) {
        jsonFile = file;
      }

      if (!jsonFile) {
        alert(t("pages.languages.addLanguage.form.invalidJsonAlert"));
        return;
      }

      const response = await LanguageApi.addLanguage(newLanguageData, jsonFile);
      console.log("Language added successfully", response);
      navigate("/office/general/languages");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la langue", error);
      alert(t("pages.languages.addLanguage.form.addError"));
    }
  };

  const renderJsonField = (field: JsonField, allFields: JsonField[]) => {
    if (field.isObject) {
      const childFields = allFields.filter(
        (f) =>
          f.path.startsWith(field.path + ".") &&
          f.path.split(".").length === field.path.split(".").length + 1
      );

      return (
        <AccordionItem value={field.path} key={field.path}>
          <AccordionTrigger>{field.key}</AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple">
              {childFields.map((child) => renderJsonField(child, allFields))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      );
    } else {
      return (
        <div key={field.path} className="mb-4 flex items-start gap-2">
          <div className="flex-1 mx-2">
            <Label htmlFor={field.path}>{field.key}</Label>
            <Input
              id={field.path}
              onChange={(e) => handleFieldChange(field.path, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t("pages.languages.addLanguage.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("pages.languages.addLanguage.form.languageName")}</Label>
                <Input
                  name="language_name"
                  placeholder={t("pages.languages.addLanguage.form.languageName")}
                  value={newLanguage.language_name}
                  onChange={handleChange}
                  id="name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="iso_code">{t("pages.languages.addLanguage.form.isoCode")}</Label>
                <Input
                  name="iso_code"
                  placeholder={t("pages.languages.addLanguage.form.isoCode")}
                  value={newLanguage.iso_code}
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
                checked={newLanguage.active}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: {
                      name: "active",
                      checked: checked,
                      type: "checkbox",
                      value: "",
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <Label htmlFor="active">{t("pages.languages.addLanguage.form.active")}</Label>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="editor" onValueChange={(value) => setUpdateMethod(value as "editor" | "file" | "visual")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">
              <Download className="h-4 w-4 mr-2" />
              {t("pages.languages.addLanguage.tabs.editor")}
            </TabsTrigger>
            <TabsTrigger value="file">
              <Upload className="h-4 w-4 mr-2" />
              {t("pages.languages.addLanguage.tabs.file")}
            </TabsTrigger>
            <TabsTrigger value="visual">
              <Eye className="h-4 w-4 mr-2" />
              {t("pages.languages.addLanguage.tabs.visual")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-2 block">{t("pages.languages.addLanguage.form.jsonEditor")}</Label>
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
                  {t("pages.languages.addLanguage.form.uploadFile")}
                </Label>
                <Input
                  accept=".json"
                  type="file"
                  onChange={handleFileChange}
                  id="file"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("pages.languages.addLanguage.form.uploadDescription")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <Accordion type="multiple">
                  {jsonFields
                    .filter((field) => field.path.split(".").length === 1)
                    .map((field) => renderJsonField(field, jsonFields))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" disabled={!isJsonValid && (updateMethod === "editor" || updateMethod === "visual")}>
            {updateMethod === "file"
              ? t("pages.languages.addLanguage.form.addButton")
              : t("pages.languages.addLanguage.form.submitButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
