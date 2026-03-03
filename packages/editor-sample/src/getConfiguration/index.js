var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import EMPTY_EMAIL_MESSAGE from './sample/empty-email-message';
import { fetchTemplate } from '../api/templates';
/**
 * Synchronous configuration loader (for backward compatibility)
 * For API templates, use getConfigurationAsync instead
 */
export default function getConfiguration(template) {
    if (template.startsWith('#template/')) {
        // API templates require async loading - return empty for now
        // The actual loading will be handled by getConfigurationAsync
        return EMPTY_EMAIL_MESSAGE;
    }
    if (template.startsWith('#code/')) {
        const encodedString = template.replace('#code/', '');
        const configurationString = decodeURIComponent(atob(encodedString));
        try {
            return JSON.parse(configurationString);
        }
        catch (_a) {
            console.error(`Couldn't load configuration from hash.`);
        }
    }
    return EMPTY_EMAIL_MESSAGE;
}
/**
 * Async configuration loader (for API templates)
 */
export function getConfigurationAsync(template) {
    return __awaiter(this, void 0, void 0, function* () {
        if (template.startsWith('#template/')) {
            const slug = template.replace('#template/', '');
            try {
                const response = yield fetchTemplate(slug);
                return response.configuration;
            }
            catch (error) {
                console.error(`Failed to load template "${slug}":`, error);
                return EMPTY_EMAIL_MESSAGE;
            }
        }
        // For non-API templates, return synchronously
        return getConfiguration(template);
    });
}
//# sourceMappingURL=index.js.map