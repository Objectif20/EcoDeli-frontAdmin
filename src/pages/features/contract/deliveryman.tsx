import React, { useState, useEffect, useCallback } from "react";
import { Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useTranslation } from "react-i18next";
import MyPDFReader from "@/components/pdf-viewer";
import axiosInstance from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contracts, GeneralApi } from "@/api/general.api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";



export default function DeliverymanContractPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliverymen, setDeliverymen] = useState<Contracts[]>([]);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState<Contracts | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.contracts.deliveryman.home"), t("pages.contracts.deliveryman.contratDeliverymen")],
        links: ["/office/dashboard"],
      }),
    );
  }, [dispatch, t]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchDeliverymen = useCallback(
    async (page = 1, search = "") => {
      setIsLoading(true);
      try {
        const response = await GeneralApi.getContracts(page, "deliveryman", search);
        setDeliverymen(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      } catch (error) {
        console.error("Erreur lors du chargement des livreurs:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  useEffect(() => {
    fetchDeliverymen(currentPage, searchQuery);
  }, [fetchDeliverymen, currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDeliverymen(1, searchQuery);
  };

  const handleDeliverymanClick = useCallback(
    async (deliveryman: Contracts) => {
      setSelectedDeliveryman(deliveryman);

      if (isMobile) {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: deliveryman.contratUrl },
            responseType: "arraybuffer",
          });

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `contrat_${deliveryman.nom}_${deliveryman.prenom}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Erreur lors du téléchargement du contrat:", error);
        }
      } else {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: deliveryman.contratUrl },
            responseType: "arraybuffer",
          });

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });
          const objectURL = URL.createObjectURL(blob);
          setPdfUrl(objectURL);
        } catch (error) {
          console.error("Erreur lors du chargement du contrat:", error);
        }
      }
    },
    [isMobile],
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full md:flex-row">
      <div className="w-full md:w-2/5 p-4 md:border-r">
        <h1 className="text-2xl font-bold mb-4">{t("pages.contracts.deliveryman.contratDeliverymen")}</h1>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("pages.contracts.deliveryman.searchDeliveryman")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("client.common.search")}</span>
            </Button>
          </div>
        </form>

        <ScrollArea className="h-[calc(100vh-270px)]">
          <div className="space-y-3 mb-4 mr-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : deliverymen.length > 0 ? (
              deliverymen.map((deliveryman) => (
                <Card
                  key={deliveryman.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedDeliveryman?.id === deliveryman.id ? "border-primary" : ""}`}
                  onClick={() => handleDeliverymanClick(deliveryman)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {deliveryman.photoUrl && (
                          <AvatarImage src={deliveryman.photoUrl} alt={`${deliveryman.prenom} ${deliveryman.nom}`} />
                        )}
                        <AvatarFallback>
                          {deliveryman.prenom.charAt(0)}{deliveryman.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {deliveryman.nom} {deliveryman.prenom}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("pages.contracts.deliveryman.contratDate")}: {deliveryman.dateContrat}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p>{t("pages.contracts.deliveryman.noDeliverymenFound")}</p>
              </div>
            )}
          </div>
        </ScrollArea>
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {currentPage > 3 && totalPages > 5 && (
              <>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} className="h-8 w-8">
                  1
                </Button>
                <span className="px-1 text-muted-foreground">...</span>
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return false;
                if (currentPage <= 3) return page <= 5;
                if (currentPage >= totalPages - 2) return page >= totalPages - 4;
                return page >= currentPage - 1 && page <= currentPage + 1;
              })
              .map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="h-8 w-8"
                >
                  {page}
                </Button>
              ))}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                <span className="px-1 text-muted-foreground">...</span>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)} className="h-8 w-8">
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="w-full md:w-3/5 p-4">
        {pdfUrl && !isMobile ? (
          <MyPDFReader fileURL={pdfUrl} />
        ) : (
          <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
            <FileText size={32} className="text-muted-foreground/50 mb-2" />
            <h3 className="text-lg font-medium">{t("pages.contracts.deliveryman.noContractSelected")}</h3>
            <p className="text-muted-foreground">{t("pages.contracts.deliveryman.selectDeliveryman")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
