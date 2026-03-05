/** Human-readable block type labels and default block header titles for the XML block type select. */
export const BLOCK_TYPE_OPTIONS = [
    { value: 'VideoXml', label: 'Video XML', blockTitle: 'Video XML' },
    { value: 'VideoPosterBlock', label: 'Video Poster Block', blockTitle: 'Poster Hall' },
    { value: 'Gems', label: 'Gems', blockTitle: 'Gems' },
    { value: 'TherapeuticUpdateXml', label: 'Therapeutic Update XML', blockTitle: 'Therapeutic Updates' },
    { value: 'FeaturedStoryXml', label: 'Large Story Block', blockTitle: 'Featured Story' },
    { value: 'NewsPanelXml', label: 'News Panel XML', blockTitle: 'News Panel' },
    { value: 'BlogXml', label: 'Blog XML', blockTitle: 'Blogs' },
    { value: 'Advertisement72890Xml', label: 'Advertisement 728x90 XML', blockTitle: 'Advertisement 728x90' },
    { value: 'Advertisement300250Xml', label: 'Advertisement 300x250 XML', blockTitle: 'Advertisement 300x250' },
    { value: 'ConferenceAdvertisement300250Xml', label: 'Conference Advertisement 300x250 XML', blockTitle: 'Conference Advertisement' },
    { value: 'DailyDownloadXml', label: 'Daily Download XML', blockTitle: 'Daily Download' },
    { value: 'PromotedSurveyXml', label: 'Promoted Survey XML', blockTitle: 'RheumNow Survey' },
];
/** Default block header title for a given block type. */
export function getBlockTitleByType(blockType) {
    var _a;
    if (!blockType)
        return '';
    const opt = BLOCK_TYPE_OPTIONS.find((o) => o.value === blockType);
    return (_a = opt === null || opt === void 0 ? void 0 : opt.blockTitle) !== null && _a !== void 0 ? _a : '';
}
//# sourceMappingURL=blockTypes.js.map