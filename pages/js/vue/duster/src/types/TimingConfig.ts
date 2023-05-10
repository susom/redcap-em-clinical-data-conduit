import type TextValuePair from "@/types/TextValuePair";
import type {BasicConfig} from "@/types/FieldConfig";

interface TimingConfig extends BasicConfig {
    type: TIMING_TYPE // this is different from value_type since it also includes interval
    event_type?: EVENT_TYPE
    rp_date?: string
    interval?: TimingInterval
    preposition?: string
}

export type EVENT_TYPE = "start" | "end" | "event"
export type TIMING_TYPE = "datetime" |  "date" | "interval" | undefined
export const START_TIME_TYPE_OPTIONS:Array<TextValuePair> =  [
    {text: 'Specific Date & Time', value: 'datetime'},
    {text: "Specific Date", value: "date"},
    {text: "Time relative to End", value: "interval"}
]

export const END_TIME_TYPE_OPTIONS:Array<TextValuePair> = [
    {text: 'Specific Date & Time', value: 'datetime'},
    {text: "Specific Date", value: "date"},
    {text: "Time relative to Start", value: "interval"}
]

export const TIME_TYPE_OPTIONS:Array<TextValuePair> =  [
    {text: 'Specific Date & Time', value: 'datetime'},
    {text: "Specific Date", value: "date"},
    {text: "Relative Date/Time", value: "interval"}
]

export interface TimingInterval {
    label?: string
    type: INTERVAL_TYPE
    length: number | undefined
}

export type INTERVAL_TYPE = "day" |  "hour" | undefined
export const INTERVAL_OPTIONS:Array<TextValuePair> = [
    {text: 'Hours', value: 'hour'},
    {text: "Calendar Day(s)", value: "day"}
]

export const INIT_TIMING_INTERVAL: TimingInterval = {
    label: undefined,
    type: undefined,
    length: undefined
}

export const INIT_TIMING_CONFIG: TimingConfig = {
    type: undefined,
    label: "",
    rp_date: undefined,
    duster_field_name: undefined,
    redcap_field_name: undefined,
    redcap_field_type: "",
    value_type: "",
    interval: {...INIT_TIMING_INTERVAL},
    phi: "t"
}
export default TimingConfig;
