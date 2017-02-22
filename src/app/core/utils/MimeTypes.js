'use strict';

/**
 * Returns the awesome icon name from a mime type.
 *
 * @param {String} type
 * @returns {String}
 */
export function getAwesomeIconFromMimeType(type) {
    switch (type) {
        case 'application/pdf':
        case 'application/x-pdf':
            return "file-pdf-o";

        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.oasis.opendocument.spreadsheet':
            return "file-excel-o";

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.oasis.opendocument.presentation':
        case 'application/vnd.ms-powerpoint':
            return "file-powerpoint-o";

        case 'application/vnd.oasis.opendocument.text':
        case 'application/vnd.ms-word':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
        case 'application/x-mswrite':
            return "file-word-o";

        case 'application/x-bzip2':
        case 'application/x-gzip':
        case 'application/zip':
        case 'application/x-compressed-zip':
        case 'application/x-rar-compressed':
        case 'application/x-7z-compressed':
            return "file-zip-o";
    }

    if (/^image\//.exec(type)) {
        return "file-image-o";
    }

    if (/^audio\//.exec(type)) {
        return "file-audio-o";
    }

    if (/^video\//.exec(type)) {
        return "file-video-o";
    }

    return "file-o";
}

/**
 * Returns mime type from a filename. (it extracts the extension)
 *
 * @param {string} filename
 * @returns {string|undefined}
 */
export function getMimeTypeFromFilename(filename) {
    if (!filename) {
        return undefined;
    }

    let exp = /.*\.([^\.]+)$/.exec(filename);
    if (!exp) {
        return undefined;
    }

    let extension = exp[1].toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'application/pdf';

        case 'xls':
            return 'application/vnd.ms-excel';

        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        case 'ppt':
            return "application/vnd.ms-powerpoint";

        case 'pptx':
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        case 'docx':
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        case 'doc':
        case 'dot':
            return "application/msword";

        case 'txt':
            return "text/plain";

        case 'gz':
        case 'bzip2':
        case 'gzip':
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
            return 'application/zip';

        case 'jpg':
        case 'jpeg':
            return "image/jpeg";

        case 'png':
        case 'gif':
        case 'tiff':
            return "image/" + extension;

        case 'mp3':
            return "audio/mpeg";

        case 'wav':
        case 'wave':
            return "audio/x-wav";

        case 'avi':
            return "video/avi";

        case 'mpg':
        case 'mpeg':
            return "video/mpeg";

        case 'mkv':
            return "video/matroska";

        case '3gp':
        case '3gpp':
            return "video/3gpp";

        case '3g2':
        case '3gpp2':
            return "video/3gpp2";
    }

    return undefined;
}