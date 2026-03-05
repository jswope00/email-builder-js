/** Human-readable block type labels and default block header titles for the XML block type select. */
export declare const BLOCK_TYPE_OPTIONS: readonly [{
    readonly value: "VideoXml";
    readonly label: "Video XML";
    readonly blockTitle: "Video XML";
}, {
    readonly value: "VideoPosterBlock";
    readonly label: "Video Poster Block";
    readonly blockTitle: "Poster Hall";
}, {
    readonly value: "Gems";
    readonly label: "Gems";
    readonly blockTitle: "Gems";
}, {
    readonly value: "TherapeuticUpdateXml";
    readonly label: "Therapeutic Update XML";
    readonly blockTitle: "Therapeutic Updates";
}, {
    readonly value: "FeaturedStoryXml";
    readonly label: "Large Story Block";
    readonly blockTitle: "Featured Story";
}, {
    readonly value: "NewsPanelXml";
    readonly label: "News Panel XML";
    readonly blockTitle: "News Panel";
}, {
    readonly value: "BlogXml";
    readonly label: "Blog XML";
    readonly blockTitle: "Blogs";
}, {
    readonly value: "Advertisement72890Xml";
    readonly label: "Advertisement 728x90 XML";
    readonly blockTitle: "Advertisement 728x90";
}, {
    readonly value: "Advertisement300250Xml";
    readonly label: "Advertisement 300x250 XML";
    readonly blockTitle: "Advertisement 300x250";
}, {
    readonly value: "ConferenceAdvertisement300250Xml";
    readonly label: "Conference Advertisement 300x250 XML";
    readonly blockTitle: "Conference Advertisement";
}, {
    readonly value: "DailyDownloadXml";
    readonly label: "Daily Download XML";
    readonly blockTitle: "Daily Download";
}, {
    readonly value: "PromotedSurveyXml";
    readonly label: "Promoted Survey XML";
    readonly blockTitle: "RheumNow Survey";
}];
export type XmlBlockTypeValue = (typeof BLOCK_TYPE_OPTIONS)[number]['value'];
/** Default block header title for a given block type. */
export declare function getBlockTitleByType(blockType: string | null | undefined): string;
//# sourceMappingURL=blockTypes.d.ts.map