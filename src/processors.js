export function generateDataURI(content, type, byBlob) {
    switch (type) {
        case 'txt': {
            let blobType = 'text/plain;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'css': {
            let blobType = 'text/css;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'html': {
            let blobType = 'text/html;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'json': {
            let blobType = 'text/json;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'csv': {
            let blobType = 'text/csv;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'xls': {
            let blobType = 'text/application/vnd.ms-excel;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        case 'xml': {
            let blobType = 'text/application/xml;charset=utf-8';
            if (byBlob)
                return URL.createObjectURL(new Blob([content], { type: blobType }));
            return "data:,".concat(blobType) + encodeURIComponent(content);
        }
        default: {
            return '';
        }
    }
}
export function downloadFile(content, type, fileName, byBlob) {
    if (fileName === void 0) { fileName = 'download'; }
    if (byBlob === void 0) { byBlob = true; }
    let dataURI = generateDataURI(content, type, byBlob);
    let anchor = document.createElement('a');
    anchor.href = dataURI;
    anchor.download = fileName;
    anchor.setAttribute('style', 'visibility:hidden');
    document.body.appendChild(anchor);
    anchor.dispatchEvent(new MouseEvent('click', {
        bubbles: false,
        cancelable: false,
        view: window,
    }));
    document.body.removeChild(anchor);
}
