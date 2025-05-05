"use client"

import * as React from "react"
import {
  Mail,
  Clipboard,
  Users,
  FileText,
  Settings,
  File,
  GalleryVerticalEnd,
  Truck,
  ShoppingCart,
  HelpCircle,
  EuroIcon
} from "lucide-react"
import { useSelector } from "react-redux"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { RootState } from "@/redux/store"
import { useTranslation } from "react-i18next"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const admin = useSelector((state: RootState) => state.admin.admin)

  const { t } = useTranslation()

  const userData = {
    name: `${admin?.first_name} ${admin?.last_name}`,
    email: admin?.email || "",
    avatar: admin?.photo || `${admin?.first_name?.charAt(0) || ""}${admin?.last_name?.charAt(0) || ""}`,
  }

  const data = {
    user: userData,
    teams: [
      {
        name: t("sidebar.header.titre"),
        logo: GalleryVerticalEnd,
        plan: t("sidebar.header.role"),
      },
    ],
    navMain: [
      {
        title: t("sidebar.main.mail"),
        url: "/office/mail",
        icon: Mail, 
      },
      {
        title: t("sidebar.main.ticket"),
        url: "/office/ticket",
        icon: Clipboard, 
      },
      {
        title: t("sidebar.main.signalement"),
        url: "/office/reporting",
        icon: FileText, 
      },
      {
        title: t("sidebar.main.contrat.titre"),
        url: "#",
        icon: File, 
        items: [
          { title: t("sidebar.main.contrat.contratTransporteur"), url: "#" },
          { title: t("sidebar.main.contrat.contratPrestataire"), url: "#" },
          { title: t("sidebar.main.contrat.contratCommercant"), url: "#" },
        ],
      },
      {
        title: t("sidebar.main.general.titre"),
        url: "#",
        icon: Settings, 
        items: [
          { title: t("sidebar.main.general.langue"), url: "/office/general/languages" },
          { title: t("sidebar.main.general.categorie"), url: "/office/general/categories" },
          { title: t("sidebar.main.general.compteAdmin"), url: "/office/general/admin" },
        ],
      },
    ],
    finance: [
      {
        title: t("sidebar.main.finance.abonnement.titre"),
        url: "#",
        icon: EuroIcon, 
        items: [
          { title: t("sidebar.main.finance.abonnement.listeAbonne"), url: "/office/finance/subscribers" },
          { title: t("sidebar.main.finance.abonnement.formuleAbonnement"), url: "/office/finance/plans" },
        ],
      },
      {
        title: t("sidebar.main.finance.transaction.titre"),
        url: "#",
        icon: FileText, 
        items: [
          { title: t("sidebar.main.finance.transaction.historiqueTransaction"), url: "#" },
          { title: t("sidebar.main.finance.transaction.stripe"), url: "#" },
        ],
      },
    ],
    profil: [
      {
        title: t("sidebar.main.profil.listeParticulier"),
        url: "/office/profile/clients",
        icon: Users, 
      },
      {
        title: t("sidebar.main.profil.listeTransporteur"),
        url: "/office/profile/deliverymen",
        icon: Truck, 
      },
      {
        title: t("sidebar.main.profil.listePrestataire"),
        url: "/office/profile/providers",
        icon: HelpCircle, 
      },
      {
        title: t("sidebar.main.profil.listeCommercant"),
        url: "/office/profile/merchants",
        icon: ShoppingCart, 
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <ScrollArea className="h-full">
      <SidebarContent>
        <NavMain items={data.navMain} title={t("sidebar.main.general.titre")} />
        <NavMain items={data.finance} title={t("sidebar.main.finance.titre")} />
        <NavMain items={data.profil} title={t("sidebar.main.profil.titre")} />
      </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
