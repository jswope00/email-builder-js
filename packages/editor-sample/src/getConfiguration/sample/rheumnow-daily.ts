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
        "block-1768490815464",
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
              "block-1768489425507",
              "block-1769055697998",
              "block-1769053202422",
              "block-1768351929839",
              "block-1769055833150"
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
        "url": "https://rheumnow.com/admin/featured-story-xml",
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
  },
  "block-1768489425507": {
    "type": "BlogXml",
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
        "url": "https://rheumnow.com/admin/blogs_xml",
        "title": "Blogs",
        "numberOfItems": 3
      }
    }
  },
  "block-1768490815464": {
    "type": "Advertisement72890Xml",
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
        "url": "https://rheumnow.com/admin/email_ad_728_90_xml",
        "numberOfItems": 3
      }
    }
  },
  "block-1769053202422": {
    "type": "Advertisement300250Xml",
    "data": {
      "style": {
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 0,
          "left": 0
        }
      },
      "props": {
        "url": "https://rheumnow.com/admin/email_ad_300_250_xml",
        "numberOfItems": 3
      }
    }
  },
  "block-1769055697998": {
    "type": "DailyDownloadXml",
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
        "url": "https://rheumnow.com/admin/daily_download_xml",
        "title": "Daily Download",
        "numberOfItems": 3
      }
    }
  },
  "block-1769055833150": {
    "type": "Html",
    "data": {
      "style": {
        "fontSize": 16,
        "textAlign": null,
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 0,
          "left": 0
        }
      },
      "props": {
        "contents": "<div style=\"background-color:rgb(10, 61, 98);border-radius:8px;box-sizing:border-box;margin:auto;padding:20px;text-align:center;width:300px;\">\n    <div class=\"text-align-center\" style=\"clear:both;color:#fff;font-family:Arial, sans-serif;font-size:18px;line-height:1.3;margin-bottom:15px;\">\n        <strong style=\"color:#fff;font-family:Arial, sans-serif;font-size:18px;\">How well do you know this week's Rheumatology News?</strong>\n    </div>\n    <div style=\"clear:both;margin:0 auto;max-width:250px;width:250px;\">\n        <img style=\"margin-bottom:10px;\" src=\"https://rheumnow.com/sites/default/files/inline-images/5%20copy.png\" data-entity-uuid=\"cdf41041-8cec-4d19-bc18-fc91fa5b9cc3\" data-entity-type=\"file\" alt=\"Take the RheumIQ Quiz\" width=\"250\" height=\"173\">\n    </div>\n    <div class=\"text-align-center\" style=\"clear:both;color:#fff;font-family:Arial, sans-serif;font-size:18px;line-height:1.3;margin-bottom:15px;\">\n        <strong>Take the RheumIQ Quiz</strong>\n    </div>\n    <div class=\"text-align-center\" style=\"clear:both;\">\n        <a style=\"text-decoration:none;\" href=\"https://rheumnow.com/game\" alt=\"Play RheumIQ\"><span style=\"background-color:#007bff;border-radius:25px;border-style:none;color:white;cursor:pointer;display:inline-block;font-size:16px;padding:10px 30px;\"><strong>Play</strong></span></a>\n    </div>\n</div>"
      }
    }
  }
}

export default RHEUMNOW_DAILY;