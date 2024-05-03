declare global {
  interface DataBookingCalendar {
    elementSelector: string;
    lang: string;
    initDate?: string;
    endDate?: string;
    startRange?: string;
    finishRange?: string;
    cssFiles?: Array;
    selectCallback?: (event: any) => void;
  }
  
}

export {}