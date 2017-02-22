import React from "react";
import {Checkbox} from "react-bootstrap";

 const renderCheckbox = ({input, meta, ...props}) => <Checkbox  {...input} checked={input.value} {...props}/>;
 export default renderCheckbox;

 //todo create a component manage onChange error etc ...