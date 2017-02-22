import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl';

import {Link} from 'react-router';

import Griddle from 'griddle-react';
import deep from 'griddle-react/modules/deep';
import Pager from '../../../core/components/lib/Pager';

import Box from '../../../core/components/lib/Box'

import {getBootstrapResolution} from '../../../core/utils/Utils';
import {CUSTOMER_TYPE_INDIVIDUAL} from '../../../common/actor/actorUtils';
import PatternGenerator from '../../../core/components/lib/responsiveGriddle';
import MediaQuery from 'react-responsive';
import applyAccessKeysOn from '../../../common/accesskeys/AccessKeysForComponents';
import DateDisplay from '../../../core/components/lib/DateDisplay';
import Loader from '../../../core/components/lib/Loader';

const DEFAULT_BODY_HEIGHT = 450;

//Link on reference
class LinkDisplay extends Component {
    render() {
        return (
            <Link to={'/actor/' + this.props.rowData.actid}>
                {this.props.data}
            </Link>
        );
    }
}

class BirthDateDisplay extends Component {
    render() {
        return this.props.rowData.acttype === CUSTOMER_TYPE_INDIVIDUAL && <DateDisplay {...this.props}/>;
    }
}

class CustomActionDisplay extends Component {
    render() {
        return (<a href={"javascript:void(0);"} onClick={() => {
            event.preventDefault();
            event.stopPropagation();
            this.props.metadata.customComponentMetadata.onClick(this.props.rowData)
        }
        }>{this.props.rowData.actcode}</a>);
    }
}

class ActorTypeDisplay extends Component {
    render() {
        let label = this.props.data;
        let type = this.props.metadata.customComponentMetadata.actorTypes.find(type => {
            return type.code === this.props.data
        });
        if (type) {
            label = type.label;
        }

        return (<span >{label}</span>);
    }
}

class AddressDisplay extends Component {
    render() {
        let address = this.props.rowData.address;
        return (<span className="multiline-display">{address}</span>);
    }
}

export default class ActorSearchTable extends Component {

    constructor(props){
        super(props);
        this.state={};
    }

    componentWillReceiveProps(nextProps){    const {listTypes, accessKeys , acttype} = nextProps;
        const defaultColumns = acttype === "PART" ?
            ['actcode', 'actlibcourt', 'actnom', 'acttype', 'apadtnaiss', 'adrtaxarea', 'address']:
            ['actcode', 'actlibcourt', 'actnom', 'acttype', 'adrtaxarea', 'address'];
        const defaultColumnMetadata = [
            {
                columnName: 'actcode',
                displayName: <FormattedMessage id="common.actor.search.table.col.actcode" defaultMessage="Client N°"/>,
                customComponent: LinkDisplay
            },
            {
                columnName: 'actlibcourt',
                displayName: <FormattedMessage id="common.actor.search.table.col.actlibcourt"
                                               defaultMessage="Short name"/>
            },
            {
                columnName: 'actnom',
                displayName: <FormattedMessage id="common.actor.search.table.col.actnom" defaultMessage="Legal name"/>
            },
            {
                columnName: 'acttype',
                displayName: <FormattedMessage id="common.actor.search.table.col.acttype" defaultMessage="Type"/>,
                customComponent: ActorTypeDisplay,
                customComponentMetadata: {
                    actorTypes: listTypes,
                }
            },
            {
                columnName: 'apadtnaiss',
                displayName: <FormattedMessage id="common.actor.search.table.col.apadtnaiss"
                                               defaultMessage="Birth Date"/>,
                customComponent: BirthDateDisplay,
            },
            {
                columnName: 'adrtaxarea',
                displayName: <FormattedMessage id="common.actor.search.table.col.adrtaxarea"
                                               defaultMessage="Registration#"/>
            },
            {
                columnName: 'address',
                displayName: <FormattedMessage id="common.actor.search.table.col.address" defaultMessage="Address"/>,
                customComponent: AddressDisplay
            }
        ];
        const default_mobilePattern =
            {
                rowClass: "actors-custom-row col-xs-12",
                elements: [
                    {
                        className: "flex-row",
                        children: [
                            {
                                className: "flex-col",
                                children: [
                                    {

                                        columnName: "actnom"
                                    },
                                    {
                                        columnName: "actlibcourt",
                                    }
                                ]
                            },
                            {
                                className: "flex-col",
                                children: [
                                    {
                                        columnName: "actcode",
                                        useCustomComponent: true,
                                    },
                                    {
                                        columnName: "acttype",
                                        useCustomComponent: true,
                                    }
                                ]
                            },
                            {
                                className: "flex-col",
                                children: [
                                    {
                                        columnName: "address",
                                        useCustomComponent: true,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        const {columns, columnMetadata, pattern} = applyAccessKeysOn("griddle", accessKeys, {
            defaultColumns,
            defaultColumnMetadata,
            pattern: default_mobilePattern
        });

        this.setState({DISPLAYED_COLUMN_CODES: columns, COLUMN_META_DATA: columnMetadata, MOBILE_PATTERN: pattern});
    }

    actorFilter = (results, filter) => {
        let listTypes = this.props.listTypes;
        return results.filter((item) => {
            let arr = deep.keys(item);
            for (let i = 0; i < arr.length; i++) {
                if (this.state.DISPLAYED_COLUMN_CODES.includes(arr[i])) {
                    if ((deep.getAt(item, arr[i]) || "").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                        return true;
                    }
                    let arri = arr[i];

                    if (arri == 'acttype') {
                        let val = listTypes.find(type => {
                            return type.code === (deep.getAt(item, arri) || "").toString()
                        });

                        if (val && val.label.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                            return true
                        }
                    }
                }
            }
            return false;
        });
    };

    render() {
        const {DISPLAYED_COLUMN_CODES, COLUMN_META_DATA, MOBILE_PATTERN} = this.state;
        const ready = DISPLAYED_COLUMN_CODES && COLUMN_META_DATA && MOBILE_PATTERN && this.props.listTypes;

        if (!ready) {
            return <Loader/>;
        }


        let l_rows = this.props.actors;

        if (this.props.onActorClick && COLUMN_META_DATA[0]) {
            COLUMN_META_DATA[0].customComponent = CustomActionDisplay;
            COLUMN_META_DATA[0].customComponentMetadata = {
                onClick: this.props.onActorClick
            }

        }

        let bodyHeight = this.props.gridBodyHeight || DEFAULT_BODY_HEIGHT


        return (

            <Box type="primary" hideTitle={this.props.hideTitle}
                 title={this.props.title ||
                 <FormattedMessage id="common.actor.search.title" defaultMessage="Actor search"/>}>
                <MediaQuery query={'(max-width: ' + getBootstrapResolution("sm") + ')'}>
                    {(isMobile) => {
                        return <Griddle
                            tableClassName="table table-hover"
                            useGriddleStyles={false}
                            results={l_rows}
                            columns={DISPLAYED_COLUMN_CODES}
                            columnMetadata={COLUMN_META_DATA}
                            initialSort='actnom'
                            initialSortAscending={false}
                            bodyHeight={bodyHeight}
                            showFilter={true}
                            resultsPerPage={50}
                            useCustomPagerComponent={isMobile}
                            customPagerComponent={Pager}
                            useCustomFilterer={true}
                            customFilterer={this.actorFilter}
                            enableInfiniteScroll={true}
                            useFixedHeader={true}
                            externalIsLoading={!ready}
                            customRowComponent={PatternGenerator}
                            useCustomRowComponent={isMobile}
                            customRowComponentClassName="griddle-body-custom"
                            globalData={{
                                metadata: COLUMN_META_DATA,
                                pattern: MOBILE_PATTERN
                            }}

                        />
                    }}
                </MediaQuery>
            </Box>
        );
    }
}

