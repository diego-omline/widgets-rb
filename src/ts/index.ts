import { Router } from './model/Router';
import { WidgetBase } from './model/WidgetBase';
import { Aux } from './tools/auxFunctions';

window.resabooking = (params: windowRequest): void => {
    if(!WidgetBase.checkParams(params)) return;
    Router.checkWidgetType(params);
};

window.resabooking.get = async (params: windowRequest): Promise<any|false> => {
    if(!WidgetBase.checkParams(params)) return false;
    if(Array.isArray(params.type)) Aux.error(" 'get' only accept type: string");
    return await WidgetBase.fetchDataWidget(params);
}
