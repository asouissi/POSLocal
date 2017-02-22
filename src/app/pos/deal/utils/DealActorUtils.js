export default class DealActorUtils {
    
    static isetNumber(actor, actcode) {
        return actor.merge({
            actcode: actcode,
            actlibcourt: '',
            actid: ''
        })
    }

    static isetName(actor, actlibcourt) {
        return actor.merge({
            actlibcourt: actlibcourt,
            actcode: '',
            actid: ''
        })
    }

    static isetId(actor, actid) {
        return actor.merge({
            actlibcourt: '',
            actcode: '',
            actid: actid
        })
    }

    static iupdateActor(actor, values) {
        return actor.merge(values)
    }
}

