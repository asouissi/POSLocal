'use strict'
import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl';
import Modal from '../../../../core/components/lib/Modal.js'
import NumberEntry from '../../../../core/components/lib/NumberEntry.js'
import {notify} from '../../../../core/components/lib/notify';

import QuoteUtils from '../../utils/QuoteUtils'
import cloneDeep from 'lodash/cloneDeep'
import {excelClipboardToJson, jsonExcelClipboard} from '../../../../core/utils/parsing'


import clipboard from 'clipboard-js'
const monthsNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export default class ScheduledPaymentProfilePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    setupPropsToVars(props) {
        var dateMs = props.startDate || Date.now()
        var date = new Date(dateMs)
        let quote = props.quote
        var payment = QuoteUtils.getPaymentMnt(quote)
        var pfinbperiodes = quote.pfinbperiodes || 12
        var nbYear = Math.ceil(pfinbperiodes / 12)

        return {date, payment, pfinbperiodes, nbYear}
    }

    createCollumns(props) {
        var columns = [""]
        const {nbYear, date} = this.setupPropsToVars(props)

        for (let i = 0; i < nbYear; i++) {
            var year = date.getFullYear() + i
            columns.push(year + '/' + (year + 1))
        }
        return columns
    }

    createRows(props, pastedData) {
        const {date, payment, pfinbperiodes, nbYear} = this.setupPropsToVars(props)
        var _rows = []

        for (var i = 0; i < 12; i++) {
            var row = [monthsNames[(date.getMonth() + i) % 12]]
            for (var j = 0; j < nbYear; j++) {
                var idx = j * 12 + i;
                if (pfinbperiodes > 0 && idx >= pfinbperiodes)
                    continue
                row.push(pastedData && pastedData[i] && pastedData[i][j] ? pastedData[i][j] : payment ? payment : "0")
            }
            _rows.push(row)
        }
        return {rows: _rows}
    }

    initRows(props, monthlyPayment) {

        const {date, payment, pfinbperiodes, nbYear} = this.setupPropsToVars(props);
        monthlyPayment = (monthlyPayment) ? monthlyPayment : "0";

        var res = [];
        for (var i = 0; i < 12; i++) {
            let col = []
            for (var j = 0; j < nbYear + 1; j++) {
                var idx = (j - 1) * 12 + i;
                if (pfinbperiodes > 0 && idx >= pfinbperiodes)
                    continue
                if (j === 0) {
                    col[j] = <td className="month">{monthsNames[(date.getMonth() + i) % 12]}</td>;
                } else {
                    col[j] = <td><NumberEntry onChange={(event, value) => this.handleInputChange(i, j, value)}
                                              value={monthlyPayment} numberOfDigitAfterDecimal="2"/></td>;
                }

            }
            res[i] = <tr>{col}</tr>;
        }

        return res;
    }

    handlePaste = (event) => {
        let pasted = event.clipboardData.getData('text/plain')
        pasted = excelClipboardToJson(pasted)
        if (pasted) {
            event.preventDefault()
            this.setState({oldData: this.state.rows})
            var newState = this.createRows(this.props, pasted)
            this.setState(newState)
            notify.show("Table pasted from your clipboard", "warning", 2500)
        }
    }

    getJsonTableFromState() {
        return cloneDeep(this.state.rows).map(row => {
            row.shift()
            return row
        })
    }

    toggle() {
        this.refs.modal.toggle();
    }

    handleSaveEvent() {
        console.log("YOU NEED TO SAVE THIS !")
        console.log(this.getJsonTableFromState(this.state.rows))
        this.refs.modal.toggle();
    }

    handleResetEvent() {
        this.setState({oldData: this.state.rows})
        this.setState(this.createRows(this.props, []))
        notify.show("Reset of the table, you can undo with the assiciated button", "warning", 2500)
    }

    hangleCopyEvent() {
        var select = jsonExcelClipboard(this.getJsonTableFromState())
        if (select) {
            clipboard.copy({"text/plain": select})
            notify.show("Table copied in the clipboard", "success", 2000)
        }
    }

    handleInputChange(y, x, value) {
        if (this.state.rows) {
            this.state.rows[y][x] = value
        }
    }

    componentDidMount() {
        window.addEventListener('paste', this.handlePaste);
    }

    componentWillUnmount() {
        window.removeEventListener('paste', this.handlePaste);
        this.setState({rows: undefined, oldData: undefined})
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(this.state && this.state.pastedData) || nextState.pastedData != this.state.pastedData
    }

    undoPaste() {
        if (this.state.oldData && this.state.oldData != this.state.rows) {
            this.setState({rows: this.state.oldData})
            notify.show("Undo to the last paste action, restoring the table", "warning", 2500)
        }
    }

    render() {
        var monthlyPayment = QuoteUtils.getPaymentMnt(this.props.quote);
        var rows = this.initRows(this.props, monthlyPayment);

        if (this.state.rows) {
            rows = this.state.rows.map((row, rowIndex) => {
                return (<tr>{
                    Object.keys(row).map((key, indexCell) => {
                        const value = row[key]
                        if (indexCell == 0)
                            return (<td className="month">{value}</td>)
                        else
                            return (<td><NumberEntry
                                onChange={(event, value) => this.handleInputChange(rowIndex, indexCell, value)}
                                value={value} numberOfDigitAfterDecimal="2"/></td>)
                    })
                }</tr>)
            })
        }
        const collumns = this.createCollumns(this.props).map(collumn => {
            return (<th>{collumn}</th>)
        })
        const buttons = [
            <button onClick={() => this.undoPaste()} key="undoPasteButton" className="btn btn-secondary hidden"
                    type="button"><i className="fa fa-undo"></i> Undo Paste
            </button>,
            <button onClick={() => this.hangleCopyEvent()} key="copyButton" className="btn btn-secondary"
                    type="button"><i className="fa fa-copy"></i>Copy
            </button>
        ]

        return (
            <Modal ref="modal"
                   title={<FormattedMessage id="pos.quote.schedule.title" defaultMessage="Payment schedule"/>}
                   onReset={event => this.handleResetEvent(event)}
                   onSave={event => this.handleSaveEvent(event)}
                   specificButtons={buttons}>
                <div className="pull-right">
                </div>
                <table className="table paymentTable">
                    <thead>
                    <tr>{collumns}</tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </Modal>
        );
    }
}
