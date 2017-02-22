import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router';
import {getRouteAccessKeys, getComponentAccessKeys} from '../../../common/accesskeys/AccessKeysSelector';

import ActorSearchTable from './ActorSearchTable'
import {fetchActors} from '../reducers/actor'
import {
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from '../../../core/reducers/referenceTable'
import {ACTOR} from '../../../common/index';

const DEFAULT_EMPTY = null;

export class ActorSearchContainer extends Component {
    constructor(p_props) {
        super(p_props);
    }

    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTTRPARAM, {'ttrnom': 'TYPECLIENT'}));
        this.props.dispatch(fetchActors({
            actroles: this.props.rolcodes,
            acttype: this.props.acttype,
            actnom: this.props.actnom
        }));
    }

    componentWillReceiveProps(nextProps) {
        // reload actors
        if (nextProps.currentBrand !== this.props.currentBrand) {
            this.props.dispatch(fetchActors({
                actroles: this.props.rolcodes,
                acttype: this.props.acttype,
                actnom: this.props.actnom
            }));
        }
    }

    handleActorCreationClick = () => {
        if (this.props.onActorCreationClick) {
            this.props.onActorCreationClick();
        } else {
            hashHistory.push('actor');
        }
    };

    render() {
        let {actors, listTypes, accessKeys} = this.props;
        let addButton = DEFAULT_EMPTY;

        if (!this.props.hideAddButton) {
            addButton =
                <div className="actor-creation-btn" onClick={this.handleActorCreationClick}>
                    <i className="fa fa-user-plus icon-circle"/>
                </div>
        }

        // accessKey for actors table
        const id = "common.actor.search.table";
        accessKeys = getComponentAccessKeys(accessKeys, id);
        return (
            <div className="actor-search-content">
                <ActorSearchTable title={this.props.title} hideTitle={this.props.hideTitle}
                                  gridBodyHeight={this.props.gridBodyHeight} actors={actors} listTypes={listTypes}
                                  onActorClick={this.props.onActorClick} id={id} accessKeys={accessKeys}
                                  acttype={this.props.acttype}/>
                {addButton}
            </div>

        );
    }
}

export default connect(
    (state, props) => {
        return {
            actors: state.actor.actorsData,
            listTypes: getReferenceTable(state, tables.LANTTRPARAM, {'ttrnom': 'TYPECLIENT'}).data,
            currentBrand: state.authentication.user.brandcurrent,
            accessKeys: getRouteAccessKeys(state, ACTOR)
        }
    }
)(ActorSearchContainer);

