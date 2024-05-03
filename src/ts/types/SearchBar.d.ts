import { inputCapacity } from "../tools/inputsBase";

declare global {
    interface dataSearchBar{
        colorBackground: string;
        colorText: string;
        minDate: string;
        maxDate: string;
        lang: string;
        urlSearch: string;
        maxCapacity: number;
        idUser: number;
        idRental?: number;
        origin: string;
        onChangeCalendar?: Function;
        requiredAdult: boolean;
        rentalType: rentalTypeSearchBar[];
        textLang: textLangSearchBar;
    }

    interface rentalTypeSearchBar{
        name: string;
        idRentalType: number;
        maxCapacity: number;
    }

    interface textLangSearchBar{
        placeholderDate: string;
        allRentals: string;
        from: string;
        to: string;
        childrens: string;
        adults: string;
        childAge: string;
        save: string;
    }
}

export {};