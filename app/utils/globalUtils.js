import { Dimensions, PixelRatio, Platform } from 'react-native';
import { create } from 'apisauce';
import { globalScope } from '../utils/globalScope';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// to convert the  percentage of width to the dp;
// eg: getXdp(50)
export const getXdp = (percent) => PixelRatio.roundToNearestPixel((screenWidth * parseFloat(percent)) / 100);
// to convert the  percentage of height to the dp;
// eg: getYdp(50)
export const getYdp = (percent) => PixelRatio.roundToNearestPixel((screenHeight * parseFloat(percent)) / 100);

export function transfromViewHeightBasedOnPercentage(sourceHeight, sourceWidth, percentage) {
    const viewWidth = screenWidth * percentage;
    const ratio = sourceHeight / sourceWidth;
    return viewWidth * ratio;
}

const addHeaderToAPI = (apiString) => {
    const api = create({
        baseURL: apiString,
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'en',
            'api-version': '1.0.0',
            'app-os-name': Platform.OS,
            'x-firebase-token': globalScope.token,
        },
        timeout: 30000,
    });

    return api;
};

export function apiRequest(path, type, body, url, headerParams) {
    const apiObject = addHeaderToAPI(url || globalScope.api);
    return apiObject[type](path, body, headerParams);
}

export function dataChecking(object) {
    let args = Array.prototype.slice.call(arguments, 1);
    if (args[0].constructor === Array) {
        args = args[0];
    }

    let obj = object;

    for (let i = 0; i < args.length; i += 1) {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, args[i])) {
            return null;
        }
        obj = obj[args[i]];
    }
    return obj;
}

export function formatBytes(a, b) {
    if (a === 0) {
        return '0 Bytes';
    }
    const c = 1024;
    const d = b || 2;
    const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a/Math.pow(c,f)).toFixed(d))+' '+e[f];
}
