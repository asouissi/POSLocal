'use strict'
import React from 'react'
import classNames from 'classnames';


export default class NavTabs extends React.Component {

  render() {
    var props=this.props;



      let activeTab = this.props.tabs.find(tab => tab.active);
      let selectedTabKey=  activeTab ? activeTab.key : this.props.tabs[0].key;

     
      var cl={'nav-tabs-custom': true};      
      if (this.props.className) {
        this.props.className.split(' ').forEach(className => {
          if (!className) {
            return;
          }
          
          cl[className]=true;
        });
      }
      var titles=props.tabs.map((tab) => (<li key={tab.key} className={(tab.key===selectedTabKey)?'active':''} onClick={()=>{this.props.handleTabChange && this.props.handleTabChange(tab.key)}} >
        <a  data-toggle="tab" href={"#"+tab.key} aria-expanded={tab.key===selectedTabKey} >
          {tab.title}
        </a>
      </li>));
      
      var bodies=props.tabs.map((tab) => (<div key={tab.key} id={tab.key} className={'tab-pane'+((tab.key === selectedTabKey)?' active':'')}>
          {tab.body}
        </div>));
      
      return (
          <div className={classNames(cl)}>
            <ul className="nav nav-tabs"  >
              {titles}
            </ul>
            <div className="tab-content">
              {bodies}
            </div>
           </div> )}
}
