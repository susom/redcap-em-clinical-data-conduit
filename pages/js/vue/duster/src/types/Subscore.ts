import type {BasicConfig} from "@/types/FieldConfig"
export interface SubscoreDependency extends BasicConfig{
    aggregates?: Array<string>
}

interface Subscore extends BasicConfig{
    score_duster_field_name: string
    dependencies?: Array<SubscoreDependency> | null
}

export default Subscore;
