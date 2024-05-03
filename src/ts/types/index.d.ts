export {};

declare global {
  interface Window {
    resabooking: Function;
  }

  interface Function {
    get: Function;
  }

  interface windowRequest{
    id: number;
    type: string|Array;
    token: string;
    lang?: string;
    rental?: number;
    origin?: string;
    rentalType?: number;
    arrivalDate?: string,
    departureDate?: string,
    adults?: number,
    childrens?: number,
    childrensAge?: string,
  }
  
}