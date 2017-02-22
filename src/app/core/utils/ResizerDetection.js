'use strict'

import React from 'react'

const IFRAME_STYLE = {
    position: "absolute",
    width: "100%",
    height: "100%",
    visibility: "hidden",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    border: 0,
    display: "block",
    margin: 0,
    padding: 0
}

class ResizerDetection extends React.Component {
    constructor(props) {
        super(props);
    }

    handleResize() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
        this._timeoutId = setTimeout(() => {
            if (this.props.onResize) {
                this.props.onResize();
            }
        }, 100);
    }

    render() {
        return (<iframe ref="iframe" className="resize-hidden-iframe" style={IFRAME_STYLE}/>);
    }

    componentDidMount() {
        let iframe = this.refs.iframe;

        (iframe.contentWindow || iframe).onresize = () => this.handleResize();
    }

    componentWillUnmount() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            delete this._timeoutId;
        }
    }
}

export default ResizerDetection;