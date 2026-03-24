import {UAParser} from "ua-parser-js";

export const getDeviceInfo  = (req) => {

    const userAgent = req.headers['user-agent'] || 'unknown device';
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceInfo = {vendor: result.device.vendor || 'PC/Desktop',  model: result.device.model ||   'Unknown', os: result.os.name || 'Unknown', osVersion: result.os.version || 'Unknown', browser: result.browser.name || 'Unknown', browserVersion: result.browser.version || 'Unknown'
    };

    return JSON.stringify(deviceInfo)    
} 
