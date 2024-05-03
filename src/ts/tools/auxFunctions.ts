import * as config from "../config/globalConfig";


export class Aux {

    static error(text: string = 'Internal server error'): false{
        console.error(text);
        return false;
    }

    static getData(element: HTMLElement, data: string, boolean: boolean = false): boolean|string|undefined{
        const text = element.dataset![data];
        return text?(boolean ? (typeof text === 'string' && text === 'true' ) : text.toString()):undefined;
    }

    /* STRING AUX */

    static strCapitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    /* HTML AUX */

    static injectCSS = (rule: string) => {
        const style = document.createElement('style');
        style.textContent = rule;
        document.head.appendChild(style);
    };

    static setLoading(elements: Element[]){
        for(const element of elements){
            element.innerHTML = '<img class="rb_loading" src="'+config.dirImgs+'/loading.gif" alt="loading resabooking widget"/>';
        }
    }

    static checkPosition(element: HTMLElement|null, elementRelative: HTMLElement|null): {top: number}|boolean{
        if(!element||!elementRelative) return false;
        const hElement              = element.offsetHeight;
        const hElementRelative      = elementRelative.offsetHeight;
        const topElementRelative    = elementRelative.getBoundingClientRect().top;
        const parent                = elementRelative.parentElement;
        let top;
        let margin = 0;
        if(parent){
            const stylesParent = window.getComputedStyle(parent);
            margin += parseFloat(stylesParent['paddingTop']);
        }
        const styles = window.getComputedStyle(elementRelative);
        margin += parseFloat(styles['marginTop']);
        if(topElementRelative >= hElement && window.innerHeight < topElementRelative+hElement+hElementRelative){
            top = (hElement-margin)*-1;
        }else{
            top = margin+hElementRelative;
        }
        return {top};
    }

    //########################### DATES ###########################################

    static dateIsToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear();
    };
    
    //Check is String is a format date
    // string - string of date
    // format - format of date
    //          DD-MM-YYYY
    //          MM-DD-YYYY
    //          YYYY-MM-DD
    static isDate(string: string, format: string){
        if(format === 'DD-MM-YYYY' || format === 'MM-DD-YYYY'){
            return !/^\d{1,2}-\d{1,2}-\d{4}$/.test(string)? false: true;
        }else if(format === 'YYYY-MM-DD'){
            return !/^\d{4}-\d{1,2}-\d{1,2}$/.test(string)? false: true;
        }else return false;
    }
    
    //Return diff days of 2 string dates
    //FORMAT DATE - DD-MM-YYYY
    //
    //Return number
    static diffDates(start: string, end: string, format: "DD-MM-YYYY"|"MM-DD-YYYY"|"YYYY-MM-DD" = "DD-MM-YYYY"):number|false{ 
        if(this.isDate(start, format) && this.isDate(end, format)){
            const startDate = this.returnDateFromString(start, format)?.getTime();
            const endDate = this.returnDateFromString(start, format)?.getTime();
            if(!startDate || !endDate) return false;
            return Math.round(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24)); 
        }else return false;
    }
    
    //Return Age of a person
    //FORMAT DATE - YYYY-MM-DD
    //Return number | false
    static getAge(bornday: string, actualDate: Date = new Date()): number|false{
        if(!this.isDate(bornday, "YYYY-MM-DD")) return false;
        const bornDate  = new Date(bornday);
        let age         = actualDate.getFullYear() - bornDate.getFullYear();
        const m         = actualDate.getMonth() - bornDate.getMonth();
        if (m < 0 || (m === 0 && actualDate.getDate()<bornDate.getDate())) age--;
        return age;
    }
    
    //Check date greater than date
    //FORMAT DATE - DD-MM-YYYY
    static dateGreaterThan(start: string, end: string): boolean{
        if(this.isDate(start, "DD-MM-YYYY") && this.isDate(end, "DD-MM-YYYY")){
            const dateInit  = this.returnDateFromString(start, "DD-MM-YYYY")?.getTime();
            const dateEnd   = this.returnDateFromString(end, "DD-MM-YYYY")?.getTime();
            if(!dateInit || !dateEnd) return false;
            return dateInit<dateEnd;
        }else return false;
    }
    
    //Add days to date
    static addDaysToDate(date: string, days: number, format: "DD-MM-YYYY"|"MM-DD-YYYY"|"YYYY-MM-DD"):string|null{
        if(!this.isDate(date, format)) return null;
        const oDate = this.returnDateFromString(date, format);
        if(!oDate) return null;
        oDate.setDate(oDate.getDate() + Number(days));
        return this.returnStringFromDate(oDate, format);
        
    }
    
    //Return String to Object Date
    static returnStringFromDate(date: Date, format: "DD-MM-YYYY"|"MM-DD-YYYY"|"YYYY-MM-DD"): string|null{
        if(format === 'DD-MM-YYYY'){
            return (date.getDate()>9?date.getDate():"0"+date.getDate())+"-"+(date.getMonth()+1>9?date.getMonth()+1:"0"+(date.getMonth()+1))+"-"+date.getFullYear();
        }else if(format === 'MM-DD-YYYY'){
            return (date.getMonth()+1>9?date.getMonth()+1:"0"+(date.getMonth()+1))+"-"+(date.getDate()>9?date.getDate():"0"+date.getDate())+"-"+date.getFullYear();
        }else if(format === 'YYYY-MM-DD'){
            return date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:"0"+(date.getMonth()+1))+"-"+(date.getDate()>9?date.getDate():"0"+date.getDate());
        }else return null;
    }
    
    //Return object date to string
    static returnDateFromString(date: string, format: "DD-MM-YYYY"|"MM-DD-YYYY"|"YYYY-MM-DD"): Date|null{
        if(!this.isDate(date, format)) return null;
        const a_date = date.split("-");
        if(format === 'DD-MM-YYYY'){
            return new Date(a_date[2]+'-'+a_date[1]+'-'+a_date[0]+'T00:00:00');
        }else if( format === 'MM-DD-YYYY'){
            return new Date(a_date[2]+'-'+a_date[0]+'-'+a_date[1]+'T00:00:00');
        }else if( format === 'YYYY-MM-DD'){
            return new Date(a_date[0]+'-'+a_date[1]+'-'+a_date[2]+'T00:00:00');
        }
        return null;
    }
    
    //Return String of Hour to Object date
    static returnHourFromDate(date: Date, format: 'HH:MM'|'HH:MM:SS'): string{
        switch(format){
            case 'HH:MM':
                return (date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
            case 'HH:MM:SS':
                return (date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes()+':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
            default:
                return '';
        }
    }
    
    static YMDtoDMY(date: string): string|null{
        return this.returnStringFromDate(this.returnDateFromString(date, "YYYY-MM-DD")??new Date(),"DD-MM-YYYY");
    }
    static DMYtoYMD(date: string): string|null{
        return this.returnStringFromDate(this.returnDateFromString(date, "DD-MM-YYYY")??new Date(),"YYYY-MM-DD");
    }
    
    //Get Days to month
    static calDaysMonth(month: number, year: number):number{
        return new Date(year, month, 0).getDate();
    }
}


