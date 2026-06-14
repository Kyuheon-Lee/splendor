export const ELEMENT_THEMES: Record<string, { 
  name: string, 
  bg: string, 
  glow: string, 
  icons: string[] 
}> = {
  white: { name: "바람", bg: "bg-slate-100", glow: "shadow-slate-200",  icons: ["༄", "☁️", "🌪️"], },
  blue: { name: "물", bg: "bg-blue-500", glow: "shadow-blue-400",  icons: ["💧", "🌊", "🌀"], },
  green: { name: "대지", bg: "bg-emerald-500", glow: "shadow-emerald-400", icons: ["🌱", "🌲", "⛰️"], },
  red: { name: "불", bg: "bg-orange-600", glow: "shadow-orange-400", icons: ["🔥", "🌋", "☀️"] },
  black: { name: "공허", bg: "bg-zinc-800", glow: "shadow-zinc-900", icons: ["🌑", "🌌", "🕳️"] },
};
