import type { editor } from "monaco-editor"

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

function getCssVariableValue(name: string): string {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()

    if (value.includes("hsl") || (value.includes(" ") && value.includes("%"))) {
      const parts = value.replace(/[^\d., ]/g, "").split(/[ ,]+/)

      if (parts.length >= 3) {
        const h = Number.parseFloat(parts[0])
        const s = Number.parseFloat(parts[1])
        const l = Number.parseFloat(parts[2])

        if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
          return hslToHex(h, s, l)
        }
      }
    }

    return value
  } catch (error) {
    console.error("Error getting CSS variable:", error)
    return "#ffffff" 
  }
}

export function getLightTheme(): editor.IStandaloneThemeData {
  return {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": getCssVariableValue("--background"),
      "editor.foreground": getCssVariableValue("--foreground"),
      "editor.lineHighlightBackground": getCssVariableValue("--muted"),
      "editorLineNumber.foreground": getCssVariableValue("--muted-foreground"),
      "editor.selectionBackground": getCssVariableValue("--secondary"),
      "editorCursor.foreground": getCssVariableValue("--primary"),
      "editorWhitespace.foreground": getCssVariableValue("--border"),
      "editorIndentGuide.background": getCssVariableValue("--border"),
    },
  }
}

export function getDarkTheme(): editor.IStandaloneThemeData {
  return {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": getCssVariableValue("--background"),
      "editor.foreground": getCssVariableValue("--foreground"),
      "editor.lineHighlightBackground": getCssVariableValue("--muted"),
      "editorLineNumber.foreground": getCssVariableValue("--muted-foreground"),
      "editor.selectionBackground": getCssVariableValue("--secondary"),
      "editorCursor.foreground": getCssVariableValue("--primary"),
      "editorWhitespace.foreground": getCssVariableValue("--border"),
      "editorIndentGuide.background": getCssVariableValue("--border"),
    },
  }
}
