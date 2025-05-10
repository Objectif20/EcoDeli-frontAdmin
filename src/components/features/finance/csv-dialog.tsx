"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { TransactionCategory } from "./column"
import { FinanceApi } from "@/api/finance.api"

interface ExportCSVDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportCSVDialog({ open, onOpenChange }: ExportCSVDialogProps) {
  const [startMonth, setStartMonth] = useState<string>("")
  const [startYear, setStartYear] = useState<string>("")
  const [endMonth, setEndMonth] = useState<string>("")
  const [endYear, setEndYear] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([])

  const handleCategoryChange = (category: TransactionCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleExport = async () => {
    try {
      const csvBlob = await FinanceApi.getTransactionInCsv({
        startMonth: startMonth !== "all" ? startMonth : undefined,
        startYear: startYear !== "all" ? startYear : undefined,
        endMonth: endMonth !== "all" ? endMonth : undefined,
        endYear: endYear !== "all" ? endYear : undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      });
  
      const url = window.URL.createObjectURL(new Blob([csvBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export CSV failed:", error);
    }
  
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exporter les transactions</DialogTitle>
          <DialogDescription>Sélectionnez la période et les catégories à exporter au format CSV.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Période</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="startMonth">Mois de début</Label>
                <Select value={startMonth} onValueChange={setStartMonth}>
                  <SelectTrigger id="startMonth">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="01">Janvier</SelectItem>
                    <SelectItem value="02">Février</SelectItem>
                    <SelectItem value="03">Mars</SelectItem>
                    <SelectItem value="04">Avril</SelectItem>
                    <SelectItem value="05">Mai</SelectItem>
                    <SelectItem value="06">Juin</SelectItem>
                    <SelectItem value="07">Juillet</SelectItem>
                    <SelectItem value="08">Août</SelectItem>
                    <SelectItem value="09">Septembre</SelectItem>
                    <SelectItem value="10">Octobre</SelectItem>
                    <SelectItem value="11">Novembre</SelectItem>
                    <SelectItem value="12">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="startYear">Année de début</Label>
                <Select value={startYear} onValueChange={setStartYear}>
                  <SelectTrigger id="startYear">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endMonth">Mois de fin</Label>
                <Select value={endMonth} onValueChange={setEndMonth}>
                  <SelectTrigger id="endMonth">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="01">Janvier</SelectItem>
                    <SelectItem value="02">Février</SelectItem>
                    <SelectItem value="03">Mars</SelectItem>
                    <SelectItem value="04">Avril</SelectItem>
                    <SelectItem value="05">Mai</SelectItem>
                    <SelectItem value="06">Juin</SelectItem>
                    <SelectItem value="07">Juillet</SelectItem>
                    <SelectItem value="08">Août</SelectItem>
                    <SelectItem value="09">Septembre</SelectItem>
                    <SelectItem value="10">Octobre</SelectItem>
                    <SelectItem value="11">Novembre</SelectItem>
                    <SelectItem value="12">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endYear">Année de fin</Label>
                <Select value={endYear} onValueChange={setEndYear}>
                  <SelectTrigger id="endYear">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Catégories</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-abonnements"
                  checked={selectedCategories.includes("sub")}
                  onCheckedChange={() => handleCategoryChange("sub")}
                />
                <Label htmlFor="category-abonnements">Abonnements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-livraison"
                  checked={selectedCategories.includes("delivery")}
                  onCheckedChange={() => handleCategoryChange("delivery")}
                />
                <Label htmlFor="category-livraison">Livraison</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-prestations"
                  checked={selectedCategories.includes("service")}
                  onCheckedChange={() => handleCategoryChange("service")}
                />
                <Label htmlFor="category-prestations">Prestations</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport}>Exporter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
