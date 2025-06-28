"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Upload, Eye } from "lucide-react"
import MonacoEditorWrapper from "@/components/monacoEditorWrapper"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LanguageApi } from "@/api/languages.api"

interface UpdatedLanguage {
  language_name: string
  iso_code: string
  active: boolean
  file: File | null
}

interface JsonField {
  key: string
  value: string
  path: string
  isObject?: boolean
}

export default function UpdateLanguage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  const [updatedLanguage, setUpdatedLanguage] = useState<UpdatedLanguage>({
    language_name: "",
    iso_code: "",
    active: false,
    file: null,
  })

  const [jsonContent, setJsonContent] = useState<string>("")
  const [updateMethod, setUpdateMethod] = useState<"editor" | "file" | "visual">("editor")
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true)
  const [jsonFields, setJsonFields] = useState<JsonField[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!id) {
      console.error("ID is not defined")
      navigate("/office/general/languages")
    }
  }, [id, navigate])

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t("pages.languages.breadcrumb.home"),
          t("pages.languages.breadcrumb.languages"),
          t("pages.languages.breadcrumb.updateLanguage"),
        ],
        links: ["/office/dashboard", "/office/general/languages"],
      }),
    )
  }, [dispatch, t])

  useEffect(() => {
    const fetchLanguageData = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const languageData = await LanguageApi.getLanguageById(id)
        setUpdatedLanguage({
          language_name: languageData.language_name,
          iso_code: languageData.iso_code,
          active: languageData.active,
          file: null,
        })

        // Récupérer le contenu JSON par défaut
        const defaultLanguageData = await LanguageApi.getDefaultLanguage(id)
        setJsonContent(JSON.stringify(defaultLanguageData, null, 2))
      } catch (error) {
        console.error("Erreur lors de la récupération des données de la langue", error)
        // En cas d'erreur, rediriger vers la liste des langues
        navigate("/office/general/languages")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLanguageData()
  }, [id, navigate])

  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonContent)
      const fields: JsonField[] = []
      const extractFields = (obj: any, parentPath = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = parentPath ? `${parentPath}.${key}` : key
          if (typeof value === "object" && value !== null) {
            fields.push({ key, value: "", path: currentPath, isObject: true })
            extractFields(value, currentPath)
          } else {
            fields.push({ key, value: String(value), path: currentPath, isObject: false })
          }
        })
      }
      extractFields(parsedJson)
      setJsonFields(fields)
    } catch (error) {
      console.error("Error parsing JSON:", error)
    }
  }, [jsonContent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setUpdatedLanguage((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setUpdatedLanguage((prev) => ({ ...prev, file }))

    if (file && file.type === "application/json") {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          try {
            const json = JSON.parse(event.target.result)
            setJsonContent(JSON.stringify(json, null, 2))
            setUpdateMethod("editor")
            setIsJsonValid(true)
          } catch (error) {
            console.error("Invalid JSON file", error)
            setIsJsonValid(false)
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const handleJsonChange = (value: string | undefined) => {
    setJsonContent(value || "")
  }

  const handleJsonValidationChange = (isValid: boolean) => {
    setIsJsonValid(isValid)
  }

  const handleFieldChange = (path: string, newValue: string) => {
    try {
      const parsedJson = JSON.parse(jsonContent)
      const pathParts = path.split(".")
      let current = parsedJson
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]]
      }
      current[pathParts[pathParts.length - 1]] = newValue
      const updatedJson = JSON.stringify(parsedJson, null, 2)
      setJsonContent(updatedJson)
      setIsJsonValid(true)
    } catch (error) {
      console.error("Error updating JSON:", error)
      setIsJsonValid(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { language_name, iso_code, active, file } = updatedLanguage
      const updateData = { language_name, iso_code, active }

      let jsonFile: File | null = null

      if (updateMethod === "editor" || updateMethod === "visual") {
        const blob = new Blob([jsonContent], { type: "application/json" })
        jsonFile = new File([blob], `${iso_code}_translations.json`, { type: "application/json" })
      } else if (updateMethod === "file" && file) {
        jsonFile = file
      }

      if (!jsonFile) {
        alert(t("pages.languages.updateLanguage.form.invalidJsonAlert"))
        return
      }

      if (!id) throw new Error("ID is not defined")

      await LanguageApi.updateLanguage(id, updateData, jsonFile)
      console.log("Language updated successfully")

      // Rediriger vers la page des langues après la mise à jour réussie
      navigate("/office/general/languages")
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la langue", error)
      alert(t("pages.languages.updateLanguage.form.updateError"))
    }
  }

  const renderJsonField = (field: JsonField, allFields: JsonField[]) => {
    if (field.isObject) {
      const childFields = allFields.filter(
        (f) => f.path.startsWith(field.path + ".") && f.path.split(".").length === field.path.split(".").length + 1,
      )

      return (
        <AccordionItem value={field.path} key={field.path}>
          <AccordionTrigger>{field.key}</AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple">{childFields.map((child) => renderJsonField(child, allFields))}</Accordion>
          </AccordionContent>
        </AccordionItem>
      )
    } else {
      return (
        <div key={field.path} className="mb-4 flex items-start gap-2">
          <div className="flex-1 mx-2">
            <Label htmlFor={field.path}>{field.key}</Label>
            <Input
              id={field.path}
              value={field.value}
              onChange={(e) => handleFieldChange(field.path, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    )
  }

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
                      checked: checked,
                      type: "checkbox",
                      value: "",
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
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
                <Input accept=".json" type="file" onChange={handleFileChange} id="file" className="mt-1" />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("pages.languages.updateLanguage.form.uploadDescription")}
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
          <Button
            type="submit"
            size="lg"
            disabled={!isJsonValid && (updateMethod === "editor" || updateMethod === "visual")}
          >
            {updateMethod === "file"
              ? t("pages.languages.updateLanguage.form.updateButton")
              : t("pages.languages.updateLanguage.form.submitButton")}
          </Button>
        </div>
      </form>
    </div>
  )
}
