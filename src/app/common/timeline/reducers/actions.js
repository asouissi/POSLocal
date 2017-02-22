export const TM_RESET = 'timeline/RESET';
export const TM_FETCH = 'timeline/FETCH';
export const TM_FETCH_SUCCESS = 'timeline/FETCH_SUCCESS';
export const TM_FETCH_FAIL = 'timeline/FETCH_FAIL';

export const ITEM_SAVE = 'timeline/item/POST';
export const ITEM_SAVE_SUCCESS = 'timeline/item/POST_SUCCESS';
export const ITEM_SAVE_FAIL = 'timeline/item/POST_FAIL';


export const GTM_FETCH = 'timeline/global/FETCH';
export const GTM_FETCH_SUCCESS = 'timeline/global/FETCH_SUCCESS';
export const GTM_FETCH_FAIL = 'timeline/global/FETCH_FAIL';

export const ITEM_READ = 'timeline/item/READ';


export function getTimeLine(dealId) {
    if (!dealId) {
        return {
            type: TM_RESET
        }
    }
    return (dispatch, getState) => {
        let uticode =  getState().authentication.user.uticode;
        dispatch (fetchTimeline(dealId, uticode));
    };
}

export function fetchTimeline(dealId, uticode){
    let lastDealDateTime = new Date().getTime();
    return {
        types: [TM_FETCH, TM_FETCH_SUCCESS, TM_FETCH_FAIL],
        dealId,
        lastDealDateTime,
        uticode,
        promise: (client) => client.get('/timelines/' + dealId)
    }
}


export function getGlobalTimeLine(timelineId, startDateTime, maxCount = 50) {
    return (dispatch, getState) => {
        let uticode =  getState().authentication.user.uticode;
        dispatch({
            types: [GTM_FETCH, GTM_FETCH_SUCCESS, GTM_FETCH_FAIL],
            timelineId,
            uticode,
            promise: (client) => client.get('/timelines', {
                params: {
                    maxCount: maxCount,
                    since: startDateTime
                }
            })
        })
    }

}

export function saveItem(item) {
    item.type = 'TASK';
    return {
        types: [ITEM_SAVE, ITEM_SAVE_SUCCESS, ITEM_SAVE_FAIL],
        promise: (client) => client.post('/tasks', item),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(getTimeLine(item.dealid));
        }
    };
}

export function readItem(item, timelineId, isRead){
    return {
        type: ITEM_READ,
        item: item,
        timelineId: timelineId,
        isRead: isRead
    }
}
