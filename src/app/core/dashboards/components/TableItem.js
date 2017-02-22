import React from 'react'
import {Link} from 'react-router';
import ChartItem from './ChartsJS'
import Box from '../../components/lib/Box.js';

export default class TableItem extends ChartItem {

    renderTable(data) {
        const {formatMessage, formatNumber, formats} = this.context.intl;
        let rows = [];
        for (let row of data) {
            let cells = row.map((cell, cellIndex) => {
                let className = cell.value || cell.value === 0 ? "table-item-cell" : "table-item-hidden";
                if (cell.isheader) className += " table-item-header";
                if (cell.istotal) className += " table-item-total";
                var formatted = cell.value;
                if (/^-?\d/.test(cell.value)) {

                    if (cellIndex)  className += " align-right";
                    if (_.isNumber(cell.value)) {
                        let style = {style: cell.style};
                        if (cell.style === 'currency') {
                            style = formats.number.currencyFormat;
                        }
                        if (!cell.style || cell.style === 'decimal') {
                            style = formats.number.float;
                        }

                        formatted = formatNumber(cell.value, style);
                    }

                } else if (cell.value) {
                    formatted = formatMessage({id: cell.value, defaultMessage: cell.value});
                }

                if (cell.link) {
                    switch (cell.link.type) {
                        case "external":
                            var url = cell.link.url;
                            if (!/(https?:\/\/).*/.test(url)) url = "https://" + url;
                            formatted = (<a className="clickable" target="_blank" href={url}>{formatted}</a>);
                            break;
                        case "internal":
                            formatted = (<Link className="clickable" to={cell.link.url}>{formatted}</Link>);
                            break;
                        case "drill":
                            const self = this;
                            const func = (event, active) => {
                                self.handleClick(event, {
                                    index: 1,
                                    link: cell.link.url,
                                    data: data,
                                    key: cell.link.key
                                });
                            }
                            formatted = (<span className="clickable" onClick={() => func()}>{formatted}</span>);
                            break;
                    }
                }
                return (<td className={className}>{formatted}</td>);
            });
            rows.push((<tr className="table-row">{cells}</tr>));
        }
        return (<table className="table-item">{rows}</table>);
    }

    render() {
        const {config} = this.props;
        var table = this.renderTable(config.data);
        let style = {};
        if (config.background) {
            style.backgroundColor = config.background;
            style.borderTopColor = config.background;
            style.color = '#fff';
        }
        return (
            <Box className="table-item-box box-primary" icon="table" style={style}
                 title={this.context.intl.formatMessage({id: config.title, defaultMessage: config.title})}>
                {table}
            </Box>
        );
    }
}
