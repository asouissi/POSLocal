import React, {Component} from 'react'
import {connect} from 'react-redux'
import {uploadDraws} from '../reducers/actions'
import {FormattedMessage} from 'react-intl';
import Breadcrumbs from 'react-breadcrumbs'
import Box from '../../../core/components/lib/Box';
import FileChooser from '../../../core/components/lib/FileChooser';
import CustomGriddle, {DateDisplay, CurrencyDisplay} from '../../../core/components/lib/CustomGriddle';
import Loader from '../../../core/components/lib/Loader';
import {Row, Col} from 'react-bootstrap';

import FileDropZone from '../../../core/components/lib/FileDropZone';
import flow from 'lodash/flow'
import HTML5Backend from 'react-dnd-html5-backend';
var DragDropContext = require('react-dnd').DragDropContext;

const XlsxLoader = () => {
    return new Promise(resolve => {
        require.ensure(['xlsx'], () => {
            resolve({
                xlsx: require('xlsx')
            });
        });
    });
};

const DEFAULT_EMPTY = [];

const to_json = (workbook, xlsx) => {
    var result = {};


    var sheet = formatDate(workbook.Sheets[workbook.SheetNames[0]]);

    var roa = sheetToArrayObject(sheet, xlsx);

    if (roa && roa.rows.length > 0) {
        result = roa;//formatColumnName(roa);
    }

    return result;
};

const columns = [
    'actcode', 'dosidrefinance', 'dosexternalref', 'dosdtdeb', 'dosmtproduct', 'devcode', 'iruserialnumber', 'varcode',
    'irurefurbishyear', 'iriimmat', 'acacpde', 'napcode', 'iridtctgrise', 'irccolor', 'irimileage', 'adrtaxarea'
];

const columnsMandatory = [
    'actcode', 'dosidrefinance', 'dosexternalref', 'dosdtdeb', 'dosmtproduct', 'devcode'
];

const sheetToArrayObject = (sheet, xlsx) => {

    // Get headers.
    var headers = [];

    if (!sheet['!ref']) {
        return
    }
    var range = xlsx.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r;
    /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[xlsx.utils.encode_cell({c: C, r: R})];
        /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) {
            cell.w = columns[C];
            hdr = xlsx.utils.format_cell(cell);
        }
        headers.push(hdr);
    }
    // For each sheets, convert to json.
    var rows = xlsx.utils.sheet_to_json(sheet);
    let errors = [];
    if (rows.length > 0) {
        rows.forEach(function (row, index) {
            // Set empty cell to ''.
            columnsMandatory.forEach(manda => {
                if (row[manda] == undefined) {
                    errors.push((<p> {'Line number: ' + (index + 1) + ' field required: ' + manda}</p>));//todo get column name
                }
            });

            headers.forEach((hd) => {
                if (row[hd] == undefined) {
                    row[hd] = '';
                }
            });
        });
    }

    return {rows, errors};

}

const formatDate = (sheet) => {
    for (let key in sheet) {
        let cell = sheet[key];
        if (cell.t === 'n' && cell.w && cell.w.indexOf("/") !== -1) {
            cell.w = new Date(1900, 0, cell.v - 1).getTime();
        }
    }
    return sheet;
};


const fix_key = (key) => {
    return key.replace(/\s/g, '').toUpperCase();
}

const formatColumnName = (rows) => {
    return rows.map(row => {
        let newRow = Object.assign({},
            ...Object.keys(row).map(key => ({[fix_key(key)]: row[key]}))
        );
        return newRow;
    });
};

const fixdata = (data) => {
    var o = "", l = 0, w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

export class ImportCreditLineDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            errors: []
        }
    }

    componentWillMount() {
        XlsxLoader().then(({xlsx}) => {
            this.setState({xlsx});
        });
    }

    handleFile = (event) => {
        let file = event.target.files[0];

        if (!file) {
            return
        }

        var reader = new FileReader();
        var out = null;
        reader.onload = (e) => {
            var data = e.target.result;
            var arr = fixdata(data);
            var wb = this.state.xlsx.read(btoa(arr), {type: 'base64', cellDates: true});
            out = to_json(wb, this.state.xlsx);
            this.setState({assets: out.rows})
            this.setState({errors: out.errors})
        };
        reader.readAsArrayBuffer(file);
    };

    handleAssetsImportClick = (event) => {
        if (!this.state.errors.length) {
            var formData = new FormData();
            formData.append('file', this.refs.fileChooser.refs.inputFile.files[0]);
            this.props.dispatch(uploadDraws(formData))

        }
    };

    render() {

        const columnMetadata = [

            {
                columnName: 'actcode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.dealer"
                                               defaultMessage="Dealer"/>,

            },
            {
                columnName: 'dosidrefinance',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.scale"
                                               defaultMessage="Credit line"/>
            },
            {
                columnName: 'dosexternalref',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.invoice"
                                               defaultMessage="Invoice"/>
            },
            {
                columnName: 'dosdtdeb',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.startdate"
                                               defaultMessage="Start date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'dosmtproduct',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.amount"
                                               defaultMessage="Amount"/>,
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'devcode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.currency"
                                               defaultMessage="Currency"/>
            },
            {
                columnName: 'iruserialnumber',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.vin"
                                               defaultMessage="VIN"/>
            },
            {
                columnName: 'varcode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.model"
                                               defaultMessage="Model"/>
            },
            {
                columnName: 'irurefurbishyear',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.year"
                                               defaultMessage="Year"/>
            },
            {
                columnName: 'acacode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.assettype"
                                               defaultMessage="Asset type"/>
            },
            {
                columnName: 'napcode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.assetclass"
                                               defaultMessage="Asset class"/>
            },
            {
                iriimmat: 'iriimmat',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.registration"
                                               defaultMessage="Registration"/>
            },
            {
                columnName: 'iridtctgrise',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.registrationdate"
                                               defaultMessage="Registration date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'irccolor',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.color"
                                               defaultMessage="Color"/>
            },
            {
                columnName: 'irimileage',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.mileage"
                                               defaultMessage="Mileage"/>
            },
            {
                columnName: 'adrtaxarea',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.import.column.adrtaxarea"
                                               defaultMessage="SIRET"/>
            }

        ];

        let message = (
            <p className="center-text">
                <FormattedMessage id="wholesale.creditlinedetail.import"
                                  defaultMessage="Choose file or drop Excel file here"/>
            </p>
        );
        let noDataMessage = this.props.isLoading ? <Loader/> : message;

        return (
            <div className="import-creditlinedetail-content">
                <Breadcrumbs
                    routes={this.props.routes}
                    params={this.props.params} excludes={['app', '/']}/>

                <Box type="primary " className="assets-table-container"
                     title={<FormattedMessage id="wholesale.creditline.detail.asset.import"
                                              defaultMessage="Import assets"/>}>
                    <Row>
                        <Col md={4}>
                            <FileChooser ref="fileChooser" onChange={this.handleFile}
                                         title={<FormattedMessage id="wholesale.creditline.detail.asset.choose"
                                                                  defaultMessage="Select a file"/>}
                            />
                        </Col>
                        <Col md={8}>
                            <div className="dl-container pull-right">
                                <FormattedMessage id="wholesale.creditline.detail.asset.download"
                                                  defaultMessage="Template Excel file is availble here "/>
                                <a href="data/template_import.xlsx" className="fa fa-file-excel-o"/>
                            </div>
                        </Col>
                    </Row>
                    <FileDropZone onDrop={(e) => this.handleFile(e)}>
                        <CustomGriddle
                            tableClassName="table table-hover import-table"
                            useGriddleStyles={false}
                            results={this.state.assets}
                            columns={columns}
                            columnMetadata={columnMetadata}
                            initialSort='Dealer'
                            initialSortAscending={false}
                            enableInfiniteScroll={true}
                            bodyHeight="450"
                            resultsPerPage={12}
                            useFixedHeader={true}
                            noDataMessage={noDataMessage}
                        /></FileDropZone>
                    {
                        this.state.assets.length ? (
                                <div className="asset-creation-btn" onClick={this.handleAssetsImportClick}
                                     title="Save assets">
                                    <i className="fa fa-save icon-circle"/>
                                    <span>Upload assets</span>
                                </div>
                            ) : DEFAULT_EMPTY

                    }

                </Box>
                {!this.state.errors.length ? DEFAULT_EMPTY : (
                        <Box type="primary " className="assets-errors"
                             title={<FormattedMessage id="wholesale.creditline.detail.asset.errors"
                                                      defaultMessage="Errors"/>}>
                            {this.state.errors}
                        </Box>

                    )}

            </div>
        );
    }
}
export default flow(
    DragDropContext(HTML5Backend),
    connect(
        state => ({})
    ))
(ImportCreditLineDetailContainer);