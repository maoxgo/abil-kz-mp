import moment from 'moment';
export const getCommonStyle = function (styleObj, scalingRatio = 1) {
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
        if (needUnitStr.includes(key)) {
            style[key] = styleObj[key] * 2 * scalingRatio + 'rpx';
        } else {
            style[key] = styleObj[key];
        }
    }

    style.transform = `rotate(${style.rotate}deg)`;
    style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : '';
    return style;
};
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

export const createText = (info, item, index, showGuest, customTypes) => {
    // const styleStr = styleObjToStr(getCommonStyle(item.commonStyle || {}))
    let currText = '';

    if (info && item) {
        const { propsValue } = item;

        if (propsValue) {
            if (propsValue.isCustom) {
                // switch(propsValue.customType) {
                //   case 'FEMALE_NAME':
                //     currText = info.FEMALE_NAME || info.femaleName
                //     break
                //   case 'MALE_NAME':
                //     currText = info.MALE_NAME || info.maleName
                //     break
                //   case 'BOTH_NAME':
                //     currText = info.BOTH_NAME
                //     break
                //   case 'PARTY_NAME':
                //     currText = info.PARTY_NAME
                //     break
                //   case 'WEDDING_ADDRESS':
                //     currText = info.WEDDING_ADDRESS || info.weddingAddress
                //     break
                //   case 'WEDDING_TIME':
                //     const time = moment(info.WEDDING_TIME || info.weddingTime || new Date())
                //     currText = time.format(propsValue.timeFormat || 'yyyy年MM月DD日 HH:mm')
                //     break
                //   case 'GUEST_NAME':
                //     if (!showGuest) {
                //       return ''
                //     } else {
                //       currText = info.guestName
                //     }
                //     break
                //   case 'CUSTOM':
                //     currText = strFormat(propsValue.text, {}, info)
                //     break
                //   default:
                //     break
                // }
                currText = getCustomText(propsValue, info, customTypes, showGuest);
            }
        }
    } // if (!currText) {
    //   currText = item.propsValue.text
    // }
    // if (item.propsValue.hasPrefix) {
    //   currText = item.propsValue.prefix + currText
    // }

    return `<text class="element_${index}">${currText}</text>\n`;
};
export const createImage = (info, item, index, extendData) => {
    // const styleStr = styleObjToStr(getCommonStyle(item.commonStyle || {}))
    const curr = extendData[item.uuid];
    let imageSrc = '';

    if (curr) {
        imageSrc = curr.imageSrc;
    }

    if (!imageSrc) {
        imageSrc = item.propsValue.imageSrc;
    }

    return `<image class="element_${index}" src="${imageSrc}"></image>\n`;
};
export const createPreviewView = (info, originData, currPage, extendData, showGuest, customTypes) => {
    let rows = '';

    for (let index = 0; index < currPage.elements.length; index++) {
        const item = currPage.elements[index];

        if (item.elName == 'qk-image') {
            rows += createImage(info, item, index, extendData);
        } else if (item.elName == 'qk-text') {
            rows += createText(info, item, index, showGuest, customTypes);
        }
    } // currPage.elements.forEach(item => {
    //   if (item.elName == 'qk-image') {
    //     // rows+=createImage(info, item)
    //   } else if (item.elName=='qk-text') {
    //     rows+=createText(info, item)
    //   }
    // });

    return `<view class="container" >
            ${rows}
          </view>`;
};
export const createPreviewStyle = (info, originData, currPage) => {
    const res = {
        container: {
            width: originData.width || 375,
            height: originData.height || 532,
            backgroundColor: 'white'
        }
    };

    for (let index = 0; index < currPage.elements.length; index++) {
        const element = currPage.elements[index];

        for (const key in element.commonStyle) {
            const val = element.commonStyle[key];

            if (element.commonStyle[key] == '') {
                delete element.commonStyle[key];
            }

            if (key == 'lineHeight') {
                if (typeof val == 'number') {
                    element.commonStyle[key] = element.commonStyle[key] + 'em';
                }
            }
        } // delete element.commonStyle.backgroundColor
        // element.commonStyle.backgroundColor = 'white'
        // element.commonStyle.color = 'black'
        // element.commonStyle['direction'] = 'rtl'

        res['element_' + index] = element.commonStyle || {};
    }

    console.log(res);
    return res;
};
export function strFormat(str, params, extendInfo) {
    params = { ...params };

    for (var key in extendInfo) {
        switch (key) {
            case 'PARTY_NAME':
                params['party'] = extendInfo[key];
                break;

            case 'BOTH_NAME':
                params['names'] = extendInfo[key];
                break;

            case 'WEDDING_ADDRESS':
                params['address'] = extendInfo[key];
                break;

            case 'WEDDING_TIME':
                params['time'] = extendInfo[key];
                break;

            case 'GUEST_NAME':
                params['guest'] = extendInfo[key];
                break;

            default:
                break;
        }
    }

    for (var key in params) {
        var reg = new RegExp('({' + key + '})', 'g');
        str = str.replace(reg, params[key]);
    }

    return str;
}
export function getCustomText(propsValue, extendInfo, types, showGuest) {
    if (!propsValue.isCustom) {
        return propsValue.text;
    }

    let currText = '';
    const type = types.find((item) => item.code === propsValue.customType);

    if (!type) {
        return propsValue.text;
    }

    console.log(propsValue);
    console.log(extendInfo);

    if (type.showOnShare && !showGuest) {
        return '';
    }

    if (!type.isCustom) {
        if (type.type === 'time') {
            const format = propsValue.timeFormat || type.defaultFormat || 'yyyy-MM-DD HH:mm Bj';
            const time = moment(extendInfo[propsValue.customType] || new Date());
            currText = time.format(format);
        } else if (type.type === 'select') {
			currText = extendInfo[type.code] || propsValue.text;
		} else {
			currText = extendInfo[type.code] || propsValue.text;
		}

        if (propsValue.hasPrefix) {
            currText = propsValue.prefix + currText;
        }
    } else {
        currText = strFomratByTypes(propsValue.text, extendInfo, types);
    }

    return currText;
}
export function strFomratByTypes(str, extendInfo, types) {
    const arr = strToArr(str);
    let result = ''; // console.log(arr)

    arr.forEach((row) => {
        if (!row.isCustom) {
            result += row.text;
        } else {
            const params = row.text.split('|');
            const currType = types.find((item) => item.replaceCode === params[0]);

            if (currType) {
                const val = extendInfo[currType.code] || currType.defaultValue;

                if (currType.type === 'select') {
					result += val;
				} else if (currType.type === 'time') {
                    let timeFormat = currType.defaultFormat || 'yyyy-MM-DD HH:mm Bj';

                    if (params.length > 1) {
                        timeFormat = params[1];
                    }

                    result += moment(new Date(val)).format(timeFormat);
                } else {
					result += val;
				}
            }
        }
    });
    return result;
}

function strToArr(str) {
    if (!str || typeof str !== 'string') {
        return null;
    }

    let startIndex = 0; // let startReplace = false

    let replaceStartIndex = -1;
    const arr = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '{') {
            replaceStartIndex = i;
        } else if (str[i] === '}') {
            if (replaceStartIndex >= 0) {
                if (replaceStartIndex !== startIndex) {
                    arr.push({
                        text: str.substring(startIndex, replaceStartIndex),
                        isCustom: false
                    });
                }

                arr.push({
                    text: str.substring(replaceStartIndex + 1, i),
                    isCustom: true
                });
                startIndex = i + 1;
                replaceStartIndex = -1;
            }
        }

        if (i === str.length - 1 && startIndex <= i) {
            arr.push({
                text: str.substring(startIndex, i + 1),
                isCustom: false
            });
        }
    }

    return arr;
}
