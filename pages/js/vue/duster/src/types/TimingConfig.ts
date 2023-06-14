import type TextValuePair from "@/types/TextValuePair";
import type {MenuOption} from "@/types/TextValuePair";

import type {BasicConfig} from "@/types/FieldConfig";

interface TimingConfig extends BasicConfig {
    type: TIMING_TYPE // this is different from value_type since it also includes interval
    event_type?: EVENT_TYPE
    rp_date: string | undefined
    interval: TimingInterval | undefined
    preposition?: string
}

export type EVENT_TYPE = "start" | "end" | "event"
export type TIMING_TYPE = "datetime" |  "date" | "interval" | undefined
export const START_TIME_TYPE_OPTIONS:Array<MenuOption> =  [
    {text: 'Specific Date & Time', value: 'datetime', tooltip: 'Collection starts at specific date and time'},
    {text: "Specific Date", value: "date", tooltip: 'Collection starts at 00:00:00 of the specified day'},
    {text: "Time relative to End", value: "interval", tooltip: 'If the end is a date time, collection start' +
            ' specified number of hours before end.  If the end is a date with no specific time, collection starts' +
            ' specified number of calendar days before end.'}
]

export const END_TIME_TYPE_OPTIONS:Array<MenuOption> = [
    {text: 'Specific Date & Time', value: 'datetime', tooltip: 'Collection ends at specific date and time'},
    {text: "Specific Date", value: "date", tooltip: 'Collection ends at 23:59:00 of the specified day'},
    {text: "Time relative to Start", value: "interval", tooltip: 'If the start is a date time, collection ends' +
            ' specified number of hours after start.  If the start is a date with no specific time, collection ends' +
            ' specified number of calendar days after start.'}
]

export interface TimingInterval {
    label?: string
    type: INTERVAL_TYPE
    length: number | undefined
}

export interface RepeatTimingInterval extends TimingInterval {
    start_instance : BasicConfig
    end_instance : BasicConfig
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
    redcap_field_type: "text",
    value_type: "datetime",
    interval: {...INIT_TIMING_INTERVAL},
    phi: "t"
}
export default TimingConfig;
