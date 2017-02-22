import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {fetchUsers, updateUser} from '../reducers/users'
import {UserTable} from './UserTable'
import Box from '../../../core/components/lib/Box'


class MyUsers extends Component {
    componentWillMount() {
        this.props.fetchUsers();
    }

    componentWillReceiveProps(nextProps) {
    }

    handleUserDeactivate = (user) => {
        this.props.updateUser(user.uticode);
    }

    render() {
        var rows = this.props.users;
        return (
            <div>
                <Box type="primary" title={<FormattedMessage id="common.users.components.userscontainer.myusers"
                                                             defaultMessage="My users"/>}>
                    <UserTable rows={rows} isLoading={this.props.isLoading}
                               onUserDeactivate={this.handleUserDeactivate}/>
                </Box>
            </div>
        );
    }
}

const mapDispatchToProps = {updateUser, fetchUsers};
export default connect(
    state => ({
        users: state.users.users,
        isLoading: state.users.isLoading
    }),
    mapDispatchToProps
)(MyUsers);
