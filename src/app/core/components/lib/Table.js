'use strict'
import React from 'react'

const debug = (...messages) => console.log.apply(console, messages);

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.$handleTableOnClick = this._handleTableOnClick.bind(this);
    }

    componentDidMount() {
        var newKey = this._updateKey(this.props);
//      this.state.selectedKey=newKey;

        this.setState({selectedKey: newKey});
    }

    componentWillReceiveProps(props) {
        var newKey = this._updateKey(props);
        if (newKey === undefined) {
            return;
        }
        this.setState({selectedKey: newKey});
    }

    _updateKey(props) {
        var rows = this.getRows();
        if (!rows.length) {
            return undefined;
        }

        var curSelectedKey = this.state.selectedKey;
        if (curSelectedKey !== undefined && rows.find((r) => r.key === curSelectedKey)) {
            return undefined;
        }

        curSelectedKey = this.props.selectedKey;
        if (curSelectedKey !== undefined && rows.find((r) => r.key === curSelectedKey)) {
            return curSelectedKey;
        }

        curSelectedKey = rows[0].key;

        return curSelectedKey;
    }

    _handleTableOnClick(event) {
        var target = event.target;
        if (target.tagName === "TD") {
            target = target.parentNode;
        }
        if (target.tagName !== "TR") {
            return;
        }

        var rowKey = target.getAttribute("data-key");
        if (!rowKey) {
            return;
        }

        this.setState({selectedKey: rowKey});
    }

    /**
     *
     * @returns {Array}
     */
    getRows() {
        return this.state.rows || this.props.rows || [];
    }

    /**
     *
     * @returns {Object|{}}
     */
    getSelectedRow() {
        var rows = this.getRows();
        var state = this.state;

        return rows.find((r) => r.key === state.selectedKey) || {};
    }
}
