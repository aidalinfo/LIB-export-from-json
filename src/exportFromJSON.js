import { assert, isArray, normalizeFileName } from './utils.js';
import { downloadFile, generateDataURI } from './processors.js';
import { _prepareData, _createJSONData, createCSVData, createXLSData, createXMLData, _createFieldsMapper } from './converters.js';
import { exportTypes } from './types.js';
function exportFromJSON(_a) {
    let data = _a.data, _b = _a.fileName, fileName = _b === void 0 ? 'download' : _b, extension = _a.extension, _c = _a.fileNameFormatter, fileNameFormatter = _c === void 0 ? function (name) { return name.replace(/\s+/, '_'); } : _c, fields = _a.fields, _d = _a.exportType, exportType = _d === void 0 ? 'txt' : _d, _e = _a.replacer, replacer = _e === void 0 ? null : _e, _f = _a.space, space = _f === void 0 ? 4 : _f, _g = _a.processor, processor = _g === void 0 ? downloadFile : _g, _h = _a.withBOM, withBOM = _h === void 0 ? false : _h, _j = _a.beforeTableEncode, beforeTableEncode = _j === void 0 ? function (i) { return i; } : _j, _k = _a.fileWithoutDownload, fileWithoutDownload = _k === void 0 ? false : _k;
    let MESSAGE_IS_ARRAY_FAIL = 'Invalid export data. Please provide an array of objects';
    let MESSAGE_UNKNOWN_EXPORT_TYPE = "Can't export unknown data type ".concat(exportType, ".");
    let MESSAGE_FIELD_INVALID = "Can't export string data to ".concat(exportType, ".");
    
    fileWithoutDownload ? processor = generateDataURI : null;

    if (typeof data === 'string') {
        switch (exportType) {
            case 'txt':
            case 'css':
            case 'html': {
                return processor(data, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : exportType, fileNameFormatter));
            }
            default:
                throw new Error(MESSAGE_FIELD_INVALID);
        }
    }
    let fieldsMapper = _createFieldsMapper(fields);
    let safeData = fieldsMapper(_prepareData(data));
    let JSONData = _createJSONData(safeData, replacer, space);
    switch (exportType) {
        case 'txt':
        case 'css':
        case 'html': {
            return processor(JSONData, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : exportType, fileNameFormatter));
        }
        case 'json': {
            return processor(JSONData, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'json', fileNameFormatter));
        }
        case 'csv': {
            assert(isArray(safeData), MESSAGE_IS_ARRAY_FAIL);
            let BOM = '\ufeff';
            let CSVData = createCSVData(safeData, beforeTableEncode);
            let content = withBOM ? BOM + CSVData : CSVData;
            return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'csv', fileNameFormatter));
        }
        case 'xls': {
            assert(isArray(safeData), MESSAGE_IS_ARRAY_FAIL);
            let content = createXLSData(safeData, beforeTableEncode);
            return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'xls', fileNameFormatter));
        }
        case 'xml': {
            let content = createXMLData(safeData);
            return processor(content, exportType, normalizeFileName(fileName, extension !== null && extension !== void 0 ? extension : 'xml', fileNameFormatter));
        }
        default:
            throw new Error(MESSAGE_UNKNOWN_EXPORT_TYPE);
    }
}
exportFromJSON.types = exportTypes;
exportFromJSON.processors = { downloadFile: downloadFile };
export default exportFromJSON;
