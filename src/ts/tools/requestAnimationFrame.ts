export class RequestAnimationFrame {

    private params: ParamsAnimation = {
        now_scr: 0,
        then_scr: 0,
        interval_scr: 0,
        delta_scr: 0
    };
    cancelNumber: number = 0;


    constructor(callback: Function, interval: number = 1000, fpi: number = 1) {
        this.params.interval_scr = interval/fpi;
        this.params.callback = callback;
        this.start();
    }

    start(){
        this.params.then_scr = Date.now();
        this.cancelNumber = RequestAnimationFrame.draw_scr(this.params);
    }

    cancel(){
        cancelAnimationFrame(this.cancelNumber);
    }

    static draw_scr(params: ParamsAnimation ) {
        params.now_scr    = Date.now();
        params.delta_scr  = params.now_scr - params.then_scr;
        if (params.delta_scr > params.interval_scr) {
            params.then_scr = params.now_scr - (params.delta_scr % params.interval_scr);
            params.callback!();
        }
        let cancelNumber = requestAnimationFrame(() => RequestAnimationFrame.draw_scr(params));
        return cancelNumber;
    }
}