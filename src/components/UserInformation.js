import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Select from 'react-select';
import './UserInformation.css';

const dataSets = {
  TOPMed: {
    Tier1A: [ "MESA", "COPD"],
    Tier1B: [ "GALAII", "Framingham"],
    Tier2: [ ]
  }
};

const PIs = [
  { label: "Robert Grossman", value: "Robert Grossman" },
  { label: "Benedict Paten", value: "Benedict Paten" },
  { label: "Anthony Philippakis", value: "Anthony Philippakis "}
];

const dropdownStyles = {
  control: (provided, state) => ({
    ...provided,
    borderStyle: 'solid',
    border: '1px solid #606060',
    margin: '0'
  }),
  container: (provided, state) => ({
    ...provided,
    width: 'calc(80% + 20px)',
    margin: '0 0 0 20px'
  })
}

class UserInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      organization: props.user.organization,
      eRA: props.user.eRA,
      ORCID: props.user.ORCID,
      PI: PIs.find((p) => p.label === props.user.PI) ? PIs.find((p) => p.label === props.user.PI) : null,
      accessDate: props.user.accessDate,
      accessExp: props.user.accessExp,
      showButton: props.user.firstName === ''
    }
  }

  setFirstName = e => {
    this.setState({ firstName: e.target.value });
  }

  setLastName = e => {
    this.setState({ lastName: e.target.value });
  }

  setOrganization = e => {
    this.setState({ organization: e.target.value });
  }

  seteRA = e => {
    this.setState({ eRA: e.target.value });
  }

  setORCID = e => {
    this.setState({ ORCID: e.target.value });
  }

  setPI = option => {
    this.setState({ PI: option });
  }

  setAccessDate = e => {
    this.setState({ accessDate: e.target.value });
  }

  setAccessExp = e => {
    this.setState({ accessExp: e.target.value });
  }

  render() {
    console.log(this.state)
    return (
      <React.Fragment>
        <ul className='user-info__user-details'>
          <h2>User Details</h2>
          <li className='user-info__user-detail'>
            <label>First Name</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.firstName} onChange={this.setFirstName} />
          </li>
          <li className='user-info__user-detail'>
            <label>Last Name</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.lastName} onChange={this.setLastName} />
          </li>
          <li className='user-info__user-detail'>
            <label>Organization</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.organization} onChange={this.setOrganization} />
          </li>
          <li className='user-info__user-detail'>
            <label>eRA Commons ID</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.eRA} onChange={this.seteRA} />
          </li>
          <li className='user-info__user-detail'>
            <label>ORCID</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.ORCID} onChange={this.setORCID} />
          </li>
          <li className='user-info__user-detail'>
            <label>PI</label>
            <Select
              styles={dropdownStyles}
              value={this.state.PI}
              onChange={this.setPI}
              options={PIs}
            />
          </li>
          <li className='user-info__user-detail'>
            <label>Access Allowed Date</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.accessDate} onChange={this.setAccessDate} />
          </li>
          <li className='user-info__user-detail'>
            <label>Access Expiration Date</label>
            <input className='user-info__user-detail-input' type='text' value={this.state.accessExp} onChange={this.setAccessExp} />
          </li>
        </ul>
        <ul className='user-info__user-access'>
          <h2>User Access</h2>
          <li className='user-info__user-access-item'>
            {
              Object.keys(dataSets).map((program, i) => {
                return (
                  <ul className='user-info__user-access-item' key={i}>
                    <li><input type='checkbox' />{ program }</li>
                    <ul className='user-info__user-access-item'>
                      {
                        Object.keys(dataSets[program]).map((project, j) =>
                          <React.Fragment key={j}>
                            <li><input type='checkbox' />{ project }</li>
                            <ul className='user-info__user-access-item'>
                              {
                                dataSets[program][project].map((dataSet, r) =>
                                  <li className='user-info__user-access-item' key={r}><input type='checkbox' />{ dataSet }</li>
                                )
                              }
                            </ul>
                          </React.Fragment>
                        )
                      }
                    </ul>
                  </ul>
                )
              })
            }
          </li>
        </ul>
        {
          this.state.showButton ?
            <Button
              className='user-info__submit-button '
              onClick={() => { }}
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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    organization: PropTypes.string,
    eRA: PropTypes.string,
    ORCID: PropTypes.string,
    PI: PropTypes.string,
    accessDate: PropTypes.string,
    accessExp: PropTypes.string,
  }),
};

UserInformation.defaultProps = {
  user: {
    firstName: '',
    lastName: '',
    organization: '',
    eRA: '',
    ORCID: '',
    PI: null,
    accessDate: '',
    accessExp: '',
  },
};

export default UserInformation;
