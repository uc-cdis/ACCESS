import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Popup from './Popup';
import { postDataset } from '../api/datasets';
// import Select from 'react-select';
import './DatasetInformation.css';

class DatasetInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phsid: '',
    }
  }

  setName = e => {
    this.setState({ name: e.target.value });
  }

  setPhsid = e => {
    this.setState({ phsid: e.target.value });
  }

  showPopup = message => {
    this.setState({ popup: true, message });
  }

  closePopup = success => {
    if (this.state.error === null) {
      this.setState({
        popup: false,
        message: null,
        name: '',
        phsid: ''
      });
    } else {
      this.setState({
        popup: false,
        message: null,
        error: null,
      });
    }
  }

  // TODO: util function?
  checkFieldsAreValid = () => {
    let requiredStringFields = ['name', 'phsid'];
    let invalidFields = [];
    for(var i = 0; i < requiredStringFields.length; i++) {
      let val = this.state[requiredStringFields[i]];
      if (!Boolean(val.trim()))
        invalidFields.push(requiredStringFields[i])
    }
    if (invalidFields.length > 0)
      return `You have not provided a value for the following required fields: ${invalidFields.join(', ')}.`;
    else
      return '';
  }

  render() {
    return (
      <React.Fragment>
        <ul className='dataset-info__dataset-details'>
          <h2>Dataset Details</h2>
          <li className='dataset-info__dataset-detail'>
            <label>Name</label>
            <input className='dataset-info__dataset-detail-input' type='text' value={this.state.name} onChange={this.setName} />
          </li>
          <li className='dataset-info__dataset-detail'>
            <label>phsid</label>
            <input className='dataset-info__dataset-detail-input' type='text' value={this.state.phsid} onChange={this.setPhsid} />
          </li>
        </ul>
          <Button
          className='dataset-info__submit-button '
          onClick={() => {
            let validationError = this.checkFieldsAreValid();
            if (validationError) {
              this.showPopup(validationError);
              this.setState({ addingDataset: false, error: true });
            }
            else {
              this.setState({ addingDataset: true }, () => {
                postDataset(this.state, this.props.token).then(res => {
                  this.props.updateDatasets();
                  this.showPopup(res.message ? res.message : `Successfully added ${this.state.name}`);
                  this.setState({ addingDataset: false, error: res.message ? res.message : null });
                })
              });
            }
          }}
          label='Add Dataset'
          buttonType='primary'
          isPending={this.state.addingDataset}
        />
        {
          this.state.popup  ?
            <Popup
              title='Add Dataset'
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

DatasetInformation.propTypes = {
  token: PropTypes.object,
  updateDatasets: PropTypes.func.isRequired,
};

DatasetInformation.defaultProps = {
  token: null,
};

export default DatasetInformation;
