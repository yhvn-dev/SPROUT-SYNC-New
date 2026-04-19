export const SEASON_MAP = {
  cool_dry:  { label: "Cool Dry",  emoji: "🌤️" },
  hot_dry:   { label: "Hot Dry",   emoji: "☀️" },
  early_wet: { label: "Early Wet", emoji: "🌧️" },
  late_wet:  { label: "Late Wet",  emoji: "⛈️" },
};

export const getSeasonLabel = (season) => {
  const s = SEASON_MAP[season];
  return s ? `${s.emoji} ${s.label}` : "—";
};