'use strict'

import React, {Component} from 'react';
import Box from '../../components/lib/Box.js';
import {PipelinePieChart2, StageBarChart2, StageDoubleBarChart2, LineChart, AreaChart} from './ChartsJS'
import TableItem from './TableItem';
import  {DashboardItem, DashboardItem2} from './DashboardItem';
import ContactList from './ContactList';

export const ColorScheme = (props) => (
    <div className={props.skinClass + " chart-color-scheme"}>
        <div className="color-1"></div>
        <div className="color-2"></div>
        <div className="color-3"></div>
        <div className="color-4"></div>
        <div className="color-5"></div>
    </div>
);

export default class DashboardRenderer {

    static getThemeColor() {
        let scheme = document.getElementsByClassName('chart-color-scheme')[0];
        return [
            window.getComputedStyle(scheme.getElementsByClassName('color-1')[0]).backgroundColor,
            window.getComputedStyle(scheme.getElementsByClassName('color-2')[0]).backgroundColor,
            window.getComputedStyle(scheme.getElementsByClassName('color-3')[0]).backgroundColor,
            window.getComputedStyle(scheme.getElementsByClassName('color-4')[0]).backgroundColor,
            window.getComputedStyle(scheme.getElementsByClassName('color-5')[0]).backgroundColor
        ];
    }

    static renderItem(item, handleDrillDown, handleDrillUp) {

        if (!item.type) {
            var label = !item.error ? 'loading' : 'Error';
            return (<Box className="box-primary empty" loading={!item.error} error={!!item.error} title={label}
                         layout={item}/>);
        }

        var tools = [];
        switch (item.type.toUpperCase()) {
            case 'KPI':
                return (<DashboardItem item={item.parameters} layout={item}/>);

            case 'KPI2':
                return (<DashboardItem2 item={item.parameters} layout={item}/>);

            case 'DOUGHNUT':
                return (<PipelinePieChart2 config={item.asMutable({deep: true})} layout={item}
                                           tools={tools} onDrillUp={handleDrillUp}
                                           onDrill={handleDrillDown}/>);

            case 'BAR':
                return (
                    <StageBarChart2 config={item.asMutable({deep: true})} layout={item}
                                    onDrill={handleDrillDown}
                                    onDrillUp={handleDrillUp}
                                    tools={tools}/>);

            case 'LINE':
                return (<LineChart layout={item} config={item.asMutable({deep: true})} tools={tools}
                                   onDrillUp={handleDrillUp}/>);

            case 'AREA':
                return (<AreaChart layout={item} config={item.asMutable({deep: true})} tools={tools}
                                   onDrillUp={handleDrillUp}/>);

            case 'TABLE':
                return (<TableItem layout={item} config={item} onDrillUp={handleDrillUp}
                                    onDrill={handleDrillDown}/>);

            case 'CONTACTLIST':
                return (<ContactList layout={item} config={item}/>);

            case 'HTML':
                let content = item.content;
                if (content) content = content.trim();
                return (<Box layout={item} className="table-item-box box-primary" title={item.title}>
                    <div dangerouslySetInnerHTML={{__html: content}}/>
                </Box>);


            default :
                var label = !item.error ? 'loading' : 'Error';
                return (<Box layout={item} loading={!item.error} error={!!item.error} title={label}/>)
        }
    }
}