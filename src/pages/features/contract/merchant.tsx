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

interface Merchant {
  id: string
  nom: string
  prenom: string
  contratUrl: string
  dateContrat: string
}

export default function MerchantContractPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [_, setMerchants] = useState<Merchant[]>([])
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([])
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
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
        segments: [t("pages.contracts.merchant.home"), t("pages.contracts.merchant.contratMerchants")],
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

  const fetchMerchants = useCallback(
    async (page = 1, search = "") => {
      setIsLoading(true)
      try {
        // Mock data for demonstration
        const mockData = [
          {
            id: "merchant-1",
            nom: "Dupont",
            prenom: "Jean",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-01-15",
          },
          {
            id: "merchant-2",
            nom: "Martin",
            prenom: "Marie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-02-20",
          },
          {
            id: "merchant-3",
            nom: "Bernard",
            prenom: "Luc",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-03-10",
          },
          {
            id: "merchant-4",
            nom: "Dubois",
            prenom: "Sophie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-04-05",
          },
          {
            id: "merchant-5",
            nom: "Thomas",
            prenom: "Pierre",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-05-12",
          },
          {
            id: "merchant-6",
            nom: "Robert",
            prenom: "Claire",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-06-18",
          },
          {
            id: "merchant-7",
            nom: "Richard",
            prenom: "Paul",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-07-22",
          },
          {
            id: "merchant-8",
            nom: "Petit",
            prenom: "Julie",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-08-30",
          },
          {
            id: "merchant-9",
            nom: "Durand",
            prenom: "Nicolas",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-09-14",
          },
          {
            id: "merchant-10",
            nom: "Leroy",
            prenom: "Camille",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-10-25",
          },
          {
            id: "merchant-11",
            nom: "Moreau",
            prenom: "Hugo",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-11-08",
          },
          {
            id: "merchant-12",
            nom: "Simon",
            prenom: "Emma",
            contratUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            dateContrat: "2023-12-19",
          },
        ]

        const filtered = search
          ? mockData.filter(
              (m) =>
                m.nom.toLowerCase().includes(search.toLowerCase()) ||
                m.prenom.toLowerCase().includes(search.toLowerCase()),
            )
          : mockData

        const total = Math.ceil(filtered.length / itemsPerPage)
        const paginatedData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

        setMerchants(mockData)
        setFilteredMerchants(paginatedData)
        setTotalPages(total)
      } catch (error) {
        console.error("Erreur lors du chargement des commerçants:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [itemsPerPage],
  )

  useEffect(() => {
    fetchMerchants(currentPage, searchQuery)
  }, [fetchMerchants, currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchMerchants(1, searchQuery)
  }

  const handleMerchantClick = useCallback(
    async (merchant: Merchant) => {
      setSelectedMerchant(merchant)

      if (isMobile) {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: merchant.contratUrl },
            responseType: "arraybuffer",
          })

          const contentType = response.headers["content-type"]
          const blob = new Blob([response.data], { type: contentType })

          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = `contrat_${merchant.nom}_${merchant.prenom}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          console.error("Erreur lors du téléchargement du contrat:", error)
        }
      } else {
        try {
          const response = await axiosInstance.get("/client/utils/document", {
            params: { url: merchant.contratUrl },
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
        <h1 className="text-2xl font-bold mb-4">{t("pages.contracts.merchant.contratMerchants")}</h1>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("pages.contracts.merchant.searchMerchant")}
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
            ) : filteredMerchants.length > 0 ? (
              filteredMerchants.map((merchant) => (
                <Card
                  key={merchant.id}
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${selectedMerchant?.id === merchant.id ? "border-primary" : ""}`}
                  onClick={() => handleMerchantClick(merchant)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                        <img
                          src={`https://ui-avatars.com/api/?name=${merchant.prenom}+${merchant.nom}&background=random`}
                          alt={`${merchant.prenom} ${merchant.nom}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {merchant.nom} {merchant.prenom}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("pages.contracts.merchant.contratDate")}: {merchant.dateContrat}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p>{t("pages.contracts.merchant.noMerchantsFound")}</p>
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
            <h3 className="text-lg font-medium">{t("pages.contracts.merchant.noContractSelected")}</h3>
            <p className="text-muted-foreground">{t("pages.contracts.merchant.selectMerchant")}</p>
          </div>
        )}
      </div>

    </div>
  )
}
