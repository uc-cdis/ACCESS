import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { postUsers } from '../api/users';
// import Select from 'react-select';
import './UserInformation.css';

class UserInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.user.name,
      username: props.user.username,
      organization: props.user.organization,
      eracommons: props.user.eracommons,
      orcid: props.user.orcid,
      expiration: props.user.expiration,
      contact_email: props.user.contact_email,
      google_email: props.user.google_email,
      datasets: props.user.datasets,
      showButton: props.user.name === ''
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

  render() {
    const { dataSets } = this.props;
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
            dataSets && dataSets.map((project, i) => {
              return (
                  <li key={i}><input type='checkbox' key={i}/>{project.name} ({project.phsid})</li>
              )
            })
          }
         </ul>
        {
          this.state.showButton ?
            <Button
              className='user-info__submit-button '
              onClick={() => { postUsers(this.state);  }}
              label='Add User'
              buttonType='primary'
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
  dataSets: PropTypes.array,
};

UserInformation.defaultProps = {
  user: {
    username: '',
    name: '',
    organization: '',
    eracommons: '',
    orcid: '',
    contact_email: '',
    google_email: '',
    expiration: '',
  },
  dataSets: [],
};

export default UserInformation;
