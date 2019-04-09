import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Popup from './Popup';
import { postUsers } from '../api/users';
// import Select from 'react-select';
import './UserInformation.css';

class UserInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.selectedUser.name,
      username: props.selectedUser.username,
      organization: props.selectedUser.organization,
      eracommons: props.selectedUser.eracommons,
      orcid: props.selectedUser.orcid,
      expiration: props.selectedUser.expiration,
      contact_email: props.selectedUser.contact_email,
      google_email: props.selectedUser.google_email,
      datasets: [],
      popup: false,
      message: null,
      error: null,
      addingUser: false,
    }
  }

  setUserName = e => {
    this.setState({ username: e.target.value });
  }

  setName = e => {
    this.setState({ name: e.target.value });
  }

  setOrganization = e => {
    this.setState({ organization: e.target.value });
  }

  seteRA = e => {
    this.setState({ eracommons: e.target.value });
  }

  setORCID = e => {
    this.setState({ orcid: e.target.value });
  }

  setExpiration = e => {
    this.setState({ expiration: e.target.value });
  }

  setContactEmail = e => {
    this.setState({ contact_email: e.target.value });
  }

  setGoogleEmail = e => {
    this.setState({ google_email: e.target.value });
  }

  showPopup = message => {
    this.setState({ popup: true, message });
  }

  closePopup = success => {
    if (this.state.error === null) {
      this.setState({
        popup: false,
        message: null,
        username: '',
        name: '',
        organization: '',
        eracommons: '',
        orcid: '',
        contact_email: '',
        google_email: '',
        expiration: '',
        datasets: [],
      });
    } else {
      this.setState({
        popup: false,
        message: null,
        error: null,
      });
    }
  }

  selectDataSet = phsid => {
    if (this.state.datasets.includes(phsid)) {
      this.setState(prevState => ({ datasets: prevState.datasets.filter(id => id !== phsid) }));
    } else {
      this.setState(prevState => ({ datasets: prevState.datasets.concat(phsid) }));
    }
  }

  render() {
    console.log('this.props', this.props)
    const { allDataSets } = this.props;
    return (
      <React.Fragment>
        <ul className='user-info__user-details'>
          <h2>User Details</h2>
          <li className='user-info__user-detail'>
            <label>Username</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.username} onChange={this.setUserName} />
          </li>
          <li className='user-info__user-detail'>
            <label>Name</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.name} onChange={this.setName} />
          </li>
          <li className='user-info__user-detail'>
            <label>Organization</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.organization} onChange={this.setOrganization} />
          </li>
          <li className='user-info__user-detail'>
            <label>eRA Commons ID</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.eracommons} onChange={this.seteRA} />
          </li>
          <li className='user-info__user-detail'>
            <label>ORCID</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.orcid} onChange={this.setORCID} />
          </li>
          <li className='user-info__user-detail'>
            <label>Contact Email</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.contact_email} onChange={this.setContactEmail} />
          </li>
          <li className='user-info__user-detail'>
            <label>Google Email</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.google_email} onChange={this.setGoogleEmail} />
          </li>
          <li className='user-info__user-detail'>
            <label>Access Expiration Date</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.expiration} onChange={this.setExpiration} />
          </li>
        </ul>
        <h2>Data Set Access</h2>
        <ul className='user-info__user-access'>
          {
            allDataSets && allDataSets.map((project, i) => {
              return (
                  <li key={i}>
                    <input
                      type='checkbox'
                      key={i}
                      checked={this.state.datasets.includes(project.phsid)}
                      onChange={() => this.selectDataSet(project.phsid)}
                    />
                    {project.name} ({project.phsid})
                  </li>
              )
            })
          }
         </ul>
         {
           this.props.selectedUser.name !== "" ? null : (
             <Button
              className='user-info__submit-button '
              onClick={() => {
                this.setState({ addingUser: true }, () => {
                  postUsers(this.state, this.props.token).then(res => {
                    this.props.updateUsers();
                    this.showPopup(res.message ? res.message : `Successfully added ${this.state.name}`);
                    this.setState({ addingUser: false, error: res.message ? res.message : null });
                  })
                });
              }}
              label='Add User'
              buttonType='primary'
              isPending={this.state.addingUser}
            />
          )
        }
        {
          this.state.popup  ?
            <Popup
              title='Add User'
              message={this.state.message}
              rightButtons={[
                {
                  caption: 'Close',
                  fn: this.closePopup,
                },
              ]}
            />
          : null
        }
      </React.Fragment>
    )
  }
}

UserInformation.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    organization: PropTypes.string,
    eracommons: PropTypes.string,
    orcid: PropTypes.string,
    expiration: PropTypes.string,
    contact_email: PropTypes.string,
    google_email: PropTypes.string,
  }),
  allDataSets: PropTypes.array,
  token: PropTypes.object,
  updateUsers: PropTypes.func.isRequired,
};

UserInformation.defaultProps = {
  selectedUser: {
    username: '',
    name: '',
    organization: '',
    eracommons: '',
    orcid: '',
    contact_email: '',
    google_email: '',
    expiration: '',
    datasets: [],
  },
  allDataSets: [],
  token: null,
};

export default UserInformation;
