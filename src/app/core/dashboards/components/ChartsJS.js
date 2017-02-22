'use strict'
import React, {Component, PropTypes} from 'react'
import IntlComponent from '../../components/lib/IntlComponent'
import {Bar, Doughnut, Line} from 'react-chartjs-2'
import Box from '../../components/lib/Box.js';
import DashboardRenderer from './DashboardRenderer';


const drillUp = handleDrillUp => (
    <button type="button" className="btn btn-box-tool" title="Drill up"
            onClick={handleDrillUp}>
        <i className="fa fa-arrow-circle-o-left"></i> Back
    </button>
);

const stack = handleStack => (
    <button type="button" className="btn btn-box-tool" title="Stack"
            onClick={handleStack}>
        <i className="fa fa-bars"></i>
    </button>
);


const renderToolBox = tools => (
    <div className="box-tools pull-right">
        {tools}
    </div>
);

const formatLabel = (tooltipItem, data, intl) => {
    const {formatNumber, formatMessage} = intl;
    let lines = [];
    var {datasets, labels} = data;
    var tooltipItem2 = tooltipItem;
    var total = datasets[tooltipItem2.datasetIndex].data.reduce((pred, cur) => pred + cur, 0);
    var datasetValue = formatNumber(datasets[tooltipItem2.datasetIndex].data[tooltipItem2.index] / total, {style: 'percent'});
    var label = datasets[tooltipItem2.datasetIndex].label;

    lines.push(formatMessage({id: label, defaultMessage: label}) + ': ' + datasetValue)

    if (datasets.length > 1) {
        var totalCategory = datasets.map(ds => ds.data[tooltipItem2.index]).reduce((pred, cur) => pred + cur, 0);
        var catPercent = formatNumber(datasets[tooltipItem2.datasetIndex].data[tooltipItem2.index] / totalCategory, {style: 'percent'});
        var labelCategory = labels[tooltipItem2.index];
        lines.push(formatMessage({id: labelCategory, defaultMessage: labelCategory}) + ': ' + catPercent)
    }

    return lines;
};

const formatTooltipTitle = (tooltipItem, data, intl) => {
    const {formatNumber, formatMessage} = intl;
    var {datasets, labels} = data;
    var tooltipItem2 = tooltipItem[0];
    var value = formatNumber(datasets[tooltipItem2.datasetIndex].data[tooltipItem2.index]);
    return labels[tooltipItem2.index] + ': ' + value;
}

export default class ChartItem extends IntlComponent {

    constructor(props, context) {
        super(props, context);
    }

    handleClick(event, infos) {
        this.props.onDrill(this.props.layout, infos, this.props.config);
    }

    handleDrillUp = (event) => {
        this.props.onDrillUp(this.props.layout, this.props.config.drillUpConfig)
    };

    renderTools(tools) {
        if (this.props.config.drillUpConfig && this.props.onDrillUp) {
            tools.push(drillUp(this.handleDrillUp));
        }
        return renderToolBox(tools);
    }

    getThemeColor(skinClass) {
        return DashboardRenderer.getThemeColor();
    }
}


class PipelinePieChart2 extends ChartItem {

    dataset(data) {
    }

    render() {
        const {config} = this.props;

        var chartData = config.data;

        var options = {
            legend: {
                fullWidth: false,
                position: 'left',
                labels: {
                    boxWidth: 12
                }
            },
            maintainAspectRatio: true,
            ...config.options,
            tooltips: {callbacks: {}},
            responsive: true,
        };

        var chartData2;
        var color = this.getThemeColor();

        if (chartData[0].label) {
            // Ancien format
            chartData2 = {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: []
                }],
                links: [],
                keys: []
            };

            var datasets = chartData2.datasets[0];

            chartData.forEach((ch, idx) => {
                var lab = this.context.intl.formatMessage({id: ch.label, defaultMessage: ch.label});
                chartData2.labels.push(lab);
                chartData2.links.push(ch.link);
                chartData2.keys.push(ch.key);

                var c = color[idx];
                datasets.backgroundColor.push(c);
                datasets.hoverBackgroundColor.push(c);
                datasets.data.push(ch.value);
            });

        } else {
            chartData2 = chartData.map((point, index) => {
                return {color: color[index], highlight: color[index], ...point}
            });
        }

        // options.tooltips.callbacks.title = (tooltipItem, data) => {
        //
        //     var v = this.context.intl.formatNumber(data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]);
        //
        //     const label = data.labels[tooltipItem[0].index];
        //     return  this.context.intl.formatMessage({id: label, defaultMessage:label})+ ': ' + v;
        // };
        //
        options.tooltips.callbacks.label = (tooltipItem, data) => {
            var total = data.datasets[tooltipItem.datasetIndex].data.reduce((pred, cur) => pred + cur, 0);

            var v = this.context.intl.formatNumber(Math.floor(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / total * 1000) / 10, this.context.intl.formats.number.percent) + "%";

            return data.labels[tooltipItem.index] + ': ' + v;
        };

        options.tooltips.callbacks.title = (tooltipItem, data) => formatTooltipTitle(tooltipItem, data, this.context.intl);
        //options.tooltips.callbacks.label = (tooltipItem, data)=> formatLabel(tooltipItem, data, this.context.intl);


        var self = this;
        options.onClick = function (event, active) {
            var controller = this;
            var chart = controller.chart;

            if (Array.isArray(active) && active.length) {
                var first = active[0];

                if (typeof(first._index) === "number") {
                    var link = chart.config.data.links[first._index];
                    if (link) {
                        self.handleClick(event, {
                            index: first._index,
                            link: link,
                            data: chart.config.data,
                            key: chart.config.data.keys[first._index]
                        });
                    }
                }
            }
        };

        //
        let tools = this.props.tools || [];

        return (<Box className="proposal-pipeline chart box-primary" icon="pie-chart"
                     title={this.context.intl.formatMessage({id: config.title, defaultMessage: config.title})}
                     tools={this.renderTools(tools)} loading={config.isLoading}>

            <Doughnut key={this.props.skinClass} ref="chart" onClick={(event) => this.handleClick(event)}
                      data={chartData2}
                      options={options} redraw/>

        </Box>);

    }
}

class StageBarChart2 extends ChartItem {
    constructor(props, context) {
        super(props, context);
        this.state = {stacked: this.props.config.options.stacked};
    }

    handleStack = () => {
        this.setState({stacked: !this.state.stacked})
    };

    getSegment(event) {
        return this.refs.chart.getChart().getBarsAtEvent(event);
    }

    retrieveData(segments) {
        return {key: segments[0].label};//this.props.config.data.datasets.find(segment => segment.label === segments[0].label)
    }

    dataset(data) {
        let color = this.getThemeColor();

        let dataSets = data.datasets.map((point, index) => {

            return {
                backgroundColor: color[index],
                borderColor: point.borderColor || color[index],
                pointRadius: 5,
                pointBorderColor: '#fff',
                pointBackgroundColor: point.pointBackgroundColor || color[index],
                pointStrokeColor: "#fff",
                pointHoverBorderColor: point.pointHoverBorderColor || color[index],
                pointHoverBackgroundColor: "#fff",
                pointHoverRadius: 5,
                pointHoverBorderWidth: 5,
                label: this.context.intl.formatMessage({id: point.label, defaultMessage: point.label}),
                ...point
            }
        });

        return {
            labels: data.labels,
            datasets: dataSets
        };
    }

    render() {

        const {config} = this.props;
        var chartData = this.dataset(config.data);

        var options = {
            maintainAspectRatio: true,
            responsive: true,
            legend: {
                display: false
            },

            scales: {
                type: 'category',
                gridLines: {offsetGridLines: true},
                yAxes: [{
                    stacked: this.state.stacked,
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 10

                    }
                }],
                xAxes: [{
                    stacked: this.state.stacked
                }]
            },
            ...config.options,
            tooltips: {callbacks: {}}
        };

        options.tooltips.callbacks.title = (tooltipItem, data) => formatTooltipTitle(tooltipItem, data, this.context.intl);
        options.tooltips.callbacks.label = (tooltipItem, data) => formatLabel(tooltipItem, data, this.context.intl);

        let tools = this.props.tools.slice();
        if (chartData.datasets.length > 1) {
            tools.push(stack(this.handleStack));
        }

        //
        return (
            <Box className="chart box-primary" icon="bar-chart"
                 title={this.context.intl.formatMessage({id: config.title, defaultMessage: config.title})}
                 tools={this.renderTools(tools)} loading={config.isLoading}>
                <Bar ref="chart" onClick={(event) => this.handleClick(event)} data={chartData} options={options}
                     redraw/>
            </Box>
        )
    }
}

class AreaChart extends ChartItem {

    dataset(data) {
        let color = this.getThemeColor();

        let dataSets = data.datasets.map((point, index) => {
            return {
                backgroundColor: color[index],
                borderColor: color[index],
                pointRadius: 4,

                pointBackgroundColor: color[index],
                pointBorderColor: '#fff',
                pointHoverBorderColor: color[index],
                pointHoverBackgroundColor: color[index],

                pointHighlightFill: "#fff",
                pointHighlightStroke: color[index],
                ...point            }
        });

        return {
            labels: data.labels,
            datasets: dataSets,
        };
    }

    render() {
        const {config} = this.props;
        var chartData = this.dataset(config.data);
        var options = {
            maintainAspectRatio: true,
            scaleShowVerticalLines: true,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }]
            },
            legend: {
                display: false
            },
            ...config.options,
            tooltips: {callbacks: {}}
        };
        options.tooltips.callbacks.title = (tooltipItem, data) => formatTooltipTitle(tooltipItem, data, this.context.intl);
        options.tooltips.callbacks.label = (tooltipItem, data) => formatLabel(tooltipItem, data, this.context.intl);
        return (
            <Box className="chart box-primary" icon="area-chart"
                 title={this.context.intl.formatMessage({id: config.title, defaultMessage: config.title})}
                 tools={this.renderTools(this.props.tools)}
                 loading={config.isLoading}>
                <Line data={chartData} options={options} redraw/>
            </Box>
        )
    }
}

class LineChart extends ChartItem {

    dataset(data) {
        let color = this.getThemeColor();

        let dataSets = data.datasets.map((point, index) => {
            var c = color[index];
            var cb = "rgba(255,255,255,0)";

            var reg = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(c);
            if (reg) {
                // There is a bug with the alpha channel
                cb = "rgba(" + reg[1] + "," + reg[2] + "," + reg[3] + ",0)";
            }

            return {
                backgroundColor: cb,
                borderColor: color[index],
                pointRadius: 5,
                pointBorderColor: '#fff',
                pointBackgroundColor: color[index],
                pointStrokeColor: "#fff",
                pointHoverBorderColor: color[index],
                pointHoverBackgroundColor: "#fff",
                pointHoverRadius: 5,
                pointHoverBorderWidth: 5,
                label: this.context.intl.formatMessage({id: point.label, defaultMessage: point.label}),
                data: point.data
            }
        });
        let labels = data.labels.map((label) => this.context.intl.formatMessage({id: label, defaultMessage: label}));

        return {
            labels: labels,
            datasets: dataSets
        };
    }

    render() {
        const {config} = this.props;
        var chartData = this.dataset(config.data);
        var options = {
            maintainAspectRatio: true,
            scaleShowVerticalLines: true,
            legend: {
                display: false
            },
            ...config.options,
            tooltips: {callbacks: {}}
        };

        options.tooltips.callbacks.title = (tooltipItem, data) => formatTooltipTitle(tooltipItem, data, this.context.intl);
        options.tooltips.callbacks.label = (tooltipItem, data) => formatLabel(tooltipItem, data, this.context.intl);

        return (
            <Box className="chart box-primary" icon="line-chart"
                 title={this.context.intl.formatMessage({id: config.title, defaultMessage: config.title})}
                 tools={this.renderTools(this.props.tools)}
                 loading={config.isLoading}>
                <Line data={chartData} options={options} redraw/>
            </Box>
        )
    }
}

class StageDoubleBarChart2 extends ChartItem {
    dataset() {

        let color = this.getThemeColor();

        return {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My Third dataset",
                    fillColor: color[0],
                    strokeColor: color[0],
                    pointColor: color[0],
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: color[0],
                    data: [2, 18, 6, 7, 3, 12, 15]
                },
                {
                    label: "My Third dataset",
                    fillColor: color[2],
                    strokeColor: color[2],
                    pointColor: color[2],
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: color[2],
                    data: [12, 4, 16, 6, 20, 10]
                }
            ]
        };
    }

    render() {
        var chartData = this.props.dataset || this.dataset();

        var options = {
            maintainAspectRatio: true,
            scaleShowVerticalLines: true,
            legend: {
                display: false
            }
        };

        //

        return (
            <Box className="units-sales-per-month chart" icon="bar-chart" title="Units and sales per month">
                <Bar data={chartData} options={options}/>
            </Box>
        )
    }
}


export {PipelinePieChart2, StageBarChart2, StageDoubleBarChart2, LineChart, AreaChart}