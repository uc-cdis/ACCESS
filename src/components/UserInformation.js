import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Popup from './Popup';
import { postUser } from '../api/users';
import Select from 'react-select';
import './FormInformation.css';

const usernameOptions = [
  { value: 'google_email', label: 'Google email' },
  { value: 'eracommons', label: 'eRA Commons ID' }
];

class UserInformation extends React.Component {
  constructor(props) {
    super(props);
    let option = null;
    if (props.selectedUser.username) {
      if (props.selectedUser.username === props.selectedUser.google_email) {
        option = usernameOptions[0];
      } else {
        option = usernameOptions[1];
      }
    }

    this.state = {
      name: props.selectedUser.name,
      username: props.selectedUser.username,
      usernameOption: option,
      organization: props.whoAmI.iam === 'DAC' ? props.selectedUser.organization : props.whoAmI.organization,
      eracommons: props.selectedUser.eracommons,
      orcid: props.selectedUser.orcid,
      expiration: props.whoAmI.iam === 'DAC' ? props.selectedUser.expiration : '2000-01-01', // fake expiration: user expires when PI expires
      contact_email: props.selectedUser.contact_email,
      google_email: props.selectedUser.google_email,
      datasets: props.selectedUser.datasets,
      popup: false,
      message: null,
      error: null,
      addingUser: false,
    }
  }

  setUserNameOption = e => {
    this.setState({ usernameOption: e });
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
        organization: this.props.whoAmI.iam === 'DAC' ? '' : this.props.whoAmI.organization,
        eracommons: '',
        orcid: '',
        contact_email: '',
        google_email: '',
        expiration: this.props.whoAmI.iam === 'DAC' ? '' : '2000-01-01',
        datasets: [],
        usernameOption: null,
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

  checkFieldsAreValid = () => {
    let requiredStringFields = ['eracommons', 'orcid', 'name', 'contact_email', 'google_email', 'usernameOption'];
    const requiredDacFields = ['organization', 'expiration'];
    if (this.props.whoAmI.iam === 'DAC') {
      requiredStringFields = requiredStringFields.concat(requiredDacFields);
    }
    let invalidFields = [];
    for (var i = 0; i < requiredStringFields.length; i++) {
      let val = this.state[requiredStringFields[i]] || false;
      try {
        val = val.trim();
      }
      catch (e) {}
      if (!Boolean(val))  // if field is empty: add to invalid fields
        invalidFields.push(requiredStringFields[i])
    }
    if (invalidFields.length > 0)
      return `You have not provided a value for the following required fields: ${invalidFields.join(', ')}.`;
    else
      return '';
  }

  render() {
    console.log('state', this.state);
    var { allDataSets } = this.props;
    // users get the same project access as the PI who added them
    if (this.props.whoAmI.iam === 'PI') {
      allDataSets = allDataSets.filter(project => this.props.whoAmI.datasets.includes(project.phsid));
    }

    return (
      <React.Fragment>
        <ul className='form-info__details'>
          <h2>User Details</h2>
          <li className='form-info__detail'>
            <label>ACCESS Username</label>
            <Select
              className='form-info__detail-select-container'
              classNamePrefix='form-info__detail-select'
              value={this.state.usernameOption}
              onChange={this.setUserNameOption}
              options={usernameOptions}
              isDisabled={this.props.selectedUser.username}
              placeholder='Select the login ID for this user'
            />
          </li>
          <li className='form-info__detail'>
            <label>Name</label>
            <input className='form-info__detail-input' type='text' value={this.state.name} onChange={this.setName} />
          </li>
          <li className='form-info__detail'>
            <label>Organization</label>
            <input className={'form-info__detail-input'} type='text' value={this.state.organization} onChange={this.setOrganization} readOnly={this.props.whoAmI.iam === 'PI'} />
          </li>
          <li className='form-info__detail'>
            <label>eRA Commons ID</label>
            <input
              className='form-info__detail-input'
              type='text'
              value={this.state.eracommons}
              onChange={this.seteRA}
              readOnly={this.props.selectedUser.username && this.props.selectedUser.username == this.state.eracommons}
            />
          </li>
          <li className='form-info__detail'>
            <label>ORCID</label>
            <input className='form-info__detail-input' type='text' value={this.state.orcid} onChange={this.setORCID} />
          </li>
          <li className='form-info__detail'>
            <label>Contact Email</label>
            <input className='form-info__detail-input' type='text' value={this.state.contact_email} onChange={this.setContactEmail} />
          </li>
          <li className='form-info__detail'>
            <label>Google Email</label>
            <input
              className='form-info__detail-input'
              type='text'
              value={this.state.google_email}
              onChange={this.setGoogleEmail}
              readOnly={this.props.selectedUser.username && this.props.selectedUser.username == this.state.google_email}
            />
          </li>
          {
            this.props.whoAmI.iam === 'DAC' && (
              <li className='form-info__detail'>
                <label>Access Expiration Date</label>
                <input className='form-info__detail-input' type='text' value={this.state.expiration} onChange={this.setExpiration} placeholder='YYYY-MM-DD' />
              </li>
            )
          }
        </ul>
        <h2>Dataset Access</h2>
        <ul className='form-info__user-access'>
          {
            allDataSets && allDataSets.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0).map((project, i) => {
              return (
                <li key={i}>
                  <input
                    type='checkbox'
                    key={i}
                    checked={this.state.datasets.includes(project.phsid) || this.props.whoAmI.iam === 'PI'}
                    onChange={() => this.selectDataSet(project.phsid)}
                    disabled={this.props.whoAmI.iam === 'PI'}
                  />
                  {project.name} ({project.phsid})
                  </li>
              )
            })
          }
        </ul>
        {
          this.props.selectedUser.name !== '' ? null : (
            <Button
              className='form-info__submit-button'
              onClick={() => {
                let validationError = this.checkFieldsAreValid();
                if (validationError) {
                  this.showPopup(validationError);
                  this.setState({ addingUser: false, error: true });
                }
                else {
                  this.setState({
                    addingUser: true,
                    username: this.state[this.state.usernameOption.value]
                  }, () => {
                    postUser(this.state, this.props.token).then(res => {
                      this.props.updateUsers();
                      this.showPopup(res.message ? `Error: ${res.message}` : `Successfully added user ${this.state.name} (${this.state.username})${this.state.datasets.length > 0 ? ' and granted access to ' + this.state.datasets.join(', ') : ''}.`);
                      this.setState({ addingUser: false, error: res.message ? res.message : null });
                    })
                  });
                }
              }}
              label='Add User'
              buttonType='primary'
              isPending={this.state.addingUser}
            />
          )
        }
        {
          this.state.popup && (
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
          )
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
    datasets: PropTypes.array,
  }),
  whoAmI: PropTypes.shape({
    iam: PropTypes.string,
    organization: PropTypes.string,
    datasets: PropTypes.array,
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
