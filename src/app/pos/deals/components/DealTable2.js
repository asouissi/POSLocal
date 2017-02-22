import React, {Component} from 'react';
import Griddle from 'griddle-react';
import Pager from '../../../core/components/lib/Pager';
import {Link} from 'react-router';
import {FormattedNumber, FormattedMessage, FormattedDate} from 'react-intl';
import  {DEAL, QUOTE, DRAWNDEAL} from '../../index';
import {getBootstrapResolution} from '../../../core/utils/Utils';
import PatternGenerator from '../../../core/components/lib/responsiveGriddle';
import MediaQuery from 'react-responsive';
import {reduxForm} from 'redux-form';
import TextEntry from "../../../core/components/lib/TextEntry";
import RadioButtonGroupEntry from "../../../core/components/lib/RadioButtonGroupEntry";
import FilterModal from './FilterModal';
import {connect} from "react-redux";
import {selectFilter} from '../reducers/deals'
import StepDisplay from '../../../core/components/lib/StepDisplay';
import pick from 'lodash/pick';
import {compose} from 'redux';
import applyAccessKeysOn from '../../../common/accesskeys/AccessKeysForComponents';
import Loader from '../../../core/components/lib/Loader';

// Link on reference
class LinkDisplay extends Component {
    render() {
        let routes = this.props.metadata.customComponentMetadata.routes;
        let hasDealRoute = routes.indexOf(DEAL) !== -1;
        let hasQuoteRoute = routes.indexOf(QUOTE) !== -1;
        //let hasDrawRoute = routes.indexOf(DRAWNDEAL) !== -1;

        let rowData = this.props.rowData;

        let nav = DEAL + '/';
        if (hasDealRoute && hasQuoteRoute) {
            let isDeal = rowData.dprnom && rowData.dprnom.indexOf('deal') > -1;
            nav = isDeal ? DEAL + '/' : QUOTE + '/';
        } else if (hasQuoteRoute) {
            nav = QUOTE + '/';
        }
        // if(hasDrawRoute && this.props.rowData.dprnom.indexOf('drawn') > -1){
        if (rowData.dprnom && rowData.dprnom.indexOf('drawn') > -1) {
            nav = DRAWNDEAL + '/';

            return (<Link
                to={{
                    pathname: nav + rowData.dosid,
                    query: {parentDosId: rowData.dosidautorisation}
                }}>{this.props.data}</Link>);
        }

        return (<Link to={nav + rowData.dosid}>{this.props.data}</Link>);
    }
}

// Format steps
class StepDisplayWrapper extends Component {
    render() {
        return (<StepDisplay className="truncate" wrapper="span" code={this.props.data}/>);
    }
}

// Format last modified or creation dates
class LastModifDateDisplay extends Component {
    render() {
        let dateToShow = this.props.data ? this.props.data : this.props.rowData.dprdtcreation;
        var strDate = dateToShow && <FormattedDate value={dateToShow}/>;

        return (<span>{strDate}</span>);
    }
}
// DIRTY FIX : the amount for new quote are missing the pcrordre and pcrid (related to the scale)
// that's why the webservice is pfiivestissement is set to null, in that case we take the dpimt
// When the scale/term is fixed on newquote, please remove this !
class AmountDisplay extends Component {
    render() {
        let value = this.props.data || this.props.rowData.dpimt || "";
        return <FormattedNumber value={value} format="currencyFormat" currency={this.props.rowData.devcode}/>
    }
}
// Display Draw
class DrawDisplay extends Component {
    render() {
        let label = this.props.data;

        let MFType = this.props.metadata.customComponentMetadata.MFTypes.find(mf => {
            return mf.code === this.props.data
        });
        let isMF = this.props.rowData.tpgcode && MFType;

        if (isMF) {
            return (<Link className="btn btn-xs btn-primary"
                          to={{pathname: DRAWNDEAL, query: {parentDosId: this.props.rowData.dosid}}}>Draw</Link>);
        } else {
            return null;
        }

    }
}

//Render the badge for the mobile pattern
class BadgeStep extends Component {
    render() {
        let format_label = (l) => {
            let shortLabel = l.split(" ").map((m) => m.substr(0, 1).toUpperCase());
            return (<span title={l}>{shortLabel}</span>);
        };
        return (<StepDisplay wrapper="div" format_label={format_label} code={this.props.data}/>);
    }
}

// Custom filter component
class CustomFilterComponent extends Component {
    componentWillMount() {
        let state = {searchField: "", buttonsField: this.props.filter.buttonsField, showFilterModal: false};
        this.state = state;
        this.props.changeFilter(state);
    }

    cleanFilters() {
        this.state = ({searchField: "", buttonsField: "", showFilterModal: false});
        this.updateFilter();
    }

    updateFilter() {
        this.props.dispatch(selectFilter(this.state));
        this.props.changeFilter(this.state);
    }

    handleButtonsChange = value => {
        this.setState({buttonsField: value}, this.updateFilter);
    }

    handleSearchChange = (event, value) => {
        this.setState({searchField: value}, this.updateFilter);
    }

    openFilterModal = () => {
        this.setState({showFilterModal: true});
    }
    closeFilterModal = () => {
        this.setState({showFilterModal: false});
    }

    render() {
        let fields = {
            "nego": {
                label: <FormattedMessage id="pos.mydeals.buttonFilter.negociation" defaultMessage="Negotiation"/>
            },
            "fin": {
                label: <FormattedMessage id="pos.mydeals.buttonFilter.finalisation" defaultMessage="Finalisation"/>
            },
            "prod": {
                label: <FormattedMessage id="pos.mydeals.buttonFilter.production" defaultMessage="Production"/>,
            },
        };

        if (this.state.buttonsField)
            fields[this.state.buttonsField].activeByDefault = true;

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
                                           advancedBtn={true}
                                           openFilterModal={this.openFilterModal}
                                           onChange={this.handleButtonsChange}/>
                </MediaQuery>

                <FilterModal showModal={this.state.showFilterModal}
                             closeFilterModal={this.closeFilterModal}

                />
            </div>
        )
    }
}

class DealTable2 extends Component {
    dealTableFilter = (results, filter) => {
        const self = this;
        const searchFilterArray = filter.searchField && filter.searchField.toUpperCase().split(" ").filter(value => value);
        const buttonsFilter = filter.buttonsField.toUpperCase();
        const listjalon = this.props.listJalon;

        results = results.filter(item => !buttonsFilter || item["phacode"].toUpperCase() == buttonsFilter);

        results = results.filter(item => {
            let isFiltredValue = false;
            if (!searchFilterArray)
                return true;
            item = pick(item, this.state.columns);
            Object.keys(item).forEach(k => {
                let v = item[k];
                if (!isFiltredValue && v) {
                    v = String(v).toUpperCase();
                    if (k == "dprdtmodif")
                        v = new Date(parseInt(v)).toLocaleDateString();
                    if (k == "jalcode") {
                        let j = listjalon.find(j => j.code.toUpperCase() === v);
                        v = (j && j.label.toUpperCase()) || v;
                    }
                    searchFilterArray.forEach(filterValue => isFiltredValue = filterValue && v.includes(filterValue));
                }
            });
            return isFiltredValue;
        });
        return results;
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps){
        const {accessKeys, menuItems, listProfile, id} = nextProps;
        const defaultColumns = ['dprnumero', 'dprnom', 'actnom', 'dprdtmodif', 'pfiinvestissement', 'jalcode', 'dpmlibelle', 'tpgcode', 'dprapproxdureean', 'pfikilometrage', 'monthly'];
        const defaultColumnMetadata = [
            {
                columnName: 'dprnumero',
                sortDirectionCycle: ['desc', 'asc', null],
                displayName: <FormattedMessage id="pos.mydeals.reference.column" defaultMessage="Reference"/>,
                customComponent: LinkDisplay,
                customComponentMetadata: {
                    routes: menuItems.filter(item => item.visible).map(item => item.route)
                }
            },
            {
                columnName: 'dprnom',
                displayName: <FormattedMessage id="pos.mydeals.name.column" defaultMessage="Deal name"/>
            },
            {
                columnName: 'dprreseaucial',
                displayName: <FormattedMessage id="pos.salenetwork.name.column" defaultMessage="Sale network"/>
            },
            {
                columnName: 'actnom',
                displayName: <FormattedMessage id="pos.mydeals.customer.column" defaultMessage="Customer"/>
            },
            {
                columnName: 'dprdtmodif',
                displayName: <FormattedMessage id="pos.mydeals.modifdate.column" defaultMessage='Last modified'/>,
                customComponent: LastModifDateDisplay
            },
            {
                columnName: 'pfiinvestissement',
                displayName: <FormattedMessage id="pos.mydeals.amount.column" defaultMessage='Amount'/>,
                customComponent: AmountDisplay
            },
            {
                columnName: 'jalcode',
                displayName: <FormattedMessage id="pos.mydeals.step.column" defaultMessage='Step'/>,
                customComponent: StepDisplayWrapper,
            },
            {
                columnName: 'dpmlibelle',
                displayName: <FormattedMessage id="pos.mydeals.asset.column" defaultMessage='Asset'/>
            },
            {
                columnName: 'tpgcode',
                displayName: <FormattedMessage id="pos.mydeals.mf.column" defaultMessage='MF'/>,  // props.columns[name].label
                customComponent: DrawDisplay,
                customComponentMetadata: {
                    MFTypes: listProfile,
                }
            },
            {
                columnName: 'ratepnb',
                displayName: <FormattedMessage id="pos.mydeals.ratepnb.column" defaultMessage='Profitability'/>,  // props.columns[name].label
            }
            ,
            {
                columnName: 'dprapproxdureean',
                displayName: <FormattedMessage id="pos.mydeals.dprapproxdureean.column" defaultMessage='Duration'/>,
            },
            {
                columnName: 'pfikilometrage',
                displayName: <FormattedMessage id="pos.mydeals.pfikilometrage.column" defaultMessage='Mileage'/>,
            },
            {
                columnName: 'monthly',
                displayName: <FormattedMessage id="pos.mydeals.monthly.column" defaultMessage='Monthly'/>,
                customComponent: AmountDisplay
            }

        ];
        const defaultMobilePattern =
            {
                rowClass: "deals-custom-row col-xs-12",
                elements: [
                    {
                        className: "flex-row",
                        children: [
                            {
                                columnName: "jalcode",
                                overrideCustomComponent: BadgeStep,
                                useCustomComponent: true,
                                className: "mobile-badge",
                            },
                            {
                                className: "flex-col col1",
                                children: [
                                    {
                                        columnName: "dprreseaucial",
                                    },
                                    {
                                        columnName: "actnom",
                                    },
                                    {
                                        columnName: "dprnom",
                                    },
                                    {
                                        columnName: "dpmlibelle",
                                    }
                                ]
                            },
                            {
                                className: "flex-col col2",
                                children: [
                                    {
                                        columnName: "dprdtmodif",
                                        useCustomComponent: true,
                                    },
                                    {
                                        columnName: "pfiinvestissement",
                                        useCustomComponent: true,
                                    },
                                    {
                                        columnName: "monthly",
                                        useCustomComponent: true,
                                    },
                                    {
                                        columnName: "dprnumero",
                                        useCustomComponent: true,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }


        const {columns, columnMetadata, pattern} = applyAccessKeysOn("griddle", accessKeys, {
            defaultColumns,
            defaultColumnMetadata,
            pattern: defaultMobilePattern
        });

        this.setState({columnMetadata, columns, mobilePattern: pattern});
    }

    render() {
        const loader = <Loader/>
        const {columnMetadata, columns, mobilePattern} = this.state;

        let render = columnMetadata && columns && mobilePattern && this.props.listJalon && this.props.listProfile;

        if (!render) {
            return loader;
        }

        let message = (<p className="center-text"><FormattedMessage id="pos.mydeals.nodeals"
                                                                    defaultMessage="You have no deals, create a "/>
            <Link to={ DEAL}><FormattedMessage id="pos.mydeals.newdeal" defaultMessage=" deal / "/></Link>
            <Link to={ QUOTE}><FormattedMessage id="pos.mydeals.newquote" defaultMessage="quote"/></Link></p>);
        let noDataMessage = this.props.isLoading ? loader : message;

        const customFilterComponent = compose(
            reduxForm(CustomFilterComponent, {form: 'filter'}),
            connect((state) => ({filter: state.deals.filter}
            ), {selectFilter})
        )(CustomFilterComponent);

        return (
            <MediaQuery query={'(max-width: ' + getBootstrapResolution("md") + ')'}>
                {(isMobile) => {
                    return <Griddle
                        tableClassName="table table-hover"
                        useGriddleStyles={false}
                        results={this.props.rows}
                        initialSort='dprnumero'
                        sortAscending={false}
                        columns={columns}
                        columnMetadata={columnMetadata}
                        resultsPerPage={isMobile ? 30 : 12}
                        useCustomPagerComponent={true}
                        customPagerComponent={Pager}
                        showFilter={true}
                        noDataMessage={noDataMessage}
                        useCustomFilterer={true}
                        useCustomFilterComponent={true}
                        customFilterComponent={customFilterComponent}
                        customFilterer={this.dealTableFilter}
                        customRowComponent={PatternGenerator}
                        useCustomRowComponent={isMobile}
                        customRowComponentClassName="griddle-body-custom"
                        globalData={{
                            "metadata": columnMetadata,
                            //"pattern": SantaderPattern
                            "pattern": mobilePattern
                        }}
                    />
                }}
            </MediaQuery>
        )
    }
}

export default DealTable2;
