import type Subscore from "@/types/Subscore"

interface FieldMetadata {
    label: string
    duster_field_name: string
    category: string
    phi?: string | undefined
    value_type?: string
    redcap_field_type?: string
    redcap_field_name?: string
    redcap_field_note?: string | null
    redcap_options?: string | null
    subscores?: Array<Subscore> | null
    aggregate_type?: AGGREGATE_TYPE
    aggregates?: Array<Object>
    selected?: boolean,
    visible?: boolean
}

export type AGGREGATE_TYPE = "default" | "custom"
export type VALUE_TYPE = "numeric" | "text"
export type REDCAP_FIELD_TYPE = "text"
export type PHI = "t" | "f" | ""
export type CATEGORY = "demographics" | "labs" | "vitals" | "scores" | "outcomes" | "clinical_dates"


export default FieldMetadata;
