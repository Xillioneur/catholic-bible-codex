import { Calendar, LiturgicalColors } from "romcal";
import moment from "moment";

export interface LiturgicalDay {
  date: string;
  name: string;
  color: string;
  season: string;
  rank: string;
  hex: string;
}

export async function getLiturgicalDay(date: Date = new Date()): Promise<LiturgicalDay> {
  const year = date.getFullYear();
  const calendar = Calendar.calendarFor(year);
  const momentDate = moment(date).startOf("day");
  
  const day = calendar.find((d: any) => moment(d.moment).isSame(momentDate, "day"));

  // Theme Color Map
  const colorHexMap: Record<string, string> = {
    ordinary: "#059669", // Green
    lent: "#7c3aed",     // Violet
    easter: "#fbbf24",   // Gold
    advent: "#4f46e5",   // Deep Blue/Violet
    martyr: "#dc2626",   // Red
    rose: "#f472b6",     // Rose
  };

  if (!day) {
    return {
      date: date.toISOString(),
      name: "Ordinary Day",
      color: "ordinary",
      season: "Ordinary Time",
      rank: "Feria",
      hex: colorHexMap.ordinary!,
    };
  }

  const colorMap: Record<string, string> = {
    [LiturgicalColors.GREEN]: "ordinary",
    [LiturgicalColors.VIOLET]: "lent",
    [LiturgicalColors.WHITE]: "easter",
    [LiturgicalColors.RED]: "martyr",
    [LiturgicalColors.ROSE]: "rose",
  };

  const colorKey = colorMap[day.color] || "ordinary";

  return {
    date: date.toISOString(),
    name: day.name,
    color: colorKey,
    season: day.season ? (typeof day.season === 'string' ? day.season : (day.season as any).name || "Unknown Season") : "Unknown Season",
    rank: day.type,
    hex: colorHexMap[colorKey] || colorHexMap.ordinary!,
  };
}

export function getDailyReadings(_date: Date) {
  return {
    firstReading: {
      reference: "Lv 19:1-2, 11-18",
      text: "Be holy, for I, the Lord your God, am holy...",
    },
    psalm: {
      reference: "Ps 19:8, 10, 15",
      text: "Your words, Lord, are Spirit and life.",
    },
    gospel: {
      reference: "Mt 25:31-46",
      text: "Whatever you did for one of these least brothers of mine, you did for me.",
    }
  };
}
