'use strict';

export const ACTION_MODE_INSERTION = "+";
export const ACTION_MODE_MODIFICATION = "*";
export const ACTION_MODE_DELETION = "-";
export const ACTION_MODE_DELETION_AFTER_MODIFICATION = "/";


class sharedUtils {

    static updateActionMode(p_record, p_newMode) {
        if (!p_newMode) {
            return p_record.set ('actionMode',  null);
        }
        else if (ACTION_MODE_INSERTION === p_newMode) {
            return p_record.set ('actionMode',  ACTION_MODE_INSERTION);
        }
        else if (ACTION_MODE_MODIFICATION === p_newMode) {
            if (!p_record.actionMode) {
                return p_record.set ('actionMode',  ACTION_MODE_MODIFICATION);
            }
        }
        else if (ACTION_MODE_DELETION === p_newMode) {
            const flag = p_record.actionMode;

            if (!flag) {
                return p_record.set ('actionMode',  ACTION_MODE_DELETION);
            }
            else if (ACTION_MODE_MODIFICATION === flag) {
                return p_record.set ('actionMode',  ACTION_MODE_DELETION_AFTER_MODIFICATION);
            }
            else if (ACTION_MODE_DELETION_AFTER_MODIFICATION === flag) {
                return p_record.set ('actionMode',  ACTION_MODE_DELETION_AFTER_MODIFICATION);
            }
        }

        return p_record;
    }

    static isValid(p_record) {
        return ( ACTION_MODE_DELETION !== p_record.actionMode && ACTION_MODE_DELETION_AFTER_MODIFICATION !== p_record.actionMode );
    }

    static isNew(p_record) {
        return ( ACTION_MODE_INSERTION === p_record.actionMode );
    }
}

export default sharedUtils;