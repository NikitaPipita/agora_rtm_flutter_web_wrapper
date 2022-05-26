export function mapToJsonString(map) {
    return JSON.stringify(Object.fromEntries(map))
}

export function mapToObjectRec(m) {
    let lo = {}
    for (let [k, v] of m) {
        if (v instanceof Map) {
            lo[k] = mapToObjectRec(v)
        } else {
            lo[k] = v
        }
    }
    return lo
}

export function parseJsonIntoOneLevelMap(jsonString) {
    let params = new Map()
    if (params != null) {
        JSON.parse(jsonString, function (k, v) {
            params.set(k, v)
        })
    }
    return params
}