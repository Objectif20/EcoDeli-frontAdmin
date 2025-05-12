import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TransactionCategory } from "./column";
import { FinanceApi } from "@/api/finance.api";

interface ExportCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportCSVDialog({ open, onOpenChange }: ExportCSVDialogProps) {
  const { t } = useTranslation();
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([]);

  const handleCategoryChange = (category: TransactionCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("pages.transactions.exportDialog.title")}</DialogTitle>
          <DialogDescription>{t("pages.transactions.exportDialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("pages.transactions.exportDialog.period")}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="startMonth">{t("pages.transactions.exportDialog.startMonth")}</Label>
                <Select value={startMonth} onValueChange={setStartMonth}>
                  <SelectTrigger id="startMonth">
                    <SelectValue placeholder={t("pages.transactions.monthFilter.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("pages.transactions.monthFilter.all")}</SelectItem>
                    <SelectItem value="01">{t("pages.transactions.monthFilter.01")}</SelectItem>
                    <SelectItem value="02">{t("pages.transactions.monthFilter.02")}</SelectItem>
                    <SelectItem value="03">{t("pages.transactions.monthFilter.03")}</SelectItem>
                    <SelectItem value="04">{t("pages.transactions.monthFilter.04")}</SelectItem>
                    <SelectItem value="05">{t("pages.transactions.monthFilter.05")}</SelectItem>
                    <SelectItem value="06">{t("pages.transactions.monthFilter.06")}</SelectItem>
                    <SelectItem value="07">{t("pages.transactions.monthFilter.07")}</SelectItem>
                    <SelectItem value="08">{t("pages.transactions.monthFilter.08")}</SelectItem>
                    <SelectItem value="09">{t("pages.transactions.monthFilter.09")}</SelectItem>
                    <SelectItem value="10">{t("pages.transactions.monthFilter.10")}</SelectItem>
                    <SelectItem value="11">{t("pages.transactions.monthFilter.11")}</SelectItem>
                    <SelectItem value="12">{t("pages.transactions.monthFilter.12")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="startYear">{t("pages.transactions.exportDialog.startYear")}</Label>
                <Select value={startYear} onValueChange={setStartYear}>
                  <SelectTrigger id="startYear">
                    <SelectValue placeholder={t("pages.transactions.yearFilter.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("pages.transactions.yearFilter.all")}</SelectItem>
                    <SelectItem value="2023">{t("pages.transactions.yearFilter.2023")}</SelectItem>
                    <SelectItem value="2024">{t("pages.transactions.yearFilter.2024")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endMonth">{t("pages.transactions.exportDialog.endMonth")}</Label>
                <Select value={endMonth} onValueChange={setEndMonth}>
                  <SelectTrigger id="endMonth">
                    <SelectValue placeholder={t("pages.transactions.monthFilter.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("pages.transactions.monthFilter.all")}</SelectItem>
                    <SelectItem value="01">{t("pages.transactions.monthFilter.01")}</SelectItem>
                    <SelectItem value="02">{t("pages.transactions.monthFilter.02")}</SelectItem>
                    <SelectItem value="03">{t("pages.transactions.monthFilter.03")}</SelectItem>
                    <SelectItem value="04">{t("pages.transactions.monthFilter.04")}</SelectItem>
                    <SelectItem value="05">{t("pages.transactions.monthFilter.05")}</SelectItem>
                    <SelectItem value="06">{t("pages.transactions.monthFilter.06")}</SelectItem>
                    <SelectItem value="07">{t("pages.transactions.monthFilter.07")}</SelectItem>
                    <SelectItem value="08">{t("pages.transactions.monthFilter.08")}</SelectItem>
                    <SelectItem value="09">{t("pages.transactions.monthFilter.09")}</SelectItem>
                    <SelectItem value="10">{t("pages.transactions.monthFilter.10")}</SelectItem>
                    <SelectItem value="11">{t("pages.transactions.monthFilter.11")}</SelectItem>
                    <SelectItem value="12">{t("pages.transactions.monthFilter.12")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="endYear">{t("pages.transactions.exportDialog.endYear")}</Label>
                <Select value={endYear} onValueChange={setEndYear}>
                  <SelectTrigger id="endYear">
                    <SelectValue placeholder={t("pages.transactions.yearFilter.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("pages.transactions.yearFilter.all")}</SelectItem>
                    <SelectItem value="2023">{t("pages.transactions.yearFilter.2023")}</SelectItem>
                    <SelectItem value="2024">{t("pages.transactions.yearFilter.2024")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("pages.transactions.exportDialog.categories")}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-abonnements"
                  checked={selectedCategories.includes("sub")}
                  onCheckedChange={() => handleCategoryChange("sub")}
                />
                <Label htmlFor="category-abonnements">{t("pages.transactions.exportDialog.categorySub")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-livraison"
                  checked={selectedCategories.includes("delivery")}
                  onCheckedChange={() => handleCategoryChange("delivery")}
                />
                <Label htmlFor="category-livraison">{t("pages.transactions.exportDialog.categoryDelivery")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-prestations"
                  checked={selectedCategories.includes("service")}
                  onCheckedChange={() => handleCategoryChange("service")}
                />
                <Label htmlFor="category-prestations">{t("pages.transactions.exportDialog.categoryService")}</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("pages.transactions.exportDialog.cancelButton")}
          </Button>
          <Button onClick={handleExport}>{t("pages.transactions.exportDialog.exportButton")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
