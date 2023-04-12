import type TextValuePair from "@/types/TextValuePair";

interface TimingConfig {
    type: TIMING_TYPE
    event_type?: EVENT_TYPE
    label?: string
    rp_date?: string | null
    duster_field_name?: string | null
    redcap_field_name?: string | null
    redcap_field_type?: string
    value_type?: string
    interval?: TimingInterval | undefined
    phi?: string,
    preposition?: string,
    id?: string
}

export type EVENT_TYPE = "start" | "end" | "event"
export type TIMING_TYPE = "datetime" |  "date" | "interval" | undefined
export const START_TIME_TYPE_OPTIONS:Array<TextValuePair> =  [
    {text: 'Datetime [yyyy-mm-dd hh:mm:ss]', value: 'datetime'},
    {text: "Date [yyyy-mm-dd]", value: "date"},
    {text: "Interval", value: "interval"}
]

export const END_TIME_TYPE_OPTIONS:Array<TextValuePair> = [
    {text: 'Datetime [yyyy-mm-dd hh:mm:ss]', value: 'datetime'},
    {text: "Date [yyyy-mm-dd]", value: "date"},
    {text: "Interval", value: "interval"}
]

export const TIME_TYPE_OPTIONS:Array<TextValuePair> =  [
    {text: 'Datetime [yyyy-mm-dd hh:mm:ss]', value: 'datetime'},
    {text: "Date [yyyy-mm-dd]", value: "date"},
    {text: "Interval", value: "interval"}
]

export interface TimingInterval {
    label: string | null
    type: INTERVAL_TYPE | null
    length: number | null
}

export type INTERVAL_TYPE = "day" |  "hour" | ""
export const INTERVAL_OPTIONS:Array<TextValuePair> = [
    {text: 'Hours', value: 'hour'},
    {text: "Calendar Day(s)", value: "day"}
]

export const INIT_TIMING_INTERVAL: TimingInterval = {
    label: "None",
    type: null,
    length: null
}

export const INIT_TIMING_CONFIG: TimingConfig = {
    type: undefined,
    label: "Not Configured",
    rp_date: null,
    duster_field_name: null,
    redcap_field_name: null,
    redcap_field_type: "",
    value_type: "",
    interval: {...INIT_TIMING_INTERVAL},
    phi: "t"
}
export default TimingConfig;
