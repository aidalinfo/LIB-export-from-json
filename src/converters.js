let __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (let s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
let __read = (this && this.__read) || function (o, n) {
    let m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    let i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { isArray, getEntries, normalizeXMLName, indent, stripHTML, assert, getKeys } from './utils.js';
export function _createFieldsMapper(fields) {
    if (!fields
        || isArray(fields) && !fields.length
        || !isArray(fields) && !getKeys(fields).length)
        return function (item) { return item; };
    let mapper = isArray(fields)
        ? fields.reduce(function (map, key) {
            let _a;
            return (__assign(__assign({}, map), (_a = {}, _a[key] = key, _a)));
        }, Object.create(null))
        : fields;
    return function (item) {
        if (isArray(item)) {
            return item
                .map(function (i) { return getEntries(i).reduce(function (map, _a) {
                let _b = __read(_a, 2), key = _b[0], value = _b[1];
                if (key in mapper) {
                    map[mapper[key]] = value;
                }
                return map;
            }, Object.create(null)); })
                .filter(function (i) { return getKeys(i).length; });
        }
        return getEntries(item).reduce(function (map, _a) {
            let _b = __read(_a, 2), key = _b[0], value = _b[1];
            if (key in mapper) {
                map[mapper[key]] = value;
            }
            return map;
        }, Object.create(null));
    };
}
export function _prepareData(data) {
    let MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON';
    try {
        return (typeof data === 'string' ? JSON.parse(data) : data);
    }
    catch (_a) {
        throw new Error(MESSAGE_VALID_JSON_FAIL);
    }
}
export function _createJSONData(data, replacer, space) {
    if (replacer === void 0) { replacer = null; }
    let MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide valid JSON object';
    try {
        return JSON.stringify(data, replacer, space);
    }
    catch (_a) {
        throw new Error(MESSAGE_VALID_JSON_FAIL);
    }
}
export function _createTableMap(data) {
    return data.map(getEntries).reduce(function (tMap, rowKVs, rowIndex) {
        return rowKVs.reduce(function (map, _a) {
            let _b = __read(_a, 2), key = _b[0], value = _b[1];
            let columnValues = map[key] || Array.from({ length: data.length }).map(function (_) { return ''; });
            columnValues[rowIndex] =
                (typeof value !== 'string' ? JSON.stringify(value) : value) || '';
            map[key] = columnValues;
            return map;
        }, tMap);
    }, Object.create(null));
}
export function _createTableEntries(tableMap, beforeTableEncode) {
    if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
    return beforeTableEncode(getEntries(tableMap).map(function (_a) {
        let _b = __read(_a, 2), fieldName = _b[0], fieldValues = _b[1];
        return ({
            fieldName: fieldName,
            fieldValues: fieldValues,
        });
    }));
}
function encloser(value) {
    let enclosingCharacter = /,|"|\n/.test(value) ? '"' : '';
    let escaped = value.replace(/"/g, '""');
    return "".concat(enclosingCharacter).concat(escaped).concat(enclosingCharacter);
}
export function createCSVData(data, beforeTableEncode) {
    if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
    if (!data.length)
        return '';
    let tableMap = _createTableMap(data);
    let tableEntries = _createTableEntries(tableMap, beforeTableEncode);
    let head = tableEntries.map(function (_a) {
        let fieldName = _a.fieldName;
        return fieldName;
    }).join(',') + '\r\n';
    let columns = tableEntries.map(function (_a) {
        let fieldValues = _a.fieldValues;
        return fieldValues;
    })
        .map(function (column) { return column.map(encloser); });
    let rows = columns.reduce(function (mergedColumn, column) { return mergedColumn.map(function (value, rowIndex) { return "".concat(value, ",").concat(column[rowIndex]); }); });
    return head + rows.join('\r\n');
}
export function _renderTableHTMLText(data, beforeTableEncode) {
    assert(data.length > 0);
    let tableMap = _createTableMap(data);
    let tableEntries = _createTableEntries(tableMap, beforeTableEncode);
    let head = tableEntries.map(function (_a) {
        let fieldName = _a.fieldName;
        return fieldName;
    })
        .join('</b></th><th><b>');
    let columns = tableEntries.map(function (_a) {
        let fieldValues = _a.fieldValues;
        return fieldValues;
    })
        .map(function (column) { return column.map(function (value) { return "<td>".concat(value, "</td>"); }); });
    let rows = columns.reduce(function (mergedColumn, column) { return mergedColumn
        .map(function (value, rowIndex) { return "".concat(value).concat(column[rowIndex]); }); });
    return "\n    <table>\n      <thead>\n        <tr><th><b>".concat(head, "</b></th></tr>\n      </thead>\n      <tbody>\n        <tr>").concat(rows.join("</tr>\n        <tr>"), "</tr>\n      </tbody>\n    </table>\n  ");
}
export function createXLSData(data, beforeTableEncode) {
    if (beforeTableEncode === void 0) { beforeTableEncode = function (i) { return i; }; }
    if (!data.length)
        return '';
    let content = "<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n  </head >\n  <body>\n    ".concat(_renderTableHTMLText(data, beforeTableEncode), "\n  </body>\n</html >\n");
    return content;
}
export function createXMLData(data) {
    let content = "<?xml version=\"1.0\" encoding=\"utf-8\"?><!DOCTYPE base>\n".concat(_renderXML(data, 'base'), "\n");
    return content;
}
function _renderXML(data, tagName, arrayElementTag, spaces) {
    if (arrayElementTag === void 0) { arrayElementTag = 'element'; }
    if (spaces === void 0) { spaces = 0; }
    let tag = normalizeXMLName(tagName);
    let indentSpaces = indent(spaces);
    if (data === null || data === undefined) {
        return "".concat(indentSpaces, "<").concat(tag, " />");
    }
    let content = isArray(data)
        ? data.map(function (item) { return _renderXML(item, arrayElementTag, arrayElementTag, spaces + 2); }).join('\n')
        : typeof data === 'object'
            ? getEntries(data)
                .map(function (_a) {
                let _b = __read(_a, 2), key = _b[0], value = _b[1];
                return _renderXML(value, key, arrayElementTag, spaces + 2);
            }).join('\n')
            : indentSpaces + '  ' + stripHTML(String(data));
    let contentWithWrapper = "".concat(indentSpaces, "<").concat(tag, ">\n").concat(content, "\n").concat(indentSpaces, "</").concat(tag, ">");
    return contentWithWrapper;
}
