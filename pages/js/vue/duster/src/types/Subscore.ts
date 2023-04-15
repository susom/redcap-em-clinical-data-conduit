import type SubscoreDependency from "@/types/SubscoreDependency"

interface Subscore {
    label: string
    duster_field_name: string
    score_duster_field_name: string
    value_type?: string
    redcap_field_name?: string
    redcap_field_type?: string
    redcap_field_note?: string |  null
    redcap_options?: string | null
    dependencies?: Array<SubscoreDependency> | null
}


export default Subscore;
