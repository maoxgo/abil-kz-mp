import { getCustomText } from './qkUtils';
export function generateHtml(info, originData, currPage, extendData, showGuest, customTypes, fonts) {
    const body = createBody(info, currPage, extendData, showGuest, customTypes);
    const head = createHead(fonts);
    const html = `<!DOCTYPE html>
    <html> 
      ${head}
      ${body}
    </html>`;
    return html;
}

function createBody(info, currPage, extendData, showGuest, customTypes) {
    let rows = '';

    for (let index = 0; index < currPage.elements.length; index++) {
        const item = currPage.elements[index];

        if (item.elName == 'qk-image') {
            rows += createImageElement(info, item, extendData);
        } else if (item.elName == 'qk-text') {
            rows += createTextElement(info, item, showGuest, customTypes);
        }
    }

    return `<body >
            <div class="container">
              ${rows}
            </div>
          </body>`;
}

function createHead(fonts) {
    let fontStyles = '';
    fonts.forEach((font) => {
        const str = `@font-face {
      font-family: "${font.code}";
      src: url(${font.fileUrl});
    }\n`;
        fontStyles += str;
    }); // const fontStyles = fonts.filter(font => {
    //   return
    // }).join('\n')
    // console.log(fontStyles)
    // fontScript = `<script>
    //     const fontArrJSON = ${JSON.stringify(fonts)};
    //   </script>`

    const head = `<head>
      <meta charset="utf8">
      
      <style type="text/css"> 
        ${fontStyles}
        body {
          font-family: Helvetica Neue,Helvetica,'微软雅黑', Arial, sans-serif;
        }
        body {
          margin:0;
          padding:0;
        }
        .container {
          position:absolute;
          left:0;
          right:0;
        }
        .qk-text span {
          white-space: pre;
        }
        .qk-image img {
          display: block;
          width: 100%;
          height: 100%;
        }
      </style>
    <head>`;
    return head;
}

function createTextElement(info, item, showGuest, customTypes) {
    const styleStr = styleObjToStr(getCommonStyle(item.commonStyle || {}));
    let currText = '';

    if (info && item) {
        const { propsValue } = item;

        if (propsValue) {
            if (propsValue.isCustom) {
                currText = getCustomText(propsValue, info, customTypes, showGuest);
            }
        }
    } // if (!currText) {
    //   currText = item.propsValue.text
    // }
    // if (item.propsValue.hasPrefix) {
    //   currText = item.propsValue.prefix + currText
    // }
    // <span>${currText}</span>

    return `<div style="${styleStr}" class="qk-text" >
      
      ${currText}
    </div>\n`;
}

function createImageElement(info, item, extendData) {
    const styleStr = styleObjToStr(getCommonStyle(item.commonStyle || {}));
    const curr = extendData[item.uuid];
    let imageSrc = '';

    if (curr) {
        imageSrc = curr.imageSrc;
    }

    if (!imageSrc) {
        imageSrc = item.propsValue.imageSrc;
    }

    return `<div style="${styleStr}" class="qk-image" ><img src="${imageSrc}"></img></div>\n`;
}

export const styleObjToStr = function (styleObj) {
    let styleStr = '';

    for (const key in styleObj) {
        styleStr += `${toMidLine(key)}:${styleObj[key]};`;
    }

    return styleStr;
}; // 下划线转换驼峰

function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
} // 驼峰转换下划线

function toMidLine(name) {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase();
} // 驼峰转换中划线

function toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function getCommonStyle(styleObj) {
    const needUnitStr = [
        'width',
        'height',
        'top',
        'left',
        'right',
        'bottom',
        'paddingTop',
        'paddingLeft',
        'paddingRight',
        'paddingBottom',
        'marginTop',
        'marginLeft',
        'marginRight',
        'marginBottom',
        'borderWidth',
        'fontSize',
        'borderRadius',
        'letterSpacing'
    ];
    const style = {};

    for (const key in styleObj) {
        // if (key == 'fontWeight') {
        //   continue
        // }
        if (needUnitStr.includes(key)) {
            style[key] = styleObj[key] + 'px';
        } else {
            style[key] = styleObj[key];
        }
    }

    style.transform = `rotate(${style.rotate}deg)`;
    style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : '';
    return style;
}
