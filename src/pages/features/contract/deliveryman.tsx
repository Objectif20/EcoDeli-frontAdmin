"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useTranslation } from "react-i18next"
import MyPDFReader from "@/components/pdf-viewer"
import axiosInstance from "@/api/axiosInstance"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Deliveryman {
  id: string
  nom: string
  prenom: string
  contratUrl: string
  dateContrat: string
}

export default function DeliverymanContractPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [_, setDeliverymen] = useState<Deliveryman[]>([])
  const [filteredDeliverymen, setFilteredDeliverymen] = useState<Deliveryman[]>([])
  const [selectedDeliveryman, setSelectedDeliveryman] = useState<Deliveryman | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.home"), t("client.pages.office.contratDeliverymen")],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch, t])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const fetchDeliverymen = useCallback(
    async (page = 1, search = "") => {
      setIsLoading(true)
      try {
        // Mock data for demonstration
        const mockData = [
          {
            id: "deliveryman-1",
            nom: "Dupont",
            prenom: "Jean",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-01-15",
          },
          {
            id: "deliveryman-2",
            nom: "Martin",
            prenom: "Marie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-02-20",
          },
          {
            id: "deliveryman-3",
            nom: "Bernard",
            prenom: "Luc",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-03-10",
          },
          {
            id: "deliveryman-4",
            nom: "Dubois",
            prenom: "Sophie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-04-05",
          },
          {
            id: "deliveryman-5",
            nom: "Thomas",
            prenom: "Pierre",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-05-12",
          },
          {
            id: "deliveryman-6",
            nom: "Robert",
            prenom: "Claire",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-06-18",
          },
          {
            id: "deliveryman-7",
            nom: "Richard",
            prenom: "Paul",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-07-22",
          },
          {
            id: "deliveryman-8",
            nom: "Petit",
            prenom: "Julie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-08-30",
          },
          {
            id: "deliveryman-9",
            nom: "Durand",
            prenom: "Nicolas",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-09-14",
          },
          {
            id: "deliveryman-10",
            nom: "Leroy",
            prenom: "Camille",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-10-25",
          },
          {
            id: "deliveryman-11",
            nom: "Moreau",
            prenom: "Hugo",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-11-08",
          },
          {
            id: "deliveryman-12",
            nom: "Simon",
            prenom: "Emma",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-12-19",
          },
        ]

        const filtered = search
          ? mockData.filter(
              (d) =>
                d.nom.toLowerCase().includes(search.toLowerCase()) ||
                d.prenom.toLowerCase().includes(search.toLowerCase()),
            )
          : mockData

        const total = Math.ceil(filtered.length / itemsPerPage)
        const paginatedData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

        setDeliverymen(mockData)
        setFilteredDeliverymen(paginatedData)
        setTotalPages(total)
      } catch (error) {
        console.error("Erreur lors du chargement des livreurs:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [itemsPerPage],
  )

  useEffect(() => {
    fetchDeliverymen(currentPage, searchQuery)
  }, [fetchDeliverymen, currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchDeliverymen(1, searchQuery)
  }

  const handleDeliverymanClick = useCallback(
    async (deliveryman: Deliveryman) => {
      setSelectedDeliveryman(deliveryman)

      if (isMobile) {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: deliveryman.contratUrl },
            responseType: "arraybuffer",
          })

          const contentType = response.headers["content-type"]
          const blob = new Blob([response.data], { type: contentType })

          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = `contrat_${deliveryman.nom}_${deliveryman.prenom}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          console.error("Erreur lors du téléchargement du contrat:", error)
        }
      } else {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: deliveryman.contratUrl },
            responseType: "arraybuffer",
          })

          const contentType = response.headers["content-type"]
          const blob = new Blob([response.data], { type: contentType })
          const objectURL = URL.createObjectURL(blob)
          setPdfUrl(objectURL)
        } catch (error) {
          console.error("Erreur lors du chargement du contrat:", error)
        }
      }
    },
    [isMobile],
  )

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col h-full md:flex-row">
      <div className="w-full md:w-2/5 p-4 md:border-r">
        <h1 className="text-2xl font-bold mb-4">{t("client.pages.office.contratDeliverymen")}</h1>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("client.pages.office.searchDeliveryman")}
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

        <ScrollArea className="h-[calc(100vh-250px)]">
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
            ) : filteredDeliverymen.length > 0 ? (
              filteredDeliverymen.map((deliveryman) => (
                <Card
                  key={deliveryman.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedDeliveryman?.id === deliveryman.id ? "border-primary" : ""}`}
                  onClick={() => handleDeliverymanClick(deliveryman)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                        <img
                          src={`https://ui-avatars.com/api/?name=${deliveryman.prenom}+${deliveryman.nom}&background=random`}
                          alt={`${deliveryman.prenom} ${deliveryman.nom}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {deliveryman.nom} {deliveryman.prenom}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("client.pages.office.contratDate")}: {deliveryman.dateContrat}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p>{t("client.pages.office.noDeliverymenFound")}</p>
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
              if (totalPages <= 5) return true
              if (page === 1 || page === totalPages) return false
              if (currentPage <= 3) return page <= 5
              if (currentPage >= totalPages - 2) return page >= totalPages - 4
              return page >= currentPage - 1 && page <= currentPage + 1
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
            <h3 className="text-lg font-medium">{t("client.pages.office.noContractSelected")}</h3>
            <p className="text-muted-foreground">{t("client.pages.office.selectDeliveryman")}</p>
          </div>
        )}
      </div>

    </div>
  )
}
