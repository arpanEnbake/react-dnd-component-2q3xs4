import React from 'react';
import Inputbox from './Inputbox';
import Label from './Label';

export default class TextBoxProps extends React.Component {  
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <section>
      <div>
          <Label displayText="Label name"/> 
          <Inputbox
            bsClass="additional-class"
            placeholder="Enter label"
            value={this.props.labelValue}
            onChange={this.props.handleInputChange.bind(this)}
      />
      </div>
      </section>
    )
  }
}