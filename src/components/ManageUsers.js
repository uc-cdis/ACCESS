import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import Select from 'react-select';
import './ManageUsers.css';

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
    width: '80%',
    margin: '0'
  })
}

class ManageUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      firstName: null,
      lastName: null,
      organization: null,
      eRA: null,
      ORCID: null,
      PI: null,
    }
  }

  selectTab = tab => {
    this.setState({ selectedTab: tab });
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

  render() {
    console.log('this.state', this.state)
    return (
      <div className='manage-users'>
        <div className='manage-users__tab-bar'>
          <div
            tab={0}
            className={'manage-users__tab'.concat(this.state.selectedTab === 0 ? ' manage-users__tab--selected' : '' )}
            onClick={() => this.selectTab(0)}
          >
            Add a New User
          </div>
          <div
            tab={1}
            className={'manage-users__tab'.concat(this.state.selectedTab === 1 ? ' manage-users__tab--selected' : '' )}
            onClick={() => this.selectTab(1)}
          >
            Manage Current Users
          </div>
        </div>
        <div className='manage-users__content'>
          {
            this.state.selectedTab === 0 ? (
              <React.Fragment>
                <ul className='manage-users__user-details'>
                  <h2>User Details</h2>
                  <li className='manage-users__user-detail'>
                    <label>First Name</label>
                    <input className='manage-users__user-detail-input' type='text' onChange={this.setFirstName} />
                  </li>
                  <li className='manage-users__user-detail'>
                    <label>Last Name</label>
                    <input className='manage-users__user-detail-input' type='text' onChange={this.setLastName} />
                  </li>
                  <li className='manage-users__user-detail'>
                    <label>Organization</label>
                    <input className='manage-users__user-detail-input' type='text' onChange={this.setOrganization} />
                  </li>
                  <li className='manage-users__user-detail'>
                    <label>eRA Commons ID</label>
                    <input className='manage-users__user-detail-input' type='text' onChange={this.seteRA} />
                  </li>
                  <li className='manage-users__user-detail'>
                    <label>ORCID</label>
                    <input className='manage-users__user-detail-input' type='text' onChange={this.setORCID} />
                  </li>
                  <li className='manage-users__user-detail'>
                    <label>PI</label>
                    <Select
                      styles={dropdownStyles}
                      value={this.state.PI}
                      onChange={this.setPI}
                      options={PIs}
                    />
                  </li>
                </ul>
                <ul className='manage-users__user-access'>
                  <h2>User Access</h2>
                  <li className='manage-users__user-access-item'>
                    {
                      Object.keys(dataSets).map((program, i) => {
                        return (
                          <ul className='manage-users__user-access-item' key={i}>
                            <li><input type='checkbox' />{ program }</li>
                            <ul className='manage-users__user-access-item'>
                              {
                                Object.keys(dataSets[program]).map((project, j) =>
                                  <React.Fragment key={j}>
                                    <li><input type='checkbox' />{ project }</li>
                                    <ul className='manage-users__user-access-item'>
                                      {
                                        dataSets[program][project].map((dataSet, r) =>
                                          <li className='manage-users__user-access-item' key={r}><input type='checkbox' />{ dataSet }</li>
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
                <Button
                  className='manage-users__submit-button '
                  onClick={() => { }}
                  label='Add User'
                  buttonType='primary'
                />
              </React.Fragment>
            ): <div>Update a user</div>
          }
        </div>
      </div>
    )
  }
}

export default ManageUsers;
