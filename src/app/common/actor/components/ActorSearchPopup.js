'use strict'

import React from 'react'
import Modal from '../../../core/components/lib/Modal'

import ActorSearchContainer from './ActorSearchContainer'
import ActorCreationPage from './ActorCreationPage'

const TABLE_MIN_HEIGHT = 224;

export default class ActorSearchPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {onEdit: false}
    }

    toggle(edit, actorId) {
        this.setState({onEdit: edit, actorId});
        this.refs.modal.toggle();
    }


    handleActorCreationClicked = () => {
        this.setState({onEdit: true})
    };

    render() {
        if (this.state.onEdit) {
            return (
                <Modal ref="modal" className="actors-search-popup" title={this.props.newTitle}>
                    <ActorCreationPage {...this.props} onSaveSuccess={this.props.onCreateActor}
                                       params={{actorId: this.state.actorId}}/>
                </Modal>);

        }

        let gridBodyHeight = Math.max($(window).height() - 340, TABLE_MIN_HEIGHT);
        let roles = this.props.rolcodes ? this.props.rolcodes : [];
        let acttype = this.props.acttype ;
        let actnom = this.props.actnom ;

        return (<Modal ref="modal" className="actors-search-popup" title={this.props.searchTitle}>
            <ActorSearchContainer hideTitle={true} rolcodes={roles}
                                  acttype={acttype} actnom={actnom}
                                  gridBodyHeight={gridBodyHeight}
                                  onActorClick={this.props.onActorClick}
                                  onActorCreationClick={this.handleActorCreationClicked}
                                  hideAddButton={this.props.hideAddButton}/>
        </Modal>);
    }

}