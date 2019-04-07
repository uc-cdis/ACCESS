import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Popup from './Popup';
import UserInformation from './UserInformation';
import { deleteUser } from '../api/users';
import './UserTable.css';

const ROW_HEIGHT = 120;

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      deletePopup: false,
    };
  }

  openPopup = (user, deletePopup) => {
    this.setState({ user, deletePopup });
  }

  closePopup = () => {
    this.setState({ user: null, deletePopup: false }, () => this.props.updateTable());
  }

  deleteUser = () => {
    deleteUser(this.state.user.username, this.props.token).then(res => this.props.updateTable()).then(res => this.closePopup());
  }

  render() {
    const { data, dataSets } = this.props;
    const tableSize = (data.length + 1) * ROW_HEIGHT;
    return (
      <div className='user-table'>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              width={width}
              height={tableSize < 800 ? tableSize : 800}
              headerHeight={ROW_HEIGHT}
              rowHeight={ROW_HEIGHT}
              rowCount={data.length}
              rowGetter={({ index }) => data[index]}
            >
              <Column
                label='Username'
                dataKey='username'
                width={200}
              />
              <Column
                width={300}
                label='Name'
                dataKey='name'
              />
              <Column
                label='Organization'
                dataKey='organization'
                width={200}
              />
              <Column
                label='Contact Email'
                dataKey='contact_email'
                width={200}
              />
              <Column
                label='eRA Commons'
                dataKey='eracommons'
                width={200}
              />
              <Column
                label='Google Email'
                dataKey='google_email'
                width={200}
              />
              <Column
                label='Expiration'
                dataKey='expiration'
                width={200}
              />
              <Column
                label='Actions'
                dataKey='actions'
                width={200}
                cellRenderer={({ rowIndex }) => (
                  <React.Fragment>
                    <Button
                      className='user-table__button'
                      onClick={() => this.openPopup(data[rowIndex], false)}
                      buttonType='primary'
                      label='Edit'
                    />
                    <Button
                      className='user-table__button'
                      onClick={() => this.openPopup(data[rowIndex], true)}
                      buttonType='primary'
                      label='Delete'
                    />
                  </React.Fragment>
                )}
              />
            </Table>
          )}
        </AutoSizer>
        {
          this.state.user && this.state.deletePopup ? (
            <Popup
              title='Delete User'
              message={
                `Are you sure you want to delete ${this.state.user.name} at ${this.state.user.organization}?
                This action can't be undone.`
              }
              leftButtons={[
                {
                  caption: 'Delete',
                  fn: this.deleteUser,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Cancel',
                  fn: this.closePopup,
                },
              ]}
            />
          ) : null
        }
        {
          this.state.user && !this.state.deletePopup ? (
            <Popup
              title='Edit User'
              message=''
              leftButtons={[
                {
                  caption: 'Save',
                  fn: this.closePopup,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closePopup,
                },
              ]}
            >
              <UserInformation user={this.state.user} dataSets={dataSets} />
            </Popup>
          ) : null
        }
      </div>
    )
  }
}

UserTable.propTypes = {
  data: PropTypes.array.isRequired,
  updateTable: PropTypes.func.isRequired,
  token: PropTypes.object,
};

UserTable.defaultProps = {
  token: null,
};

export default UserTable;
