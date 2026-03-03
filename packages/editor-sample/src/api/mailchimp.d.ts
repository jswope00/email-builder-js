export interface Audience {
    id: string;
    name: string;
    member_count: number;
    created_at: string;
    updated_at: string;
}
export interface Segment {
    id: number;
    name: string;
    member_count: number;
    type: string;
    created_at: string;
    updated_at: string;
}
export interface Campaign {
    id: string;
    name: string;
    subject: string;
    status: string;
    send_time: string | null;
    created_at: string;
    recipients: {
        list_id: string;
        list_name: string;
        segment_text: string;
        recipient_count: number;
    };
}
/**
 * Fetch all audiences (lists)
 */
export declare function fetchAudiences(): Promise<Audience[]>;
/**
 * Fetch segments for a specific audience
 */
export declare function fetchSegments(audienceId: string): Promise<Segment[]>;
/**
 * Fetch recent campaigns for a specific audience
 */
export declare function fetchCampaigns(audienceId: string, count?: number): Promise<Campaign[]>;
export interface SendCampaignRequest {
    title: string;
    subject: string;
    fromName: string;
    fromEmail: string;
    replyTo: string;
    listId: string;
    segmentId?: number;
    htmlContent: string;
}
export interface SendCampaignResponse {
    id: string;
    title: string;
    subject: string;
    status: string;
    web_id: string;
}
/**
 * Create and send a campaign to Mailchimp
 */
export declare function sendCampaign(data: SendCampaignRequest): Promise<SendCampaignResponse>;
//# sourceMappingURL=mailchimp.d.ts.map