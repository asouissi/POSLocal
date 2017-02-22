import React, { Component } from 'react'
import { connect } from 'react-redux'
import Box from '../../../core/components/lib/Box.js'
import ActorTable from './ActorTable'
export class ActorlistContainer extends Component {
    render() {
        var rows = this.props.rows
        return (
            <Box className="box my-actors" type="primary" title="Actors
list">
                <div className="box-body">
                    <ActorTable rows={rows}/>
                </div>
            </ Box>
        )
    }
}
export default connect()(ActorlistContainer)