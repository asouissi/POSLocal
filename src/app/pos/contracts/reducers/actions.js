const p = "pos/contracts/"

export const FETCH = p+'FETCH'
export const FETCH_SUCCESS = p+'FETCH_SUCCESS'
export const FETCH_FAIL = p+'FETCH_FAIL'


export function fecthContracts() {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/poscontracts')
    }
}