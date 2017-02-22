import React, {Component} from 'react'
import Griddle from 'griddle-react'
import Pager from '../../../core/components/lib/Pager'
import {FormattedMessage} from 'react-intl';
import RadioButtonGroupEntry from "../../../core/components/lib/RadioButtonGroupEntry";
import {selectFilter} from '../reducers/actions'
import {getBootstrapResolution} from '../../../core/utils/Utils';
import MediaQuery from 'react-responsive';
import filter from 'lodash/filter';
import each from 'lodash/each';
import {reduxForm} from 'redux-form';
import TextEntry from "../../../core/components/lib/TextEntry";
import {DateDisplay} from '../../../core/components/lib/CustomGriddle';
import RefTableDisplay from '../../../core/components/lib/RefTableDisplay';
import {tables,getReferenceTable} from '../../../core/reducers/referenceTable'
import {connect} from "react-redux";
import flow from 'lodash/flow'
import config from './config'
import {getAwesomeIconFromMimeType, getMimeTypeFromFilename} from '../../../core/utils/MimeTypes'
import applyAccessKeysOn from '../../../common/accesskeys/AccessKeysForComponents';

class ButtonActionDisplay extends Component{

    render(){

        return ( <a href={config.hostname + '/RestServices/' + this.props.metadata.customComponentMetadata.restService + this.props.data }>
                    <i className={this.props.metadata.customComponentMetadata.className}/>
                </a>);
    }
}

class IconDisplay extends Component{

    render() {

        let mimeType =  getMimeTypeFromFilename(this.props.data);
        let mimeIcon =  getAwesomeIconFromMimeType(mimeType || 'application/download');
        return (<span className={'fa fa-' + mimeIcon}/>);
    }

}
class CustomFilterComponent extends Component {

    constructor(props){
        super(props);
        let state = {buttonsFilter: "", textFilter: ""};
        this.state = state;

    }
    componentWillMount(){
        let state = {  buttonsFilter: this.props.filter.buttonsFilter, textFilter: ""};
        this.setState(state);
        this.props.changeFilter(state);

    }

    updateFilter = () => {
        this.props.dispatch(selectFilter(this.state));
        this.props.changeFilter(this.state);
    }

    searchChange = (value) => {
        this.setState({buttonsFilter: value}, this.updateFilter);

    }

    handleSearchChange =(event, value) => {
        this.setState({textFilter: value}, this.updateFilter);
    }

    render() {
        let fields = {


            "RTL": {
                label: <FormattedMessage id="pos.documents.buttonFilter.management"
                                         defaultMessage="Retail"/>
            },
            "FLEET": {
                label: <FormattedMessage id="pos.documents.buttonFilter.fleet" defaultMessage="Fleet"/>
            }
        };

        return (
            <div className="flex-row">
                <TextEntry name="search"
                           placeholder="Filter results"
                           groupClassName="col-xs-12 col-md-6"
                           onChange={this.handleSearchChange}
                           updateOnChange={true}
                />
                <MediaQuery query={'(min-width: ' + getBootstrapResolution("md") + ')'}>
                    <RadioButtonGroupEntry className="col-xs-12 col-md-6"
                                           uniqueSelected={true}
                                           fields={fields}
                                           onChange={this.searchChange}

                    />
                </MediaQuery>
            </div>
        )
    }
}

class DocumentsTable extends Component {

    render() {

        const defaultColumns = ['dmapath','dmafilename', 'dmadt', 'dmatype', 'dmastatus', 'dmacomment','dmaid']

        const defaultColumnMetadata = [
            {
                columnName: defaultColumns[0],
                displayName:"",
                customComponent: IconDisplay,
            },
            {
                columnName: defaultColumns[1],
                displayName: <FormattedMessage id="pos.documents.search.table.col.dmaname" defaultMessage="File name"/>,

            },
            {
                columnName: defaultColumns[2],
                displayName: <FormattedMessage id="pos.documents.search.table.col.dmadt"
                                               defaultMessage="Creation date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: defaultColumns[3],
                displayName: <FormattedMessage id="pos.documents.search.table.col.dmatype"
                                               defaultMessage="Document type"/>,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANTUSPARAM,
                    refParams: {'tusnom': 'DMATYPE'},
                    allowEmptyParams: true,
                }

            },
            {
                columnName: defaultColumns[4],
                displayName: <FormattedMessage id="pos.documents.search.table.col.dmastatus"
                                               defaultMessage="Status"/>,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANTUSPARAM,
                    refParams: {'tusnom': 'DMASTATUS'},
                    allowEmptyParams: true,
                }
            },

            {
                columnName: defaultColumns[5],
                displayName: <FormattedMessage id="pos.documents.search.table.col.dmacomment" defaultMessage="Comment"/>,

            },
            {
                columnName: defaultColumns[6],
                displayName:"",
                customComponent: ButtonActionDisplay,
                customComponentMetadata: {
                    restService:'documentmanagements/content/',
                    className:"glyphicon glyphicon-cloud-download gi-2x gi-paddR"
                }
            },

        ]

        const {columns, columnMetadata} = applyAccessKeysOn("griddle", this.props.accessKeys, {defaultColumns, defaultColumnMetadata})
        const mapStateToProps = (state) => {
            return {
                filter: state.documents.filter,

            }
        }
        const mapDispatchToProps = {
            selectFilter
        }

        var getFieldLabel = (reftable,key) =>{
            let label = key;
            var obj = reftable.find(obj => {
                return obj.code.toLowerCase() === key
            });
            if (obj) {
                label = obj.label;
            }

            return label;
        }
        var customFilterFunction = (items, filters) => {
            var resultats = filter(items, (item) => {
                    var buttonFilter = filters.buttonsFilter;
                    var key = "dmanature";
                    var value = item[key];

                    if ( !buttonFilter || String(value).toLowerCase() == ( buttonFilter.toLowerCase()))
                        return true;

                return false;
            });
            var textFilter = filters.textFilter;

            if(textFilter && resultats) {
                const searchFilterInValue = (value) =>{
                    if( value != null ) {
                       return (value.toString().toLowerCase().indexOf(textFilter.toLowerCase()) >= 0);
                    }else{
                        return false;
                    }

                }
                resultats = filter(resultats, (item) => {

                    var isExist = false;
                    each(item, (value, key) => {
                        value = (value && value.toString().toLowerCase()) || "";
                        if(!isExist){
                            switch (key) {
                               /* case columns[1]:

                                   isExist = searchFilterInValue(value);
                                    break;*/
                                case columns[1]:
                                    isExist = searchFilterInValue(value);
                                    break;
                                case columns[3]:
                                    isExist = searchFilterInValue(getFieldLabel(this.props.dmaType,value));
                                    break;
                                case columns[4]:
                                    isExist = searchFilterInValue(getFieldLabel(this.props.dmaStatus,value));
                                    break;
                                case columns[5]:
                                    isExist = searchFilterInValue(value);
                                    break;
                                default:
                                    isExist = false;
                            }
                    }

                    });
                    return isExist;

                });
            }
            return resultats;
        };


        var customFilterComponent = flow(reduxForm({form: 'filter'}), connect(mapStateToProps, mapDispatchToProps)) (CustomFilterComponent);

        return (
            <Griddle
                tableClassName="table table-hover"
                useGriddleStyles={false}
                results={ this.props.rows }
                maxRowsText={12}
                columns={ columns }
                columnMetadata={ columnMetadata }
                height={ 1000 }
                useCustomFilterer={true}
                useCustomFilterComponent={true}
                useCustomPagerComponent={true}
                customFilterComponent={customFilterComponent}
                customFilterer={customFilterFunction}
                showFilter={true}
                customRowComponentClassName="griddle-body-custom"
                customPagerComponent={ Pager }
                resultsPerPage={12}

            />
        )
    }
}
export default connect(
    state => ({
         dmaType  : getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMATYPE'}).data,
         dmaStatus: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMASTATUS'}).data
    })
)(DocumentsTable);