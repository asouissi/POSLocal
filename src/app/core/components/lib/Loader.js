import React from 'react';

export default (props) => {
    const size = props.size || "2x";
    return (
        <div className="text-center">
            <i className={"fa fa-circle-o-notch fa-spin fa-"+size+" fa-fw"}></i>
            <span className="sr-only">Loading...</span>
        </div>
    );
}