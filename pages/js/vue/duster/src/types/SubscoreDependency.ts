interface SubscoreDependency {
    label: string
    duster_field_name: string
    aggregates?: Array<string>
    value_type?: string
    redcap_field_type?: string
    redcap_field_note?: string |  null
    redcap_options?: string | null
}


export default SubscoreDependency;
