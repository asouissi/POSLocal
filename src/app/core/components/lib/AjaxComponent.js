'use strict'
import React from 'react'
import axios from 'axios'

const debug = (...messages) => console.log.apply(console, messages);

export default class AjaxComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {empty: true};
    }

    loadDatas(url, params) {
        var promise;
        try {
            promise = axios.get(url, {params: params});

        } catch (x) {
            this.setState(() => ({
                loading: false,
                error: x
            }));
            return;
        }

        this.setState(() => ({
            loading: true,
            error: undefined
        }));

        this._loadingPromise = promise;

        promise.then((result) => {
            debug("Json result=", result)
            if (!this._loadingPromise) {
                // Already canceled ?
                return;
            }
            this._clearPromise();

            this.setState({
                data: this.convertData(result.data),
                children: this.renderChildren(this.state.data, result.data),
                loading: false,
                error: undefined
            });
            this.onLoad(result.data);
        }, (error) => {
            console.error("Request '" + url + "' throws error=", error);
            this._clearPromise();

            this.setState(() => ({
                error: error,
                loading: false
            }));
            // TODO error strategy ?
            console.log("Connection problem !\n" + error);
        });
    }

    renderChildren(data, nextData) {
        return undefined;
    }

    onLoad(result){
      this.props.onLoad && this.props.onLoad(result)
    }

    clearData() {
        if (this.state === undefined) {
            return;
        }
        this.setState(() => ({
            children: undefined,
            loading: false,
            error: null,
            data: undefined,
            empty: true
        }));
    }

    convertData(json) {
        return json;
    }

    componentWillUnmount() {
        this._clearPromise(true);
    }

    _clearPromise(cancel) {
        // If the promise is running, cancel it !
        var loadingPromise = this._loadingPromise;
        if (loadingPromise) {
            delete this._loadingPromise;

            if (cancel && typeof (loadingPromise.cancel) === "function") {
                loadingPromise.cancel();
            }
        }
    }
}