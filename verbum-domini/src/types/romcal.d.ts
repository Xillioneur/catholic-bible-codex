declare module 'romcal' {
  export const Calendar: {
    calendarFor: (year: number) => any[];
  };
  export const LiturgicalColors: {
    GREEN: string;
    VIOLET: string;
    WHITE: string;
    RED: string;
    ROSE: string;
  };
}
