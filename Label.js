/* Way to call Label Component in your Component
    1. import like import Label from 'toolBox';
    2. <Label displayText={Labels.label.select_language} bsClass="userlabel" />
*/

import React from 'react';
import * as helperClass from './reactHelper';
import PropTypes from 'prop-types';

const Label = (props) => {
	let newBaseClass = "";
    if(props.bsClass.includes("col-")) newBaseClass = props.bsClass;
    else newBaseClass = `${helperClass.formLabel} ${props.bsClass ? props.bsClass : ""}`;
	return <label className={newBaseClass}>{props.displayText}</label>;
};

export default Label;

Label.defaultProps = { 
	bsClass: "",
	displayText: "Label" 
};

Label.propTypes = {
	bsClass: PropTypes.any,
	displayText: PropTypes.any
};