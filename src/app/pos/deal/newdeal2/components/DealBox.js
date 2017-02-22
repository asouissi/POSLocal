'use strict'
import React from 'react'

import Box from '../../../../core/components/lib/Box'
import {Button} from 'react-bootstrap'

export default class DealBox extends React.Component {

  handleButtonClick =(event) =>{
    console.log("[DealBox] Handle tool button",event,this.props);
    
    if (this.props.onButtonClick) {
      this.props.onButtonClick(event);
    }
  }
  
  render() {
    var props=this.props;
        
    var active=" active";
    
    var hasPopup=props.hasPopup;

    var btnClassName =  this.props.complete ? "primary"  : "default" ;

    var newProps = {
        type: "primary",
        widthBorder: true,
        tools: hasPopup?(<div title="" className="box-tools pull-right">
            <div data-toggle="btn-toggle" className="btn-group">
              <Button bsStyle={btnClassName} onClick={this.handleButtonClick}>
                  <i className="fa fa-edit">
                      {this.context.showAccessKeys ? this.props.popupId: null}
                  </i>

              </Button>
            </div>
          </div>):[],
      ...props
    };
    
      return (<Box {...newProps}/>);
  }
}

DealBox.contextTypes = {
    showAccessKeys: React.PropTypes.bool
};
