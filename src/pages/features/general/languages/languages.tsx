import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { LanguageDataTable } from "@/components/features/general/languages/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getLanguages, addLanguage } from "@/api/languages.api";

// Interface pour les données de langue
interface Language {
  id: string;
  name: string;
  iso_code: string;
  available: boolean;
}

// Interface pour les nouvelles langues
interface NewLanguage {
  name: string;
  iso_code: string;
  active: boolean;
  file: File | null;
}

export default function LanguagePage() {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newLanguage, setNewLanguage] = useState<NewLanguage>({
    name: "",
    iso_code: "",
    active: false,
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

  const fetchLanguages = async () => {
    try {
      const response = await getLanguages(pageIndex + 1, pageSize);
      const formattedLanguages: Language[] = response.data.map((lang) => ({
        id: lang.language_id,
        name: lang.language_name,
        iso_code: lang.iso_code,
        available: lang.active,
      }));
      setLanguages(formattedLanguages);
      setTotalItems(response.meta.total);
    } catch (error) {
      console.error("Erreur lors du chargement des langues", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [pageIndex, pageSize]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewLanguage({ name: "", iso_code: "", active: false, file: null });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (newLanguage.file) {
        await addLanguage(
          {
            language_name: newLanguage.name,
            iso_code: newLanguage.iso_code,
            active: newLanguage.active,
          },
          newLanguage.file
        );
        handleCloseDialog();
        setPageIndex(0); 
        await fetchLanguages();
      } else {
        console.error("Erreur: Aucun fichier de langue sélectionné");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la langue", error);
    }
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
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la langue</Label>
                <Input name="name" placeholder="Nom" value={newLanguage.name} onChange={handleChange} id="name" />
              </div>
              <div>
                <Label htmlFor="iso_code">Code ISO</Label>
                <Input name="iso_code" placeholder="Code ISO" value={newLanguage.iso_code} onChange={handleChange} id="iso_code" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="active" name="active" checked={newLanguage.active} onCheckedChange={(checked) => handleChange({ target: { name: 'active', value: checked } } as ChangeEvent<HTMLInputElement>)} />
                <Label htmlFor="active">Active</Label>
              </div>
              <div>
                <Label htmlFor="file">Fichier de langue</Label>
                <Input accept=".json" type="file" onChange={handleFileChange} id="file" />
              </div>
              <div className="flex justify-end mt-4 mx-2">
                <Button className="mr-4" type="button" onClick={handleCloseDialog}>
                  Annuler
                </Button>
                <Button type="submit">Importer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <LanguageDataTable key={`${pageIndex}-${pageSize}`} data={languages} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
