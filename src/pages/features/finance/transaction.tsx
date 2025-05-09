import { Transaction } from "@/components/features/finance/column";
import { Transactions } from "@/components/features/finance/transactions";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const transactions: Transaction[] = [
    {
      id: "TR-001",
      name: "Jean Dupont",
      type: "abonnements",
      category: "abonnements",
      date: "01/2024",
      invoiceUrl: "https://example.com/invoice/TR-001.pdf",
    },
    {
      id: "TR-002",
      name: "Marie Martin",
      type: "virements reçus",
      category: "prestations",
      date: "2024-02-15",
      invoiceUrl: "https://example.com/invoice/TR-002.pdf",
    },
    {
      id: "TR-003",
      name: "Pierre Durand",
      type: "virements émis",
      category: "livraison",
      date: "2024-03-22",
      invoiceUrl: "https://example.com/invoice/TR-003.pdf",
    },
    {
      id: "TR-004",
      name: "Sophie Bernard",
      type: "abonnements",
      category: "abonnements",
      date: "02/2024",
      invoiceUrl: "https://example.com/invoice/TR-004.pdf",
    },
    {
      id: "TR-005",
      name: "Lucas Petit",
      type: "virements reçus",
      category: "prestations",
      date: "2024-01-10",
      invoiceUrl: "https://example.com/invoice/TR-005.pdf",
    },
    {
      id: "TR-006",
      name: "Emma Leroy",
      type: "virements émis",
      category: "livraison",
      date: "2023-12-05",
      invoiceUrl: "https://example.com/invoice/TR-006.pdf",
    },
    {
      id: "TR-007",
      name: "Thomas Moreau",
      type: "abonnements",
      category: "abonnements",
      date: "03/2024",
      invoiceUrl: "https://example.com/invoice/TR-007.pdf",
    },
    {
      id: "TR-008",
      name: "Camille Roux",
      type: "virements reçus",
      category: "prestations",
      date: "2024-04-18",
      invoiceUrl: "https://example.com/invoice/TR-008.pdf",
    },
    {
      id: "TR-009",
      name: "Antoine Girard",
      type: "virements émis",
      category: "livraison",
      date: "2023-11-30",
      invoiceUrl: "https://example.com/invoice/TR-009.pdf",
    },
    {
      id: "TR-010",
      name: "Julie Fournier",
      type: "abonnements",
      category: "abonnements",
      date: "04/2024",
      invoiceUrl: "https://example.com/invoice/TR-010.pdf",
    },
    {
      id: "TR-011",
      name: "Nicolas Lambert",
      type: "virements reçus",
      category: "prestations",
      date: "2024-05-02",
      invoiceUrl: "https://example.com/invoice/TR-011.pdf",
    },
    {
      id: "TR-012",
      name: "Léa Bonnet",
      type: "virements émis",
      category: "livraison",
      date: "2023-10-15",
      invoiceUrl: "https://example.com/invoice/TR-012.pdf",
    },
    {
      id: "TR-013",
      name: "Maxime Mercier",
      type: "abonnements",
      category: "abonnements",
      date: "05/2024",
      invoiceUrl: "https://example.com/invoice/TR-013.pdf",
    },
    {
      id: "TR-014",
      name: "Chloé Dubois",
      type: "virements reçus",
      category: "prestations",
      date: "2024-06-20",
      invoiceUrl: "https://example.com/invoice/TR-014.pdf",
    },
    {
      id: "TR-015",
      name: "Alexandre Blanc",
      type: "virements émis",
      category: "livraison",
      date: "2023-09-08",
      invoiceUrl: "https://example.com/invoice/TR-015.pdf",
    },
  ]


export default function TransactionsPage() {


      const dispatch = useDispatch()
    
        useEffect(() => {
          dispatch(
            setBreadcrumb({
              segments: ["Accueil", "Transactions"],
              links: ["/office/dashboard"],
            })
          );
      
        }, [dispatch]);



  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestion des Transactions</h1>
      <Transactions transactions={transactions}/>
    </div>
  )
}
