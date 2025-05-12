import * as React from "react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  af, arDZ, arSA, be, bg, bn, ca, cs, cy, da, de, el, enAU, enCA, enGB,
  enUS, eo, es, et, faIR, fi, fr, frCA, gl, gu, he, hi, hr, ht, hu, hy, id,
  is, it, ja, ka, kk, km, kn, ko, lb, Locale, lt, lv, mk, mn, ms, mt, nb, nl, nn,
  oc, pl, pt, ptBR, ro, ru, sk, sl, sq, sr, srLatn, sv, ta, te, th, tr,
  ug, uk, uz, vi, zhCN, zhHK, zhTW
} from "date-fns/locale"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const localeMap: Record<string, Locale> = {
  af, ar: arSA, "ar-DZ": arDZ, be, bg, bn, ca, cs, cy, da, de, el,
  en: enUS, "en-US": enUS, "en-GB": enGB, "en-CA": enCA, "en-AU": enAU,
  eo, es, et, "fa-IR": faIR, fi, fr, "fr-CA": frCA, gl, gu, he, hi, hr,
  ht, hu, hy, id, is, it, ja, ka, kk, km, kn, ko, lb, lt, lv, mk, mn, ms,
  mt, nb, nl, nn, oc, pl, pt, "pt-BR": ptBR, ro, ru, sk, sl, sq, sr,
  "sr-Latn": srLatn, sv, ta, te, th, tr, ug, uk, uz, vi, "zh-CN": zhCN,
  "zh-HK": zhHK, "zh-TW": zhTW,
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation()

  const locale = useMemo(() => {
    return (
      localeMap[i18n.language] ||
      localeMap[i18n.language.split("-")[0]] ||
      enUS
    )
  }, [i18n.language])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      locale={locale}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
