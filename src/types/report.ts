interface Report {
    id: string;
    timestamp: Date;
    total_requests: number;
    successful: number;
    failed: number;
    results: Result[];
}

type Result = SuccessReport | FailureReport;

type ParseParams = {
    url: string;
    ads_domains: string[];
}

type ContentType = "text/html" | "application/json"; //add more

type HTTPResponse = {
    status_code: number;
    status_text: string;
    headers: {
        content_type: ContentType;
        content_length: number;
    },
    response_time_ms: number;
}

type Relation = "RESELLER" | "DIRECT";

type MatchedDomains = {
    domain: string;
    exist: boolean;
    relationship_type: Relation;
    publisher_id: string;
    tag_id?: string;
}

type ResponseContent = {
    records_count: number;
    list: string[];
    matches: MatchedDomains;
}

interface BaseResult {
    id: string;
    timestamp: Date;
    parse_params: ParseParams;
}

interface SuccessReport extends BaseResult {
    http: HTTPResponse;
    response_content: ResponseContent;
}

interface FailureReport extends BaseResult {
    error: {
        http_code: number;
        type: string;
        raw_response: string;
    }
}