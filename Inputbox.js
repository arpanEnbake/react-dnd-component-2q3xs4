/* Way to call Inputbox Component in your Component
    1. import like import Inputbox from 'toolBox';
    2. <Inputbox value="" onChange={this.getInputVal} />
*/

import React from 'react';
import * as helperClass from './reactHelper';
import PropTypes from 'prop-types';

export default class Inputbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { bsClass, type, value, setRef, ...otherAttributes } = this.props;
    return(
        <input type={type} 
            className={`${helperClass.formControl} ${bsClass}`} 
            value={value} 
            ref={setRef} 
            {...otherAttributes} 
        />
    );
  }
}

Inputbox.defaultProps = { 
  bsClass: "", 
  type: "text",
  setRef: "",
};

Inputbox.propTypes = {
	bsClass: PropTypes.any,
  type: PropTypes.any,
  value: PropTypes.any.isRequired,
  setRef: PropTypes.any
};
