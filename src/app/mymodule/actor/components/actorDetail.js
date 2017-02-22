import React, { Component } from 'react'
import { connect } from 'react-redux'
import Box from '../../../core/components/lib/Box.js'
import {fetchActor} from '../reducers/actions'

export class ActorDetail extends Component {

    componentWillMount() {
        if(this.props.params.actid) {
            this.props.fetchActor(this.props.params.actid)
        }
    }

    render() {
        const {
            actor
        } = this.props
        return (
            <Box type="primary" title="Actor information" withBoder="true">
                <div className="form-group row">
                    <label className="col-xs-2 col-xs-offset-2">Actor n°</label>
                    <div className="col-xs-6">
                        <input className="form-control" value={actor.actid}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xs-2 col-xs-offset-2">Name</label>
                    <div className="col-xs-6">
                        <input className="form-control" value={actor.actnom}/>
                    </div>
                </div>
            </Box>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        actor: state.myactor.actor,
    }
}
const mapDispatchToProps = {
    fetchActor
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(ActorDetail)