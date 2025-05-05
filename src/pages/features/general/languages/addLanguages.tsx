"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Eye, Search, ChevronDown, ChevronUp } from "lucide-react";
import MonacoEditorWrapper from "@/components/monacoEditorWrapper";
import { addLanguage } from "@/api/languages.api";
import { Accordion } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

interface NewLanguage {
  name: string;
  iso_code: string;
  active: boolean;
  file: File | null;
}

interface JsonField {
  key: string;
  value: string;
  path: string;
}

export default function AddLanguage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [newLanguage, setNewLanguage] = useState<NewLanguage>({
    name: "",
    iso_code: "",
    active: false,
    file: null,
  });

  function clearJsonValues(obj: any): any {
    if (typeof obj === "object" && obj !== null) {
      const cleared: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        cleared[key] = typeof obj[key] === "object" && obj[key] !== null
          ? clearJsonValues(obj[key])
          : "";
      }
      return cleared;
    }
    return "";
  }

  const defaultJson = {
    greeting: "Bonjour",
    farewell: "Au revoir",
    question: "Comment ça va ?",
    test: {
      test2: "test3",
      test4: "test5",
      test6: "test7",
      test8: {
        test9: "test10",
        test11: "test12",
        test13: "test14",
      }
    }
  };

  const emptyJson = clearJsonValues(defaultJson);

  const [jsonContent, setJsonContent] = useState<string>(
    JSON.stringify(emptyJson, null, 2)
  );

  const [updateMethod, setUpdateMethod] = useState<"editor" | "file" | "visual">("editor");
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [jsonFields, setJsonFields] = useState<JsonField[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.languages.breadcrumb.home"), t("pages.languages.breadcrumb.languages"), t("pages.languages.breadcrumb.addLanguage")],
        links: ["/office/dashboard", "/office/general/languages"],
      })
    );
  }, [dispatch, t]);

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
    setNewLanguage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewLanguage((prev) => ({
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFields = jsonFields.filter(
    (field) =>
      field.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (path: string) => {
    setExpandedSections((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]));
  };

  const isSection = (field: JsonField) => {
    try {
      const value = JSON.parse(field.value);
      return typeof value === "object" && value !== null;
    } catch {
      return false;
    }
  };

  const getNestedFields = (parentPath: string) => {
    return jsonFields.filter(
      (field) =>
        field.path.startsWith(parentPath + ".") && field.path.split(".").length === parentPath.split(".").length + 1
    );
  };

  const getRootFields = () => {
    return jsonFields.filter((field) => !field.path.includes("."));
  };

  const renderJsonField = (field: JsonField) => {
    if (isSection(field)) {
      const isExpanded = expandedSections.includes(field.path);
      const nestedFields = getNestedFields(field.path);

      return (
        <div key={field.path} className="mb-4">
          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
            <div className="font-medium">{field.key}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleSection(field.path)}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="pl-4 mt-2 border-l-2 border-muted">
              {nestedFields.map((nestedField) => renderJsonField(nestedField))}
            </div>
          )}
        </div>
      );
    } else {
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
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (updateMethod === "editor" || updateMethod === "visual") {
        const blob = new Blob([jsonContent], { type: "application/json" });
        const file = new File([blob], `${newLanguage.iso_code}_translations.json`, { type: "application/json" });
        await addLanguage(
          {
            language_name: newLanguage.name,
            iso_code: newLanguage.iso_code,
            active: newLanguage.active,
          },
          file
        );
      } else if (newLanguage.file) {
        await addLanguage(
          {
            language_name: newLanguage.name,
            iso_code: newLanguage.iso_code,
            active: newLanguage.active,
          },
          newLanguage.file
        );
      } else {
        console.error("Erreur: Aucun fichier de langue sélectionné");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la langue", error);
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
                  name="name"
                  placeholder={t("pages.languages.addLanguage.form.languageName")}
                  value={newLanguage.name}
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
                      checked: checked as boolean,
                      type: "checkbox",
                      value: "",
                    },
                  } as ChangeEvent<HTMLInputElement>)
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
                <Input accept=".json" type="file" onChange={handleFileChange} id="file" className="mt-1" />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("pages.languages.addLanguage.form.uploadDescription")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Label htmlFor="search" className="mb-2 block">
                    {t("pages.languages.addLanguage.form.search")}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder={t("pages.languages.addLanguage.form.searchPlaceholder")}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Accordion type="multiple" className="w-full">
                    {searchQuery ? (
                      filteredFields.map((field) => renderJsonField(field))
                    ) : (
                      getRootFields().map((field) => renderJsonField(field))
                    )}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            size="lg"
            disabled={!isJsonValid && (updateMethod === "editor" || updateMethod === "visual")}
          >
            {updateMethod === "file" ? t("pages.languages.addLanguage.form.importButton") : t("pages.languages.addLanguage.form.submitButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
