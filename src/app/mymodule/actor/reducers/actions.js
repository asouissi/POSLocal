export const FETCH_ACTORS = 'mymodule/FETCH_ACTORS'
export const FETCH_ACTORS_SUCCESS = 'mymodule/FETCH_ACTORS_SUCCESS'
export const FETCH_ACTORS_FAIL = 'mymodule/FETCH_ACTORS_FAIL'

export const FETCH_ACTOR = 'mymodule/FETCH_ACTOR'
export const FETCH_ACTOR_SUCCESS = 'mymodule/FETCH_ACTOR_SUCCESS'
export const FETCH_ACTOR_FAIL = 'mymodule/FETCH_ACTOR_FAIL'


export function fetchActors() {
    return {
        types: [FETCH_ACTORS, FETCH_ACTORS_SUCCESS, FETCH_ACTORS_FAIL],
        promise: (client) => client.get('/actors')
    }
}

export function fetchActor(actid) {
    return {
        types: [FETCH_ACTOR, FETCH_ACTOR_SUCCESS, FETCH_ACTOR_FAIL],
        promise: (client) => client.get('/actor/'+actid)
    }
}