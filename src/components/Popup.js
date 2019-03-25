import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './Popup.css';

const Popup = ({
  title, message, lines, error,
  iconName, leftButtons, rightButtons,
  onClose,
  children
}) => (
  <div className='popup__mask'>
    <div className='popup__box'>
      <div className='popup__title'>
        <h2>{ title }</h2>
      </div>
      <div className='popup__message'>
        { message && <div className='high-light'>{message}</div> }
        {
          lines.length > 0 &&
          <pre>
            {
              lines.map((l, i) => (
                <div key={`line_${i}`}>
                  {l.label && [<b className='h3-typo'>{l.label}</b>, <br />]}
                  <code>
                    {l.code} <br />
                  </code>
                </div>
              ))
            }
          </pre>
        }
        { error && <h6 className='popup__error'>Error</h6> }
        { error && <code>{error}</code> }
        { children }
      </div>
      <div className='popup__foot'>
        <div className='popup__left-foot'>
          {
            leftButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <Button
                key={btn.caption}
                onClick={btn.fn}
                label={btn.caption}
                buttonType='primary'
              /> :
                <Button
                  key={btn.caption}
                  onClick={btn.fn}
                  label={btn.caption}
                  buttonType='primary'
                />,
            ])
          }
        </div>
        <div className='popup__right-foot'>
          {
            rightButtons.map((btn, i) => [
              i > 0 && ' ',
              !btn.icon ? <Button
                key={btn.caption}
                onClick={btn.fn}
                label={btn.caption}
                buttonType='primary'
              /> :
                <Button
                  key={btn.caption}
                  onClick={btn.fn}
                  label={btn.caption}
                  buttonType='primary'
                />,
            ])
          }
        </div>
      </div>
    </div>
  </div>
);

const buttonType = PropTypes.shape({
  fn: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string,
});

Popup.propTypes = {
  error: PropTypes.string,
  iconName: PropTypes.string,
  lines: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string,
  })),
  message: PropTypes.string,
  leftButtons: PropTypes.arrayOf(buttonType),
  rightButtons: PropTypes.arrayOf(buttonType),
  title: PropTypes.string,
  onClose: PropTypes.func,
};

Popup.defaultProps = {
  error: '',
  iconName: '',
  lines: [],
  message: '',
  leftButtons: [],
  rightButtons: [],
  title: '',
  onClose: null,
};

export default Popup;
