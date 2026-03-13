import React from 'react';

// Plugins: registry is source of truth for block types, endpoints, titles
import {
  getBlockTitleByType,
  getEndpointByType,
  getPlugin,
  getPluginsList,
  XML_FEED_API_BASE_URL,
} from './plugins/registry';
export type { XmlFeedPlugin } from './plugins/types';
export {
  getBlockTitleByType,
  getEndpointByType,
  getPlugin,
  getPluginsList,
  XML_FEED_API_BASE_URL,
} from './plugins/registry';

import {
  FIELD_TYPE_OPTIONS,
  getDefaultFieldTypeForName,
  UniversalXmlFeedPropsDefaults,
  UniversalXmlFeedPropsSchema,
  type FieldTypeValue,
  type UniversalXmlFeedProps,
} from './schema';
export { FIELD_TYPE_OPTIONS, getDefaultFieldTypeForName, UniversalXmlFeedPropsSchema, UniversalXmlFeedPropsDefaults };
export type { FieldTypeValue, UniversalXmlFeedProps };

import { parseXmlToFieldNames, parseXmlToItems } from './parseXml';
export { parseXmlToFieldNames, parseXmlToItems };

export { default as XmlFeedSidebarPanel } from './panel/XmlFeedSidebarPanel';
export type { XmlFeedSidebarPanelProps } from './panel/XmlFeedSidebarPanel';

function stringValue(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  return String(val);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Strip HTML tags and decode entities so date/author show as plain text (e.g. "Mar 05, 2026"). */
function stripHtmlToPlainText(s: string): string {
  if (!s || typeof s !== 'string') return '';
  const decoded = s
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'");
  return decoded.replace(/<[^>]*>/g, '').trim();
}

/** CSS for Promoted Survey block: poll/survey markup from xml-example (scoped to .universal-xml-feed-promoted-survey). */
const PROMOTED_SURVEY_CSS = `
.universal-xml-feed-promoted-survey .poll-view .poll dd { display: none; }
.universal-xml-feed-promoted-survey .poll .poll-question {
  font-size: 18px;
  font-weight: 500;
  line-height: 20pt;
  color: #0b3c5d;
  margin: 0 0 20px 0;
  padding: 16px 16px 20px 16px;
}
.universal-xml-feed-promoted-survey .view-promoted-survey-result .views-field-nothing {
  background: #ffffff;
  border: 1px solid #e6edf5;
  border-radius: 16px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  overflow: clip;
  position: relative;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  transform-style: preserve-3d;
  padding: 16px 16px 0 16px;
  padding-bottom: 40px;
}
.universal-xml-feed-promoted-survey .poll .chart-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid #e6edf5;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
}
.universal-xml-feed-promoted-survey .poll .chart-wrap .choice-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #1b6fae;
  display: grid;
  place-items: center;
  flex: 0 0 18px;
}
.universal-xml-feed-promoted-survey .poll .chart-wrap .chart-percent-title {
  font-weight: 600;
  color: #0f2742;
}
.universal-xml-feed-promoted-survey .poll .total { display: none; }
.universal-xml-feed-promoted-survey .survey-result-wrap .submit-btn,
.universal-xml-feed-promoted-survey .submit-btn {
  text-decoration: none;
  background: #1585FE;
  width: 180px;
  display: block;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 15px 0;
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 16px;
  font-family: 'Poppins', sans-serif !important;
}
.universal-xml-feed-promoted-survey .survey-result-wrap p {
  text-align: center;
  color: #7927A0;
}
/* Vote form variant (poll with .vote-form: True/False choices) */
.universal-xml-feed-promoted-survey .poll .vote-form .poll-question {
  font-size: 18px;
  font-weight: 500;
  line-height: 20pt;
  color: #0b3c5d;
  margin: 0 0 16px 0;
  padding: 0;
}
.universal-xml-feed-promoted-survey .poll .vote-form .fieldset-wrapper {
  margin: 0 0 16px 0;
  padding: 0;
}
.universal-xml-feed-promoted-survey .poll .vote-form .form-item-choice,
.universal-xml-feed-promoted-survey .poll .vote-form .js-form-item.form-item-choice {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid #e6edf5;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #0f2742;
  font-family: 'Poppins', sans-serif;
}
.universal-xml-feed-promoted-survey .poll .vote-form .class-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #1b6fae;
  display: inline-block;
  flex: 0 0 18px;
}
.universal-xml-feed-promoted-survey .poll .vote-form .class-icon.hide {
  display: inline-block;
}
.universal-xml-feed-promoted-survey .poll .vote-form .visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.universal-xml-feed-promoted-survey .poll .vote-form .form-actions {
  margin: 0;
  padding: 0;
}
`;

/** Block-type-specific styles (Video, Therapeutic Update, News Panel, Blog, Daily Download, etc.). */
const BLOCK_TYPE_CSS = `
/* Daily Download: button-style link */
.universal-xml-feed-block.universal-xml-feed-DailyDownloadXml .download-btn-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #1585fe;
  color: #ffffff !important;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
}
.universal-xml-feed-block.universal-xml-feed-DailyDownloadXml .download-btn-link:hover {
  background-color: #489ffe;
  color: #ffffff !important;
}
/* Therapeutic Update: sponsored author (when .author-sponsored is applied via field) */
.universal-xml-feed-block.universal-xml-feed-TherapeuticUpdateXml .author-sponsored {
  color: #800080;
  font-weight: bold;
}
/* News Panel: tighter table-style spacing for list items */
.universal-xml-feed-block.universal-xml-feed-NewsPanelXml .universal-xml-feed-item {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}
/* Blog / Featured Story: same as default, ensure link color */
.universal-xml-feed-block.universal-xml-feed-BlogXml a:not(.download-btn-link),
.universal-xml-feed-block.universal-xml-feed-FeaturedStoryXml a:not(.download-btn-link) {
  color: #1585fe;
}
.universal-xml-feed-block.universal-xml-feed-VideoXml a,
.universal-xml-feed-block.universal-xml-feed-VideoPosterBlock a {
  color: inherit;
}
`;

export function UniversalXmlFeed({ style, props: propsData }: UniversalXmlFeedProps) {
  const url = propsData?.url ?? UniversalXmlFeedPropsDefaults.url;
  const blockType = propsData?.blockType ?? UniversalXmlFeedPropsDefaults.blockType;
  const title =
    propsData?.title != null && propsData.title !== ''
      ? propsData.title
      : getBlockTitleByType(blockType);
  const displayBlockTitle = propsData?.displayBlockTitle ?? UniversalXmlFeedPropsDefaults.displayBlockTitle;
  const fieldMapping = propsData?.fieldMapping ?? UniversalXmlFeedPropsDefaults.fieldMapping;
  const feedSlices = propsData?.feedSlices ?? UniversalXmlFeedPropsDefaults.feedSlices;
  const activeSliceIndex = Math.max(0, propsData?.activeSliceIndex ?? UniversalXmlFeedPropsDefaults.activeSliceIndex);
  const rawPreviewItems =
    feedSlices && feedSlices.length > 0
      ? (feedSlices[Math.min(activeSliceIndex, feedSlices.length - 1)]?.items ?? [])
      : (propsData?.previewItems ?? UniversalXmlFeedPropsDefaults.previewItems ?? []);
  const numberOfItems = propsData?.numberOfItems ?? UniversalXmlFeedPropsDefaults.numberOfItems;
  const previewItems =
    numberOfItems > 0 ? rawPreviewItems.slice(0, numberOfItems) : rawPreviewItems;

  const padding = style?.padding;
  const wrapperStyle: React.CSSProperties = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (!url) {
    const displayTitle = (displayBlockTitle && title) ? title : (displayBlockTitle && blockType ? getBlockTitleByType(blockType) : null);
    return (
      <div style={wrapperStyle}>
        {displayTitle && (
          <h2
            style={{
              fontSize: '18px',
              marginBottom: '12px',
              color: '#333',
              textTransform: 'uppercase',
              borderLeft: '4px solid #1585fe',
              paddingLeft: '10px',
              lineHeight: 1.2,
              margin: '0 0 16px 0',
            }}
          >
            {displayTitle}
          </h2>
        )}
        <div
          style={{
            border: '1px dashed #ccc',
            textAlign: 'center',
            padding: '20px',
            color: '#666',
          }}
        >
          {blockType ? 'Loading feed…' : 'Choose block type in the right panel.'}
        </div>
      </div>
    );
  }

  if (previewItems.length > 0) {
    const fieldOrder = propsData?.fieldOrder ?? UniversalXmlFeedPropsDefaults.fieldOrder;
    const fieldWeights = propsData?.fieldWeights ?? UniversalXmlFeedPropsDefaults.fieldWeights;
    const mapping = fieldMapping ?? {};
    const visible = (name: string) => mapping[name] && mapping[name] !== 'doNotShow';
    let orderedNames =
      fieldOrder && fieldOrder.length > 0
        ? [
            ...fieldOrder.filter((name) => visible(name)),
            ...Object.keys(mapping).filter((name) => visible(name) && !fieldOrder.includes(name)),
          ]
        : Object.keys(mapping).filter((name) => visible(name));
    if (fieldWeights && Object.keys(fieldWeights).length > 0) {
      orderedNames = [...orderedNames].sort(
        (a, b) => (fieldWeights[a] ?? 999) - (fieldWeights[b] ?? 999),
      );
    }
    const mappingEntries: [string, string][] = orderedNames.map((name) => [name, mapping[name]]);
    const contentLinkField = mappingEntries.find(([, t]) => t === 'contentLink')?.[0];
    const titleField = mappingEntries.find(([, t]) => t === 'title')?.[0];
    const showPlayIcon = blockType === 'VideoPosterBlock' || blockType === 'VideoXml';
    const playIconSpan = showPlayIcon ? (
      <span style={{ marginRight: '6px', color: '#1585fe' }}>▶</span>
    ) : null;

    const isGems = blockType === 'Gems';
    const gemsBorderColor = '#a8bed4';
    const gemsBgColor = 'rgba(168, 190, 212, 0.3)';
    const gemsTextColor = '#2c3e50';
    const gemsAccentColor = '#4a6fa5';
    const blockTitleStyle: React.CSSProperties = isGems
      ? {
          fontSize: '22px',
          marginBottom: '14px',
          color: gemsTextColor,
          textTransform: 'none',
          borderLeft: `4px solid ${gemsBorderColor}`,
          paddingLeft: '12px',
          lineHeight: 1.3,
          margin: '0 0 20px 0',
          fontStyle: 'italic',
        }
      : {
          fontSize: '18px',
          marginBottom: '12px',
          color: '#333',
          textTransform: 'uppercase',
          borderLeft: '4px solid #1585fe',
          paddingLeft: '10px',
          lineHeight: 1.2,
          margin: '0 0 16px 0',
        };
    const getItemWrapperStyle = (index: number): React.CSSProperties =>
      isGems
        ? {
            marginBottom: 28,
            padding: '18px 18px 20px 20px',
            borderLeft: `3px solid ${gemsBorderColor}`,
            backgroundColor: gemsBgColor,
            borderRadius: '0 4px 4px 0',
          }
        : {
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
          };
    const gemsTitleFontSize = '22px';
    const gemsBodyFontSize = '18px';
    const titleStyle: React.CSSProperties = isGems
      ? { margin: '0 0 10px 0', fontSize: gemsTitleFontSize, lineHeight: 1.45, color: gemsTextColor, fontStyle: 'italic' }
      : { margin: '0 0 8px 0', fontSize: '18px', lineHeight: 1.4, color: '#333' };
    const bodyContentStyle = {
      fontSize: '14px',
      lineHeight: 1.5,
      color: 'rgb(102, 102, 102)',
    } as const;
    const textStyle: React.CSSProperties = isGems
      ? { marginBottom: 6, fontSize: gemsBodyFontSize, lineHeight: 1.5, color: gemsTextColor }
      : blockType === 'FeaturedStoryXml'
        ? { marginBottom: 4 }
        : { marginBottom: 4, ...bodyContentStyle };
    const blockStyle: React.CSSProperties = isGems
      ? { marginBottom: 10 }
      : { marginBottom: 8 };
    /** Same as in block-featured-story-xml, block-blog-xml: author (bold) and date on one line with bullet. */
    const authorDateLineStyle: React.CSSProperties = {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px',
    };

    const isPromotedSurvey = blockType === 'PromotedSurveyXml';
    const isDailyDownload = blockType === 'DailyDownloadXml';
    const blockWrapperClass = `universal-xml-feed-block universal-xml-feed-${blockType}`;
    const mainContent = (
      <div className={blockWrapperClass} style={wrapperStyle}>
        {displayBlockTitle && title && (
          <h2 style={blockTitleStyle}>
            {title}
          </h2>
        )}
        {previewItems.map((item, index) => {
          const record = item as Record<string, unknown>;
          const linkUrl = contentLinkField ? stringValue(record[contentLinkField]) : '';
          const titleVal = titleField ? stringValue(record[titleField]) : '';

          const renderField = (fieldName: string, fieldType: string, val: string, key: string) => {
            if (fieldType === 'doNotShow' || !val) return null;
            if (fieldType === 'contentLink') return null;
            if (fieldType === 'link') {
              return (
                <div key={key} style={textStyle}>
                  <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: isGems ? gemsAccentColor : '#1585fe' }}>
                    {escapeHtml(val)}
                  </a>
                </div>
              );
            }
            if (fieldType === 'title') {
              const titleNode = (
                <h3 style={titleStyle}>
                  {playIconSpan}
                  {escapeHtml(val)}
                </h3>
              );
              if (linkUrl) {
                return (
                  <div key={key} style={blockStyle}>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {titleNode}
                    </a>
                  </div>
                );
              }
              return (
                <div key={key} style={blockStyle}>
                  {titleNode}
                </div>
              );
            }
            if (fieldType === 'image' || fieldType === 'imageWithContentLink') {
              const adDimensions = getPlugin(blockType)?.imageDimensions;
              const imgStyle: React.CSSProperties = adDimensions
                ? { width: adDimensions.width, height: adDimensions.height, display: 'block', marginBottom: 12, borderRadius: 4 }
                : { width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 };
              const img = (
                <img
                  src={val}
                  alt={titleVal || ''}
                  style={imgStyle}
                />
              );
              if (fieldType === 'imageWithContentLink' && linkUrl) {
                return (
                  <div key={key} style={textStyle}>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {img}
                    </a>
                  </div>
                );
              }
              return (
                <div key={key} style={textStyle}>
                  {img}
                </div>
              );
            }
            if (fieldType === 'html') {
              return (
                <div key={key} style={textStyle} dangerouslySetInnerHTML={{ __html: val }} />
              );
            }
            return (
              <div key={key} style={textStyle}>
                {escapeHtml(val)}
              </div>
            );
          };

          if (Object.keys(fieldMapping).length === 0) {
            return (
              <div
                key={index}
                style={{
                  marginBottom: 16,
                  borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
                  paddingBottom: 16,
                }}
              >
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 4 }}>
                    {escapeHtml(stringValue(v))}
                  </div>
                ))}
              </div>
            );
          }

          const authorDateStyle = isGems
            ? { ...authorDateLineStyle, color: gemsTextColor }
            : authorDateLineStyle;
          const authorEntries = mappingEntries.filter(([, t]) => t === 'author');
          const dateEntry = mappingEntries.find(([, t]) => t === 'date');
          const authorLine = authorEntries
            .map(([name]) => stripHtmlToPlainText(stringValue(record[name])))
            .filter(Boolean)
            .join(', ');
          const dateText = dateEntry ? stripHtmlToPlainText(stringValue(record[dateEntry[0]])) : '';
          const hasAuthorDateLine = !!(authorLine || dateText);

          const fieldNodes: React.ReactNode[] = [];
          let authorDateLineRendered = false;
          mappingEntries.forEach(([fieldName, fieldType], i) => {
            if (fieldType === 'author' || fieldType === 'date') {
              if (hasAuthorDateLine && !authorDateLineRendered) {
                authorDateLineRendered = true;
                const isSponsored =
                  blockType === 'TherapeuticUpdateXml' &&
                  (stringValue(record['field_rxu_is_sponsored']).toLowerCase() === 'on' || record['field_rxu_is_sponsored'] === '1');
                const authorNode = authorLine ? (
                  isSponsored ? (
                    <span className="author-sponsored" style={{ fontWeight: 'bold' }}>{authorLine}</span>
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{authorLine}</span>
                  )
                ) : null;
                fieldNodes.push(
                  <div key="author-date-line" style={authorDateStyle}>
                    {authorNode}
                    {authorLine && dateText && <span style={{ margin: '0 8px' }}>•</span>}
                    {dateText && <span>{dateText}</span>}
                  </div>,
                );
              }
              return;
            }
            const val = stringValue(record[fieldName]);
            const node = renderField(fieldName, fieldType, val, fieldName);
            if (node != null) fieldNodes.push(<React.Fragment key={fieldName}>{node}</React.Fragment>);
          });

          const plugin = getPlugin(blockType);
          const showAdLabel = plugin?.showAdvertisementLabel;
          const trackingField = plugin?.trackingCodeField;
          const trackingHtml = trackingField ? stringValue(record[trackingField]) : '';
          return (
            <div key={index} className="universal-xml-feed-item" style={getItemWrapperStyle(index)}>
              {fieldNodes}
              {showAdLabel && (
                <>
                  {trackingHtml && (
                    <div style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: trackingHtml }} />
                  )}
                  <div className="universal-xml-feed-ad-label" style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                    Advertisement
                  </div>
                </>
              )}
              {isDailyDownload && linkUrl && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn-link"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#1585fe',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  Download
                </a>
              )}
            </div>
          );
        })}
      </div>
    );

    if (isPromotedSurvey) {
      return (
        <>
          <style dangerouslySetInnerHTML={{ __html: PROMOTED_SURVEY_CSS }} />
          <style dangerouslySetInnerHTML={{ __html: BLOCK_TYPE_CSS }} />
          {getPlugin(blockType)?.styles && (
            <style dangerouslySetInnerHTML={{ __html: getPlugin(blockType)!.styles! }} />
          )}
          <div className="universal-xml-feed-promoted-survey">
            {mainContent}
          </div>
        </>
      );
    }
    const pluginStyles = getPlugin(blockType)?.styles;
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: BLOCK_TYPE_CSS }} />
        {pluginStyles && <style dangerouslySetInnerHTML={{ __html: pluginStyles }} />}
        {mainContent}
      </>
    );
  }

  // url is set but previewItems is empty (e.g. still loading or no items in feed)
  const displayTitle = (displayBlockTitle && title) ? title : (displayBlockTitle && blockType ? getBlockTitleByType(blockType) : null);
  return (
    <div style={wrapperStyle}>
      {displayTitle && (
        <h2
          style={{
            fontSize: '18px',
            marginBottom: '12px',
            color: '#333',
            textTransform: 'uppercase',
            borderLeft: '4px solid #1585fe',
            paddingLeft: '10px',
            lineHeight: 1.2,
            margin: '0 0 16px 0',
          }}
        >
          {displayTitle}
        </h2>
      )}
      <div
        style={{
          border: '1px dashed #ccc',
          textAlign: 'center',
          padding: '20px',
          color: '#666',
        }}
      >
        No items in feed.
      </div>
    </div>
  );
}
