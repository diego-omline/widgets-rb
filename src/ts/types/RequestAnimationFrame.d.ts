export {};

declare global {
    interface ParamsAnimation{
        now_scr: number;
        then_scr: number;
        interval_scr: number;
        delta_scr: number;
        callback?: Function;
    }
}