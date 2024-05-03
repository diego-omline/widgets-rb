import { easepick } from '@easepick/core';
import { RangePlugin } from '@easepick/range-plugin';
import { LockPlugin } from '@easepick/lock-plugin';
import { AmpPlugin, DateTime } from '@easepick/bundle';
//import { DateTime } from "@easepick/bundle";


export class DatePicker {

    static bookingCalendar(data: DataBookingCalendar):easepick.Core {



        let datepicker = new easepick.create({
            element: document.querySelector(data.elementSelector) as HTMLElement??'',
            css: [
                'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
                'https://easepick.com/css/demo_hotelcal.css',
                ...data.cssFiles,
            ],
            lang: this.getLang(data.lang),
            plugins: [RangePlugin, LockPlugin, AmpPlugin],
            calendars: this.getNumberCalendars(),
            grid: this.getNumberCalendars(),
            zIndex: 10,
            RangePlugin: {
                tooltipNumber(num) {
                    return num - 1;
                },
                locale: this.getLocaleBookingCalendar(data.lang),
                startDate: data.startRange?new DateTime(data.startRange, 'YYYY-MM-DD'):undefined,
                endDate: data.finishRange?new DateTime(data.finishRange, 'YYYY-MM-DD'):undefined,
            },
            LockPlugin: {
                minDate: (data.initDate?new Date(data.initDate):new Date()),
                maxDate: (data.endDate?new Date(data.endDate):undefined),
                minDays: 2,
                inseparable: true,
            },
            AmpPlugin: this.getAmpPlugin(data.initDate, data.endDate),

        });
        
        datepicker.on("select", (data.selectCallback?data.selectCallback:() => {}));
        datepicker.on("render", () => {
            this.checkPositionCalendar(data.elementSelector);
        });

        this.checkPositionCalendar(data.elementSelector);

        return datepicker;
    }
    

    private static getLang(lang: string){
        switch(lang){
            case 'fr':
                return 'fr-FR';
            case 'de':
                return 'de-DE';
            case 'es':
                return 'es-ES';
            case 'nl':
                return 'nl-NL';
            default:
                return 'en-GB';
        }
    }

    private static getLocaleBookingCalendar(lang: string):  Object{
        switch(lang){
            case 'fr':
                return {
                    one: 'nuit',
                    other: 'nuits',
                };
            case 'de':
                return {
                    one: 'nacht',
                    other: 'nächte',
                };
            case 'es':
                return {
                    one: 'noche',
                    other: 'noches',
                };
            case 'nl':
                return {
                    one: 'nacht',
                    other: 'nachten',
                };
            default:
                return {
                    one: 'night',
                    other: 'nights',
                };
        }
    }

    private static getAmpPlugin(initDate: string|undefined, endDate: string|undefined){
        let minYear: number = (initDate?new Date(initDate).getFullYear():new Date().getFullYear());
        let maxYear: number = (endDate?new Date(endDate).getFullYear():new Date().getFullYear()+10);
        let years: boolean  = (minYear !== maxYear); 
        return {
            dropdown: {
                months: true,
                years,
                minYear,
                maxYear,
            },
        };
    }

    private static getNumberCalendars(): number{
        return window.innerWidth <= 640?1:2;
    }

    private static checkPositionCalendar(selector: string): void{
        let element = document.querySelector(selector) as HTMLElement;
        if(!element) return;
        const heightElement     = element.offsetHeight;
        const margin            = element.parentElement?.style.margin;
        const topElement        = element.getBoundingClientRect().top;
        const height            = window.innerHeight;
        const heightCalendar    = 285;

        document.getElementById(`style-${selector.replace("#", "")}`)?.remove();

        if(topElement >= heightCalendar && height < topElement+heightElement+heightCalendar){
            var style = document.createElement("style");
            style.id = `style-${selector.replace("#", "")}`;
            style.innerHTML = `
                ${selector} ~ .easepick-wrapper{
                    top: -${heightCalendar+heightElement-(margin?parseInt(margin.replace('px','')):0)}px;
                }
            `;
            let fjs: HTMLBodyElement = document.getElementsByTagName('body')[0];
            fjs?.insertAdjacentElement("beforeend", style);
        }
    }

}