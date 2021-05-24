import React from 'react';
import * as helperClass from './reactHelper';
import PropTypes from 'prop-types';
import Inputbox from './Inputbox';
import Label from './Label';

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    debugger;
    const { labelName, compID } = this.props;
    return(
        <React.Fragment>
          <Label displayText={labelName} compID={compID} /> 
          <Inputbox
            bsClass="additional-class"
      />
        </React.Fragment>
    );
  }
}

