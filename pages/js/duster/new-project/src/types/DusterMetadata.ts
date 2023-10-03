import type FieldMetadata from "@/types/FieldMetadata"

interface DusterMetadata {
    demographics: Array<FieldMetadata>,
    labs: Array<FieldMetadata>,
    vitals: Array<FieldMetadata>,
    outcomes: Array<FieldMetadata>,
    scores: Array<FieldMetadata>,
    clinical_dates: Array<FieldMetadata>
}

export default DusterMetadata;
