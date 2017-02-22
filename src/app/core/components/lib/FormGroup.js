'use strict'
import React from 'react'
import classNames from 'classnames';


export default class FormGroup extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }

  render() {
    var props=this.props;
    var state=this.state;
   
    var cl={'form-group': true};
    if (props.className) {
      props.className.split(' ').forEach((c) => cl[c]=true);
    }
    var pc=props.classNames;
    if (pc) {
      for(var k in pc) {
        cl[k]=pc[k];
      }
    }
    
    return (
        <div className={classNames(cl)}>
            <label className="control-label" htmlFor={props.forInputId}>{props.title}</label>
            {props.children}
         </div> );
  }
}
