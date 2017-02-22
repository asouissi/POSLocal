/**
 * Created by zos on 09/12/2016.
 */
import React, {Component} from 'react';
import {connect} from "react-redux";
import TextEntry from '../../../core/components/lib/TextEntry';
import SelectField from '../../../core/components/lib/SelectField';
import DateEntry from '../../../core/components/lib/DateEntry';
import {Modal, Button, FormGroup, ControlLabel, Row, Col} from 'react-bootstrap';
import {FormattedMessage, defineMessages} from 'react-intl';
import {tables} from "../../../core/reducers/referenceTable";
import {fetchDeals} from '../reducers/deals'
import {Field, getFormValues, formValueSelector, reduxForm,SubmissionError} from "redux-form";

export class FilterModal extends Component {

    applyAndCloseFilterModal =(data)=>{
        this.props.dispatch(fetchDeals(data));
    }
    render() {
        const {
            handleSubmit
        } = this.props;

        return (
            <Modal show={this.props.showModal} onHide={this.props.closeFilterModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FormattedMessage id="deals.filter.modal.title"
                                          defaultMessage="Advanced Search"/>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <div className="col-xs-4">
                            <Field name="customerName" component={TextEntry}
                                   title={<FormattedMessage id="deals.filter.modal.customername"
                                                            defaultMessage="Customer name"/>}/>
                        </div>
                        <div className="col-xs-4">
                            <Field name="salesVendor" component={SelectField}
                                   options={tables.VENDORS}
                                   title={<FormattedMessage id="deals.filter.modal.salesvendor"
                                                            defaultMessage="Sales vendor"/>}/>
                        </div>
                        <div className="col-xs-4">
                            <Field name="product" component={SelectField}
                                   options={tables.TPROFILGESTION}
                                   title={<FormattedMessage id="deals.filter.modal.product"
                                                            defaultMessage="Product"/>}/>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-xs-4">
                            <Field name="siren" component={TextEntry}
                                   title={<FormattedMessage id="deals.filter.modal.siret"
                                                            defaultMessage="SIREN"/>}/>
                        </div>
                        <div className="col-xs-4">
                            <Field name="creationDate" component={DateEntry}
                                   title={<FormattedMessage id="deals.filter.modal.creationdate"
                                                            defaultMessage="Creation date"/>}/>
                        </div>
                        <div className="col-xs-4">
                            <Field name="dealStatus" component={SelectField}
                                   options={tables.LANJALON}
                                   title={<FormattedMessage id="deals.filter.modal.status"
                                                            defaultMessage="Deal status"/>}/>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-xs-12">
                            <Field name="dashboardFilter" component={SelectField}
                                   options={tables.LANDASHBOARD}
                                   title={<FormattedMessage id="deals.filter.modal.dashboardFilter"
                                                            defaultMessage="Pre-defined filter"/>}/>
                        </div>

                    </Row>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.closeFilterModal} className="pull-left">
                        <FormattedMessage id="core.local.modal.btn.close"/>
                    </Button>

                    <Button onClick={handleSubmit(this.applyAndCloseFilterModal)} className="btn btn-primary pull-right">
                        <FormattedMessage id="core.local.modal.btn.apply" defaultMessage="Apply"/>
                    </Button>

                </Modal.Footer>
            </Modal>
        )
    }
}

FilterModal = reduxForm({
        form: 'dealFilter',
        enableReinitialize: true
    }
)(FilterModal);

export default connect()(FilterModal);