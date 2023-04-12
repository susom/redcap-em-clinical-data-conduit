import type TimingConfig from "@/types/TimingConfig"
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import type TextValuePair from "@/types/TextValuePair";

interface FieldConfig {
    duster_field_name?: string |  undefined
    redcap_field_name: string |  undefined
    label: string |  undefined
    phi?: string |  undefined
    value_type?: string |  undefined
    redcap_field_type?: string |  undefined
    aggregate?: AGGREGATE_OPTION |  undefined
    aggregate_options?: AggregateOptions |  undefined
    id?: string
}

interface AggregateOptions {
    time?: string
    event?: TimingConfig
}

export type AGGREGATE_OPTION = "max_agg" | "min_agg" | "first_agg" | "last_agg" | "closest_event" | "closest_time"
export const AGGREGATE_OPTIONS: Array<TextValuePair> =[
    {text: "Max", value: "max_agg"},
    {text: "Min", value: "min_agg"},
    {text: "First", value: "first_agg"},
    {text: "Last", value: "last_agg"},
    {text: "Closest Event", value: "closest_event"},
    {text: "Closest Time", value: "closest_time"}
]

export const INIT_FIELD_CONFIG: FieldConfig = {
    duster_field_name: undefined,
    redcap_field_name: undefined,
    label: undefined,
    phi: undefined,
    value_type: undefined,
    redcap_field_type: undefined,
    aggregate: undefined,
    aggregate_options: undefined,
    id: undefined
}

export default FieldConfig;
