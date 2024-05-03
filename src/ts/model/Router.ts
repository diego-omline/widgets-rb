import * as config from "../config/globalConfig";
import { http } from '../tools/httpRequest';
import { Aux } from '../tools/auxFunctions';

export class Router {

    static async checkWidgetType(params: windowRequest): Promise<void|boolean>{
        let response = await http.fetchJSON(params, config.dirServices+'/checkWidgetType.php');
        if(!response) return Aux.error();
    
        if(response.response === '1'){  
            Router.createScriptHtml(response.route, params);    
        }else{
            Aux.error(response.error_text);
        }
    }
    
    // static checkParams(params: windowRequest): boolean{
    
    //     let errorParam = (p:string) => Aux.error("Param '"+p+"' is required");
    
    //     if(typeof params.id === 'undefined') return errorParam('id');
    //     if(typeof params.type === 'undefined') return errorParam('type');
    //     if(typeof params.token === 'undefined') return errorParam('token');
    
    //     return true;
    // }

    // static async getDataWidget(params: windowRequest): Promise<any>{
    //     return await http.fetchJSON(params, config.dirServices+'/'+params.type+'/get'+Aux.strCapitalize(params.type)+'.php');
    // }
    
    private static createScriptHtml(routes: {string: string}, params: windowRequest): void {
        Object.keys(routes).forEach(key => {
            let type = key as keyof typeof routes;
            document.getElementById('rb-widget-'+type)?.remove();
            document.getElementById('rb-widget-'+type+"-css")?.remove();
    
            let script: HTMLScriptElement = document.createElement('script');
            script.src      = routes[type]+'.js';
            script.id       = 'rb-widget-'+type;
            script.type     = "module";
            script.async    = true;

            (Object.keys(params) as Array<keyof windowRequest>).forEach(key => {
                if(key !== 'type' ) script.setAttribute((key === 'id'?'user':key), params[key]?.toString()??'');
            });
        
            let style: HTMLLinkElement = document.createElement('link');
            style.href  = routes[type]+'.css';
            style.id    = 'rb-widget-'+type+'-css';
            style.rel   = 'stylesheet';
    
            let fjs: HTMLHeadElement = document.getElementsByTagName('head')[0];
            fjs?.insertAdjacentElement("afterbegin", script);
            fjs?.insertAdjacentElement("afterbegin", style);
        });
    }

}