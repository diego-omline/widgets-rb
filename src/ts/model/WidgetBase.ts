import * as config from "../config/globalConfig";
import { Aux } from "../tools/auxFunctions";
import { http } from '../tools/httpRequest';

export class WidgetBase{

    static async getDataWidget(type: keyof typeof config.wConfig.types): Promise<any|false>{
        const script    = document.querySelector(`#rb-widget-${type}`);

        if(!script) return Aux.error('Script promo not found');

        const id        = Number(script.getAttribute('user'));
        const token     = script.getAttribute('token');
        const lang      = script.getAttribute('lang')??undefined;
        const rental    = Number(script.getAttribute('rental'))??undefined;
        const origin    = script.getAttribute('origin')??undefined;

        if(!id || !token) return Aux.error('Browser not supported');

        const response = await WidgetBase.fetchDataWidget({id, token, lang, rental, origin, type});
        if(!response) return Aux.error();

        return response;
    }

    static async fetchDataWidget(params: windowRequest): Promise<any>{
        return await http.fetchJSON(params, `${config.dirServices}/${params.type}/get${Aux.strCapitalize(params.type)}.php`);
    }

    static checkParams(params: windowRequest): boolean{
    
        let errorParam = (p:string) => Aux.error("Param '"+p+"' is required");
    
        if(typeof params.id === 'undefined') return errorParam('id');
        if(typeof params.type === 'undefined') return errorParam('type');
        if(typeof params.token === 'undefined') return errorParam('token');
    
        return true;
    }

    static getHTMLElements(type: keyof typeof config.wConfig.types): HTMLElement[] {
        return [...document.querySelectorAll(config.wConfig.types[type].tag)] as HTMLElement[];
    }

    static setColorBase(background: string, text: string){
        document.documentElement.style.setProperty(`--colorBackground`, background);
        document.documentElement.style.setProperty(`--colorText`, text);
    }
}