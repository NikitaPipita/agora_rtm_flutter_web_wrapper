function mapToObjectRec(m) {
    let lo = {}
    for (let [k, v] of m) {
        if (v instanceof Map) {
            lo[k] = mapToObjectRec(v)
        } else if (Array.isArray(v)) {
            lo[k] = arrayToArrayObjectsRec(v)
        } else {
            lo[k] = v
        }
    }
    return lo
}

function arrayToArrayObjectsRec(a) {
    let la = []
    for (let v of a) {
        if (v instanceof Map) {
            la.push(mapToObjectRec(v))
        } else if (Array.isArray(v)) {
            la.push(arrayToArrayObjectsRec(v))
        } else {
            la.push(v)
        }
    }
    return la
}

export function mapToJsonString(map) {
    return JSON.stringify(mapToObjectRec(map))
}

export function jsonStringToObject(jsonString) {
    return JSON.parse(jsonString)
}