import filter from "lodash/filter";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import some from "lodash/some";
import * as a from "./actions";


const initialState = {
    global: JSON.parse(localStorage.getItem('globalTimeLine:global')) || [],
    page: JSON.parse(localStorage.getItem('globalTimeLine:page')) || [],
    deal: [], //maybe many deal a day
    lastDealDateTime: new Date().getTime()
};

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case a.TM_RESET:
            return {
                ...state,
                deal: [],
                lastDealDateTime: new Date().getTime()
            };

        case a.TM_FETCH_SUCCESS:
            var dealTimeLine = checkNewItems(action.result.data, state.deal, action.uticode, state.lastDealDateTime);
            return {
                ...state,
                lastDealDateTime: action.lastDealDateTime,
                deal: dealTimeLine
            };

        case a.GTM_FETCH_SUCCESS:
            if (action.timelineId === 'global') {
                let globalTimeline = checkNewItems(action.result.data, state.global, action.uticode);
                setTimeLineInLocalstorage(action.timelineId, globalTimeline);
                return {...state, global: globalTimeline};
            }

            if (action.timelineId === 'page') {
                let pageTimeline = checkNewItems(action.result.data, state.page, action.uticode);
                setTimeLineInLocalstorage(action.timelineId, pageTimeline);
                return {...state, page: pageTimeline};
            }


        case a.ITEM_READ:
            if (action.timelineId === 'page' || action.timelineId === 'global') {

                let newPage = markAsRead(action.item, state.page, action.isRead);
                setTimeLineInLocalstorage('page', newPage);

                var newGlobal = markAsRead(action.item, state.global, action.isRead);
                setTimeLineInLocalstorage('global', newGlobal);
                return {
                    ...state,
                    page: newPage,
                    global: newGlobal
                }
            }

            if (action.timelineId) {
                return {
                    ...state,
                    deal: markAsRead(action.item, state.deal, action.isRead)
                }
            }

        default:
            return state;
    }
}


function markAsRead(actionItem, timeline, isRead) {
    return timeline.map((item) => {
        if (!isEqual(item, actionItem)) return item;
        if (isRead) {
            return {...item, isNew: !isRead}
        }
        return {...item, isNew: !item.isNew}
    })
}

function checkNewItems(nextTimeLine, timeline, uticode, lastDatetime) {

    let oldReadItem = filter(timeline, {isNew: false}).map((i) => {
        return omit(i, ['isNew']);
    });

    let oldNotReadItem = filter(timeline, {isNew: true}).map((i) => {
        return omit(i, ['isNew']);
    });

    return nextTimeLine.map((item) => {

        if (uticode && item.usercode === uticode) {
            return {...item, isNew: false};
        }

        let isNew = some(oldNotReadItem, item);
        if (isNew) {
            return {...item, isNew: isNew};
        }

        isNew = !some(oldReadItem, item);

        if (lastDatetime && isNew && item.creationdate) {
            isNew = lastDatetime < item.creationdate
        }

        return {...item, isNew: isNew}
    });

}


function getTimeLineFromLocalstorage() {
    return JSON.parse(localStorage.getItem('globalTimeLine')) || [];
}

//TODO: remove 
function setTimeLineInLocalstorage(timelineId, timeline) {
    localStorage.setItem('globalTimeLine:' + timelineId, JSON.stringify(timeline));
}
