export const CUSTOMER_TYPE_INDIVIDUAL = 'PART';
export const CUSTOMER_TYPE_CORPORATE = 'PM';
export const CUSTOMER_INDIVIDUAL_FIELDS = ["apatitre", "actnom2", "apanommarital", "apaprenom", "apanompatronymique", "apadtnaiss", "apadeptnaissval", "apavillenaiss", "paycode", "apasexe", "apadeptnaiss", "apacomnaiss"];
export const CUSTOMER_CORPORATE_FIELDS = ["cjucode", "actsiret", "aparegimematrim", "nafcode", "actdtimmatriculation"];
export default class actorUtils {

    static addMissingTelecomFields = (actor) => { //TODO: do it immutable

        let telecomTypes = ['TEL', 'NET', 'SITE', 'MOB', 'FAX'];

        //mutate
        let listActorTelecom = actor.listactortelecom;
        if(listActorTelecom){
            let nextOrder = listActorTelecom.length ? _.max(listActorTelecom.map(item => item.ateordre)) + 1 : 1;

            telecomTypes.forEach(type => {
                let telecom = listActorTelecom.find(item => item.atetype === type);
                if (!telecom) {
                    listActorTelecom.push({
                        atetype: type,
                        ateordre: nextOrder++,
                        actid: actor.actid
                    })
                }
            });
        }
        return actor
    }

    static computeTelecomFields(listActorTelecom) {

        let phone = listActorTelecom.find(item => item.atetype == 'TEL');
        if (phone) {
            phone = "listactortelecom[" + listActorTelecom.indexOf(phone) + "].atenum";
        }
        let mail = listActorTelecom.find(item => item.atetype == 'NET');
        if (mail) {
            mail = "listactortelecom[" + listActorTelecom.indexOf(mail) + "].atenum";
        }
        let mobile = listActorTelecom.find(item => item.atetype == 'MOB');
        if (mobile) mobile = "listactortelecom[" + listActorTelecom.indexOf(mobile) + "].atenum";

        let site = listActorTelecom.find(item => item.atetype == 'SITE');
        if (site) site = "listactortelecom[" + listActorTelecom.indexOf(site) + "].atenum";

        return {
            phone, mail, mobile, site
        }
    }

    static removeEmptyTelecoms(actor) {
        return actor.listactortelecom.filter(telecom => telecom.atenum);
    }

    static removeEmptyAddresses(actor) {
        return actor.listactoraddress.filter(address => address.adrvoie && address.paycode)
    }

    static getTelecomFieldErrorIndex(listactortelecom, type) {
        return listactortelecom.findIndex((telecom) => telecom.atetype == type);
    }

    static filterValidIbanAccount = (actor) => { // todo  immutable
        let listactorbankaccount = actor.listactorbankaccount;
        var filterIbanList = [];
        listactorbankaccount.forEach(ibanObj => {
            if (ibanObj.aridtremplace == null) {
                filterIbanList.push(ibanObj.ribid);
            }
        });
        var maxRibid = Math.max(...filterIbanList);
        if (maxRibid) {
            var validIban = listactorbankaccount.find((ibanObj)=>ibanObj.ribid == maxRibid);
            actor.listactorbankaccount.length = 0;
            if (validIban) {
                actor.listactorbankaccount.push(validIban);
            }
        }
        return actor;
    }
}