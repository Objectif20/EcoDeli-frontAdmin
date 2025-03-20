import { useEffect, useMemo, useState } from "react";
import { LanguageDataTable } from "@/components/features/general/languages/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LanguagePage() {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [newLanguage, setNewLanguage] = useState<{
    name: string;
    iso_code: string;
    file: File | null;
  }>({
    name: "",
    iso_code: "",
    file: null,
  });

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Langues"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  const exampleLanguageData = [
    {
      id: "1",
      name: "Français",
      iso_code: "fr",
      available: true,
    },
    {
      id: "2",
      name: "Anglais",
      iso_code: "gb",
      available: true,
    },
    {
      id: "3",
      name: "Espagnol",
      iso_code: "es",
      available: false,
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, exampleLanguageData.length);
    return exampleLanguageData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, exampleLanguageData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewLanguage({ name: "", iso_code: "", file: null });
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewLanguage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewLanguage((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleSubmit = () => {
    // Logique pour soumettre la nouvelle langue
    console.log("Nouvelle langue:", newLanguage);
    handleCloseDialog();
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">Langues</h1>
      <div className="flex justify-end mb-4">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="default">Importer une nouvelle langue</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer une nouvelle langue</DialogTitle>
            <DialogDescription>
              Veuillez entrer les détails de la nouvelle langue.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="name">Nom de la langue</Label>
            <Input
              name="name"
              placeholder="Nom"
              value={newLanguage.name}
              onChange={handleInputChange}
              id="name"
            />
          </div>
          <div>
            <Label htmlFor="iso_code">Code ISO</Label>
            <Input
              name="iso_code"
              placeholder="Code ISO"
              value={newLanguage.iso_code}
              onChange={handleInputChange}
              id="iso_code"
            />
          </div>
          <div>
            <Label htmlFor="file">Fichier de langue</Label>
            <Input
              accept=".json"
              type="file"
              onChange={handleFileChange}
              id="file"
            />
          </div>
          <div className="flex justify-end mt-4 mx-2">
            <Button className="mr-4" onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleSubmit}>Importer</Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
      <LanguageDataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={exampleLanguageData.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
