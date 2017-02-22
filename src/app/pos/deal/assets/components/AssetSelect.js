'use strict'

import Select from '../../../../core/components/lib/Select'

export default class AssetSelect extends Select {

    getUrl() {
        throw new Error("Must be implemented");
    }

    getProps() {
        throw new Error("Must be implemented");
    }

    componentDidMount() {
        var url = this.getUrl();

        for (var prop of this.getProps()) {
            var v = this.props[prop];

            if (!v) {
                return;
            }

            url = url.replace('$' + prop, v);
        }

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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
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

        if(nextState.data && nextState.data !== this.state.data  && nextState.data.length === 1){
            this.props.onChange && this.props.onChange({target:{value:nextState.data[0].code}});
        }

        return nextState.loading || nextProps.value != this.props.value || this.state.data !== nextState.data
            || nextProps.code != this.props.code;
    }

    filterAndSortDatas(datas) {
        datas.sort((o1, o2) => (o1.label === o2.label) ? 0 : ((o1.label < o2.label) ? -1 : 1));

        return datas;
    }
}