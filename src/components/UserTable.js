import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import Popup from './Popup';
import Spinner from './Spinner';
import UserInformation from './UserInformation';
import { getUsersForPI, deleteUser, editUser } from '../api/users';
import './UserTable.css';

const ROW_HEIGHT = 120;
const MAX_TABLE_HEIGHT = 800;
const MAX_COLUMN_WIDTH = 400;

const EXPAND_ROW_HEIGHT = 60;
const MAX_EXPAND_TABLE_HEIGHT = EXPAND_ROW_HEIGHT * 4;

var piToUsersCache = {};

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.selectedUserInformation = React.createRef();
    this._table = React.createRef();
    this.userTableSize = 0;
    this.expandTableSize = 0;
    this.state = {
      selectedUser: null,
      deletePopup: false,
      loading: false,
      exporting: false,
      message: '',
      expandedUser: null, // username of the PI whose row was clicked
      expandedUserChildren: [], // list of users added by this PI
    };
  }

  // edit/delete pop up
  openPopup = (event, selectedUser, deletePopup) => {
    event.stopPropagation(); // prevents expand row on button click
    this.setState({ selectedUser, deletePopup });
  }

  closePopup = () => {
    this.setState({ selectedUser: null, deletePopup: false }, () => this.props.updateTable());
  }

  // edit/delete result pop up
  showResultPopup = (message, isDelete) => {
    this.setState({ message, deletePopup: isDelete });
  }

  closeResultPopup = () => {
    this.setState({ message: '', deletePopup: false });
  }

  deleteUser = () => {
    this.setState({ deletePopup: false, loading: true }, () => {
      deleteUser(this.state.selectedUser.username, this.props.token)
        .then(async res => {
          this.showResultPopup(res.message ? `Error: ${res.message}` : `Successfully deleted user ${this.state.selectedUser.name} (${this.state.selectedUser.username}).`, true);
          this.props.updateTable();
        })
        .then(() => this.setState({ selectedUser: null, loading: false }));
    });
  }

  editUser = () => {
    let validationError = this.selectedUserInformation.current.checkFieldsAreValid();
    if (validationError) {
      this.showResultPopup(`Error: ${validationError}`, false);
      this.closePopup();
    }
    else {
      let newInformation = this.selectedUserInformation.current.state;
      this.setState({ loading: true }, () => {
        editUser(newInformation, this.props.token)
        .then(async res => {
          this.showResultPopup(res.message ? `Error: ${res.message}` : `Successfully updated user ${newInformation.name} (${newInformation.username}).`, false);
          this.props.updateTable();
        })
        .then(() => this.setState({ selectedUser: null, loading: false }));
      });
    }
  }

  exportUserData = async () => {
    console.log("Exporting user data");

    // wait for users and datasets to be available
    const timeoutSecs = 10; // give up after 10 secs
    function sleepMS(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    let slept = 0;
    while (!(this.props.data && this.props.data.length && this.props.allDataSets && this.props.allDataSets.length)) {
      await sleepMS(100);
      slept += 100;
      if (slept >= timeoutSecs * 1000) {
        console.error(`Did not receive users and datasets for export after ${timeoutSecs} secs - giving up`);
        return;
      }
    }

    // generate file name
    const date = new Date();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const dateString = `${date.getFullYear()}-${month}-${day}`;
    const fileName = `datastage_users_${dateString}.tsv`;

    // generate TSV
    let headers = ["Username", "Name", "PI", "Organization", "NIH Login", "ORCID", "Google Email", "Contact Email", "Access Expiration Date"];
    headers = headers.concat(
      this.props.allDataSets.map(d => `${d.name} (${d.phsid})`)
    )
    let contents = [headers.join("\t")];
    for (var user of this.props.data) {
      // if DAC: add PI; if PI: add user
      // piStatus: name of the user's PI, or "PI" if user is a PI:
      let piStatus = this.props.whoAmI.iam === "DAC" ? "PI" : this.props.user.name;
      let datasetList = this.props.allDataSets.map(
        d => user.datasets.includes(d.phsid) ? "yes" : "no"
      );
      let row = [user.username, user.name, piStatus, user.organization, user.eracommons, user.orcid, user.google_email, user.contact_email, user.expiration].concat(datasetList);
      contents.push(row.join("\t"));

      // if DAC: add users under PI
      if (this.props.whoAmI.iam === "DAC") {
        let piUsername = user.username;;
        console.log(`  Exporting ${piUsername}`);

        if (!piToUsersCache[piUsername]) {
          piToUsersCache[piUsername] = await getUsersForPI(this.props.token, piUsername);
        }

        for (var u of piToUsersCache[piUsername]) {
          // dataset access is the same as PI for now
          // let datasetList = this.props.allDataSets.map(
          //   d => u.datasets.includes(d.phsid) ? "yes" : "no"
          // );
          let row = [u.username, u.name, piUsername, u.organization, u.eracommons, u.orcid, u.google_email, u.contact_email, u.expiration].concat(datasetList);
          contents.push(row.join("\t"));
        }
      }
    }

    const blob = new Blob(
      [contents.join("\n")],
      { type: 'text/tab-separated-values' }
    );
    FileSaver.saveAs(blob, fileName);
    this.setState({ exporting: false });
  }

/**
 If the current user is a PI: renders the user row (cannot expand).
 If the current user is a DAC:
 - If the PI user row is not expanded, renders the PI user row.
 - If it is expanded, renders the PI user row and a table of the users
 added by this PI.
 */
  userRowRenderer = (params) => {
    const { style, key, rowData } = params;
    if (rowData.username !== this.state.expandedUser) {
      return defaultTableRowRenderer(params);
    }
    else {
      return (
        <div
          style={{ ...style, display: 'flex', flexDirection: 'column' }}
          key={key}
        >
          {defaultTableRowRenderer({ // PI user row
            ...params,
            style: { height: ROW_HEIGHT }
          })}

          {
            this.state.loadingPiUsers ?
            <Spinner />
            :
            this.state.expandedUserChildren.length === 0 ?
              <div style={{ padding: '10px', fontStyle: 'italic' }}>
                This Principal Investigator has not added any users yet.
              </div>
            :
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table // users added by this PI
                  width={width * 6/8} // width of first 6 columns of main table
                  height={this.expandTableSize}
                  disableHeader={true}
                  rowHeight={EXPAND_ROW_HEIGHT}
                  rowCount={this.state.expandedUserChildren.length}
                  rowGetter={({ index }) => this.state.expandedUserChildren[index]}
                  rowStyle={{backgroundColor: 'var(--g3-color__silver)', borderColor: 'white'}}
                >
                  <Column
                    label='Username'
                    dataKey='username'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Name'
                    dataKey='name'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Organization'
                    dataKey='organization'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Contact Email'
                    dataKey='contact_email'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='NIH Login'
                    dataKey='eracommons'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Google Email'
                    dataKey='google_email'
                    width={MAX_COLUMN_WIDTH}
                  />
                </Table>
              )}
            </AutoSizer>
          }
        </div>
      );
    }
  };

  toggleRow = async (e) => {
    const pi = e.rowData.username;
    if (this.state.expandedUser === pi) { // close the expanded row
      await this.setState({expandedUser: null, expandedUserChildren: []});
    }
    else { // expand a row
      await this.setState({expandedUser: pi, expandedUserChildren: [], loadingPiUsers: true});
      this._table.current.recomputeRowHeights(); // spinner will be displayed
      if (!piToUsersCache[pi]) {
        piToUsersCache[pi] = await getUsersForPI(this.props.token, pi);
      }
      // if the user clicks on another row before this one loads: do not update
      if (this.state.expandedUser === pi) {
        await this.setState({
          loadingPiUsers: false,
          expandedUserChildren: piToUsersCache[pi]
        });
      }
    }
    this._table.current.recomputeRowHeights();
  }

  getRowHeight = (params) => {
    const isExpanded = this.props.data[params.index].username === this.state.expandedUser;
    return ROW_HEIGHT + (isExpanded ? this.expandTableSize : 0);
  }

  render() {
    const { data, allDataSets } = this.props;
    this.userTableSize = Math.min((data.length + 1) * ROW_HEIGHT, MAX_TABLE_HEIGHT);
    this.expandTableSize = this.state.expandedUser ? Math.min(Math.max(this.state.expandedUserChildren.length, 1) * EXPAND_ROW_HEIGHT, MAX_EXPAND_TABLE_HEIGHT) : 0;
    return (
      <div className='user-table'>
        {
          this.state.loading ?
          <Spinner />
          :
          <div>
            <Button
              className='user-table__export-button'
              label={this.state.exporting ? 'Exporting...' : 'Export as TSV'}
              onClick={() => {this.exportUserData(); this.setState({ exporting: true })}}
              enabled={!this.state.exporting}
            />
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  ref={this._table}
                  width={width}
                  height={this.userTableSize + this.expandTableSize}
                  headerHeight={ROW_HEIGHT}
                  rowHeight={this.getRowHeight}
                  rowCount={data.length}
                  rowGetter={({ index }) => data[index]}
                  // only DACs can expand the user rows:
                  onRowClick={this.props.whoAmI.iam === 'DAC' ? this.toggleRow : null}
                  rowRenderer={this.userRowRenderer}
                >
                  <Column
                    label='Username'
                    dataKey='username'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Name'
                    dataKey='name'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Organization'
                    dataKey='organization'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Contact Email'
                    dataKey='contact_email'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='NIH Login'
                    dataKey='eracommons'
                    width={MAX_COLUMN_WIDTH}
                  />
                  <Column
                    label='Google Email'
                    dataKey='google_email'
                    width={MAX_COLUMN_WIDTH}
                  />
                  {
                    this.props.whoAmI.iam === 'DAC' && (
                      <Column
                        label='Expiration'
                        dataKey='expiration'
                        width={MAX_COLUMN_WIDTH}
                      />
                    )
                  }
                  <Column
                    label='Actions'
                    dataKey='actions'
                    width={MAX_COLUMN_WIDTH}
                    cellRenderer={({ rowIndex }) => (
                      <React.Fragment>
                        <Button
                          className='user-table__button'
                          onClick={(event) => this.openPopup(event, data[rowIndex], false)}
                          buttonType='primary'
                          label='Edit'
                        />
                        <Button
                          className='user-table__button'
                          onClick={(event) => this.openPopup(event, data[rowIndex], true)}
                          buttonType='primary'
                          label='Delete'
                        />
                      </React.Fragment>
                    )}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        }
        {
          this.state.selectedUser && this.state.deletePopup && (
            <Popup
              title='Delete User'
              message={
                `Are you sure you want to delete ${this.state.selectedUser.name} at ${this.state.selectedUser.organization}?
                This action cannot be undone.`
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
          )
        }
        {
          this.state.selectedUser && !this.state.deletePopup && !this.state.loading && (
            <Popup
              title='Edit User'
              message=''
              leftButtons={[
                {
                  caption: 'Save',
                  fn: this.editUser,
                },
              ]}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closePopup,
                },
              ]}
            >
              <UserInformation ref={this.selectedUserInformation} selectedUser={this.state.selectedUser} allDataSets={allDataSets} updateUsers={this.props.updateTable} whoAmI={this.props.whoAmI}/>
            </Popup>
          )
        }
        {
          this.state.message && (
            <Popup
              title={this.state.deletePopup ? 'Delete User' : 'Edit User'}
              message={this.state.message}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closeResultPopup,
                },
              ]}
            />
          )
        }
      </div>
    )
  }
}

UserTable.propTypes = {
  data: PropTypes.array.isRequired,
  updateTable: PropTypes.func.isRequired,
  allDataSets: PropTypes.array,
  token: PropTypes.object,
};

UserTable.defaultProps = {
  token: null,
  allDataSets: [],
};

export default UserTable;
