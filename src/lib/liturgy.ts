export type LiturgicalSeason = 'ORDINARY_TIME' | 'LENT' | 'ADVENT' | 'EASTER' | 'CHRISTMAS' | 'MARTYR' | 'REJOICE';

export function getCurrentSeason(date: Date = new Date()): LiturgicalSeason {
  const year = date.getFullYear();
  
  // Very simplified liturgical calendar logic for demonstration
  // In production, this would use a proper lectionary calculation library
  const month = date.getMonth();
  const day = date.getDate();

  // Christmas season: Dec 25 - Baptism of the Lord (early Jan)
  if ((month === 11 && day >= 25) || (month === 0 && day <= 10)) return 'CHRISTMAS';
  
  // Advent: 4 weeks before Christmas
  if (month === 11 && day < 25) return 'ADVENT';

  // Lent & Easter (Simplified)
  if (month === 2 || month === 3) return 'LENT';
  if (month === 4) return 'EASTER';

  // Default to Ordinary Time
  return 'ORDINARY_TIME';
}

export function getSeasonColor(season: LiturgicalSeason): string {
  switch (season) {
    case 'ORDINARY_TIME': return 'text-liturgical-green';
    case 'LENT':
    case 'ADVENT': return 'text-liturgical-violet';
    case 'EASTER':
    case 'CHRISTMAS': return 'text-liturgical-gold';
    case 'MARTYR': return 'text-liturgical-red';
    case 'REJOICE': return 'text-liturgical-rose';
    default: return 'text-white';
  }
}

export function getSeasonBg(season: LiturgicalSeason): string {
  switch (season) {
    case 'ORDINARY_TIME': return 'bg-liturgical-green';
    case 'LENT':
    case 'ADVENT': return 'bg-liturgical-violet';
    case 'EASTER':
    case 'CHRISTMAS': return 'bg-liturgical-gold';
    case 'MARTYR': return 'bg-liturgical-red';
    case 'REJOICE': return 'bg-liturgical-rose';
    default: return 'bg-navy-900';
  }
}
