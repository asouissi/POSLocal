import React from 'react'
import {Col, Row, Panel, Grid} from 'react-bootstrap';

export default class LayoutConfigurator extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid className="charts-configurator-box box-primary collapsed-box" title="Charts layout">
                <Row>
                    <Col md="3">
                        <Panel header="Select graph type">
                        </Panel>
                    </Col>
                    <Col md="3">
                    </Col>
                    <Col md="3">
                    </Col>
                </Row>
            </Grid>
        );
    }
}
