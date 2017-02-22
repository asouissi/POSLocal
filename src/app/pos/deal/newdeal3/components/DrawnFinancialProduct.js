/**
 * Created by zos on 01/06/2016.
 */
'use strict'

import Select from '../../../../core/components/lib/Select'

const FINANCIAL_PRODUCT_LIST_CHILDREN =  "/referencetable?table=tprofilgestion&tpgcodeparent=$tpgcodeparent";

const debug = (...messages) => console.log.apply(console, messages);

export default class DrawnFinancialProduct extends Select {


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps && nextState && (!nextState.data || !nextState.data.length ) && !nextState.loading) {

            var url = this.getUrl();
            let needUpdate = false;
            let shouldUpdate = true;

            for (var propName of this.getProps()) {
                var nv = nextProps[propName];
                var v = this.props[propName];

                if (nv && nv != v) {
                    needUpdate = true;
                }

                if (!nv) shouldUpdate = false;

                if (nv) url = url.replace('$' + propName, nv);
            }
            if (!shouldUpdate) {
                return shouldUpdate || this.state.data !== nextState.data;
            }

            if (needUpdate && shouldUpdate) this.loadDatas(url);
        }

        if(nextState.data && nextState.data.length === 1){
            this.props.onChange && this.props.onChange({target:{value:nextState.data[0].code}});
        }


        return nextState.loading || nextProps.value != this.props.value || this.state.data !== nextState.data
            || nextProps.code != this.props.code || nextProps.readOnly != this.props.readOnly ;
    }
    
    componentDidMount() {
        var url = this.getUrl();
        var propName = this.getProps();
        var v = this.props[propName];
        url = url.replace('$' + propName, v);

        // Got all the keys, load Data from server
        this.loadDatas(url);
    }

    componentWillReceiveProps(nextProps) {
        for (var propName of this.getProps()) {
            // New key
            var v = nextProps[propName];

            // If key is undefined or different, clear list
            if (v != this.props[propName] && this.state.data && this.state.data.length) {
                this.clearData();
                return;
            }
        }
    }
    getUrl() {
        return FINANCIAL_PRODUCT_LIST_CHILDREN;
    }

    getProps() {
        return ["tpgcodeparent"];
    }
}
