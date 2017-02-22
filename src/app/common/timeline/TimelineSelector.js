import { createSelectorCreator, defaultMemoize } from 'reselect'


/**
 * Motivation : We do that because of polling. 
 * When we receive a new array of timeline item we won't re-render if the items are the same.
 * This selector allows to compare all items one by one and pass the newline to react only when there are new elements. 
 */

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    _.isEqual
);

const getItems =(items) => {return items}

export const timelineSelector = () => {
    //We use an anonymous function because this selector is used by many components, we need to have one instance by component
   return createDeepEqualSelector(
        getItems,
        (timeline) => {
            return timeline
        }
    );
}