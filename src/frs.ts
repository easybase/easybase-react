/*
import from2 from 'from2';

var names = {
    '[object Int8Array]': true,
    '[object Int16Array]': true,
    '[object Int32Array]': true,
    '[object Uint8Array]': true,
    '[object Uint8ClampedArray]': true,
    '[object Uint16Array]': true,
    '[object Uint32Array]': true,
    '[object Float32Array]': true,
    '[object Float64Array]': true
}

function isTypedArray(arr: any) {
    return (
        isStrictTypedArray(arr) || isLooseTypedArray(arr)
    )
}

function isStrictTypedArray(arr: any) {
    return (arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array)
}

function isLooseTypedArray(arr: any) {
    return names[toString.call(arr)]
}

function toBuffer(arr: any) {
    if (isTypedArray(arr)) {
        // To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
        var buf = Buffer.from(arr.buffer)
        if (arr.byteLength !== arr.buffer.byteLength) {
            // Respect the "view", i.e. byteOffset and byteLength, without doing a copy
            buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
        }
        return buf
    } else {
        // Pass through all other types to `Buffer.from`
        return Buffer.from(arr)
    }
}

export default function (file: File, options: any): ReadableStream {
    options = options || {}
    var offset = options.offset || 0
    var chunkSize = options.chunkSize || 1024 * 1024 // default 1MB chunk has tolerable perf on large files
    var fileReader = new FileReader();

    fileReader.readAsText(file);

    var from: ReadableStream | any = from2(function (size, cb) {
        if (offset >= file.size) return cb(null, null)
        fileReader.onloadend = function loaded(event: any) {
            var data = event.target.result
            if (data instanceof ArrayBuffer) data = toBuffer(new Uint8Array(event.target.result))
            cb(null, data)
        }
        var end = offset + chunkSize
        var slice = file.slice(offset, end)
        fileReader.readAsArrayBuffer(slice)
        offset = end
    })

    from.name = file.name
    from.size = file.size
    from.type = file.type
    from.lastModified = file.lastModified

    fileReader.onerror = function (err) {
        from.destroy(err)
    }

    return from
}
*/