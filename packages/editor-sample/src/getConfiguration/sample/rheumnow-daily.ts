import { TEditorConfiguration } from '../../documents/editor/core';

const RHEUMNOW_DAILY: TEditorConfiguration = {
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "borderRadius": 0,
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1768334945842",
        "block-1768335038626",
        "block-1768335072847",
        "block-1768351919257",
        "block-1768334883321"
      ]
    }
  },
  "block-1768334883321": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "text": "Hi I'm John"
      }
    }
  },
  "block-1768334945842": {
    "type": "Image",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        },
        "textAlign": "center"
      },
      "props": {
        "url": "https://rheumnow.com/sites/default/files/rheumnow_logo_white_0_0.png",
        "alt": "RheumNow Logo",
        "linkHref": "https://rheumnow.com",
        "contentAlignment": "middle"
      }
    }
  },
  "block-1768335038626": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "[Email Title]"
      },
      "style": {
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      }
    }
  },
  "block-1768335072847": {
    "type": "Image",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "https://rheumnow.com/sites/default/files/2025-12/7SAN_KEVL_Kevzara_RHM_PMR%20HCP_FirstandOnly_LRNMR_STA_728x90_NA_EN.png",
        "alt": "Sample product",
        "linkHref": null,
        "contentAlignment": "middle"
      }
    }
  },
  "block-1768351919257": {
    "type": "ColumnsContainer",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "fixedWidths": [
          500,
          300,
          null
        ],
        "columnsCount": 2,
        "columnsGap": 16,
        "contentAlignment": "top",
        "columns": [
          {
            "childrenIds": [
              "block-1768403411244",
              "block-1768407011577"
            ]
          },
          {
            "childrenIds": [
              "block-1768354210296",
              "block-1768351929839"
            ]
          },
          {
            "childrenIds": []
          }
        ]
      }
    }
  },
  "block-1768351929839": {
    "type": "VideoXml",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "/email-builder-js/video-sample.xml",
        "title": "Videos",
        "numberOfItems": 3
      }
    }
  },
  "block-1768354210296": {
    "type": "TherapeuticUpdateXml",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "/email-builder-js/therapeutic-update-sample.xml",
        "title": "Therapeutic Updates",
        "numberOfItems": 1
      }
    }
  },
  "block-1768403411244": {
    "type": "FeaturedStoryXml",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "/email-builder-js/featured-story-sample.xml",
        "numberOfItems": 3
      }
    }
  },
  "block-1768407011577": {
    "type": "NewsPanelXml",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24
        }
      },
      "props": {
        "url": "/email-builder-js/news-panel-sample.xml",
        "numberOfItems": 7
      }
    }
  }
}

export default RHEUMNOW_DAILY;