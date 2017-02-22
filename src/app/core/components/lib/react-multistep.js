'use strict'
import React, {Component, PropTypes} from "react";
import classNames from "classnames";

const DEFAULT_EMPTY = [];
const getNavStates = (indx, stepIndex) => {
    if (stepIndex < indx) {
        return 'done'
    }
    else if (stepIndex === indx) {
        return 'doing'
    }
    else {
        return 'todo'
    }
}


const filterStep = (steps, accessKeys = []) =>  {
    return steps
        .filter(step => (!accessKeys[step.id] && (step.default || step.hidden != true)) || (accessKeys[step.id] && accessKeys[step.id].hidden != true))
        .sort((a, b) => {
            const orderA = accessKeys[a.id] && accessKeys[a.id].order || a.order;
            const orderB = accessKeys[b.id] && accessKeys[b.id].order || b.order;
            return orderA - orderB
        });
}
class Multistep extends Component {

    setNavState(next, auto) {
        this.setState({navState: getNavStates(next, this.props.steps.length)})
        if (next < this.props.steps.length) {
            this.props.onStepChange(next, auto) //need refactor state change behavior(step component validation, post at the end)
        }
    }


    handleOnClick = (evt) => {
        if (evt.target.value === (this.props.steps.length - 1) &&
            this.props.step === (this.props.steps.length - 1)) {
            this.setNavState(this.props.steps.length)
        }
        else {
            this.setNavState(evt.target.value)
        }
    }

    componentWillReceiveProps(nextProps){
        let fsStep = filterStep(nextProps.steps, nextProps.accessKeys)
        if( nextProps.step > fsStep.length-1){
            this.setNavState(0, true)
        }
    }

    render() {
        let {accessKeys, actionbar, actionlink, hideStep, steps, ...props} = this.props;

        var status = DEFAULT_EMPTY;
        if (this.props.status) {
            status = this.props.status;
        }

        let fsSteps = steps;
        if (accessKeys) {
            fsSteps = filterStep(steps, accessKeys);
        }


        let stepsButtons = []

        if (hideStep !== true) {

            stepsButtons = fsSteps.map((step, index) => {
                let title = step.name;
                if (this.context.showAccessKeys && step.id) title = step.id;

                return (
                    <li value={index} key={index} className={"progtrckr-" + getNavStates(this.props.step, index) }
                        onClick={this.handleOnClick}>
                        <span>{title}</span>
                    </li>
                )}

            );
            var groupClassNames = {
                'progtrckr': true,
                'progtrckr1': this.props.actionbarClass
            };

            stepsButtons = (<ol className={classNames(groupClassNames)}>
                {stepsButtons}
            </ol>);
        }


        let currentStep = this.props.step > fsSteps.length - 1 ? fsSteps.length - 1 : this.props.step;
        return (
            <div className="group-box">
                <div className="toolbar col-md-12">
                    {actionlink}
                </div>
                <div className="row">
                    {stepsButtons}
                    <div className={"statusbar " + (this.props.actionbarClass || "col-md-6")}>
                        {status}
                    </div>
                    <div className={"toolbar " + (this.props.actionbarClass || "col-md-6")}>
                        {actionbar}
                    </div>
                </div>
                <div >
                    <div className="step-body">
                        {[fsSteps[currentStep].component]}
                    </div>
                    <div className="buttrckr">
                        {this.props.custom}
                        <div key="left" className="zone-left">
                            {this.props.leftZone || []}
                            {this.props.customLeftBtn}
                        </div>
                        <div key="right" className="zone-right">
                            {this.props.rightZone || []}
                            {this.props.reset}
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export {Multistep}

Multistep.contextTypes = {
    showAccessKeys: React.PropTypes.bool
};