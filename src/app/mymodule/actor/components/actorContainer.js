import React, { Component } from 'react'
import { connect } from 'react-redux'
import {fetchActors} from "../reducers/actions"
import ActorlistContainer from './actorListContainer'
export class ActorContainer extends Component {
    componentWillMount (){
        this.props.fetchActors()
    }
    render() {
        const {
            rows
        } = this.props
        return (
            <div>
                <p>
                    <h3>Here is my list of actors</h3>
                </p>
                <ActorlistContainer rows={rows}/>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        rows: state.myactor.actors,
    }
}
const mapDispatchToProps = {
    fetchActors
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(ActorContainer)