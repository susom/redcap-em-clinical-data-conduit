import type TimingConfig from "@/types/TimingConfig"
import type {TimingInterval} from "@/types/TimingConfig"
import type FieldMetadata from "@/types/FieldMetadata";
import {INIT_TIMING_CONFIG, INIT_TIMING_INTERVAL} from "@/types/TimingConfig";

interface CollectionWindow {
    label: string
    form_name: string
    type: CWTYPE
    timing_preset?: string | undefined
    timing: {
        start: TimingConfig | undefined
        end: TimingConfig | undefined
        repeat_interval: TimingInterval | undefined
    } | undefined
    aggregate_defaults?: Array<Object> | undefined
    event?: Array<TimingConfig>
    closest_time?: string
    data: {
        labs: Array<FieldMetadata>
        vitals: Array<FieldMetadata>
        outcomes: Array<FieldMetadata>
        scores: Array<FieldMetadata>
    } | undefined
    id?: string
}

export type CWTYPE ="nonrepeating" | "repeating"

export const INIT_COLLECTION_WINDOW: CollectionWindow = {
    label: "Custom Timing",
    form_name: "",
    type: "nonrepeating",
    timing_preset: undefined,
    timing: {
        start: JSON.parse(JSON.stringify(INIT_TIMING_CONFIG)),
        end: JSON.parse(JSON.stringify(INIT_TIMING_CONFIG)),
        repeat_interval: {...INIT_TIMING_INTERVAL}
    },
    aggregate_defaults: undefined,
    event: JSON.parse(JSON.stringify(INIT_TIMING_CONFIG)),
    closest_time: "",
    data: {
        labs:[],
        vitals:[],
        outcomes:[],
        scores:[]
    },
    id: "Undefined"
}

export default CollectionWindow;


