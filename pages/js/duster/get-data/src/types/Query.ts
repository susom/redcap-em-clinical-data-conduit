interface Query{
    query_label: string,
    query_name: string,
    order: number,
    message: string | undefined,
    log_dttm: number | undefined
}

export interface FormQueries {
    form_name: string,
    num_queries: number,
    num_complete: number,
    complete: boolean,
    fail: boolean,
    last_message: string,
    last_logdttm: string,
    queries: any // JsonObject of queries keyed by query_name
}

export interface DataRequestLog {
    data_request_log: FormQueries
}

export default Query;
