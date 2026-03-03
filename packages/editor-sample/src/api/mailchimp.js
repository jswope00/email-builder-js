var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
/**
 * Fetch all audiences (lists)
 */
export function fetchAudiences() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/mailchimp/audiences`);
        if (!response.ok) {
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to fetch audiences: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Fetch segments for a specific audience
 */
export function fetchSegments(audienceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/mailchimp/audiences/${audienceId}/segments`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Audience "${audienceId}" not found`);
            }
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to fetch segments: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Fetch recent campaigns for a specific audience
 */
export function fetchCampaigns(audienceId_1) {
    return __awaiter(this, arguments, void 0, function* (audienceId, count = 10) {
        const response = yield fetch(`${API_URL}/mailchimp/audiences/${audienceId}/campaigns?count=${count}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Audience "${audienceId}" not found`);
            }
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to fetch campaigns: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Create and send a campaign to Mailchimp
 */
export function sendCampaign(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/mailchimp/campaigns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to send campaign: ${response.statusText}`);
        }
        return response.json();
    });
}
//# sourceMappingURL=mailchimp.js.map