import { describe, expect, it } from '@jest/globals';

import { parseQuestionsFromTargetId, parseRheumIqQuizXml } from '.';

const SAMPLE_QUIZ_XML = `<response>
<item key="0">
<id>97</id>
<label>RheumIQ Weekly Quiz Jun - 19</label>
<questions_target_id>
<![CDATA[ <div class="item-list"><ul><li>Per the 2026 EULAR vaccination recommendations, holding methotrexate for how long post-influenza vaccination improves humoral responses?</li><li>True or False: RA-associated interstitial lung disease is considered one of the few RA outcomes that has not improved in the biologic era.</li><li>True or False: Current guidelines for peripheral SpA recommend initiating treatment with TNF inhibitors before trying NSAIDs or conventional synthetic DMARDs.</li></ul></div> ]]>
</questions_target_id>
<field_sponsored_text/>
<quiz_link>https://rheumnow.com/game/97/start</quiz_link>
</item>
</response>`;

describe('parseQuestionsFromTargetId', () => {
  it('splits CDATA HTML list items into separate questions', () => {
    const html =
      '<div class="item-list"><ul><li>Question one?</li><li>Question two?</li></ul></div>';

    expect(parseQuestionsFromTargetId(html)).toEqual(['Question one?', 'Question two?']);
  });

  it('handles entity-encoded markup', () => {
    const encoded = '&lt;ul&gt;&lt;li&gt;Question one?&lt;/li&gt;&lt;li&gt;Question two?&lt;/li&gt;&lt;/ul&gt;';

    expect(parseQuestionsFromTargetId(encoded)).toEqual(['Question one?', 'Question two?']);
  });
});

describe('parseRheumIqQuizXml', () => {
  it('parses quiz metadata and all li questions from feed XML', () => {
    const items = parseRheumIqQuizXml(SAMPLE_QUIZ_XML, 1, 10);

    expect(items).toHaveLength(1);
    expect(items[0].label).toBe('RheumIQ Weekly Quiz Jun - 19');
    expect(items[0].quizLink).toBe('https://rheumnow.com/game/97/start');
    expect(items[0].questions).toEqual([
      'Per the 2026 EULAR vaccination recommendations, holding methotrexate for how long post-influenza vaccination improves humoral responses?',
      'True or False: RA-associated interstitial lung disease is considered one of the few RA outcomes that has not improved in the biologic era.',
      'True or False: Current guidelines for peripheral SpA recommend initiating treatment with TNF inhibitors before trying NSAIDs or conventional synthetic DMARDs.',
    ]);
  });

  it('limits rendered questions to numberOfQuestions', () => {
    const items = parseRheumIqQuizXml(SAMPLE_QUIZ_XML, 1, 1);

    expect(items[0].questions).toEqual([
      'Per the 2026 EULAR vaccination recommendations, holding methotrexate for how long post-influenza vaccination improves humoral responses?',
    ]);
  });
});
