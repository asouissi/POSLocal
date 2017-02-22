'use strict'
import React from 'react'
import MediaQuery from 'react-responsive';

export default class Pager extends React.Component {

    constructor(props) {
        super(props)
    }

    pageChange(event) {
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    }

    render() {
        let previous = "";
        let next = "";
        let nbPages = 0;
        let paginationClass = "total-";
        let options = [];
        let startIndex = Math.max(this.props.currentPage - 5, 0);
        let endIndex = Math.min(startIndex + 10, this.props.maxPage);

        if (this.props.maxPage > 1) {

            if (!this.props.hidePrevNext) {
                if (this.props.currentPage > 0) {
                    previous = <div onClick={this.props.previous} className="previous">{this.props.previousText}</div>
                } else {
                    previous = <div className="previous disable">{this.props.previousText}</div>
                }

                if (this.props.currentPage != (this.props.maxPage - 1)) {
                    next = <div onClick={this.props.next} className="next">{this.props.nextText}</div>
                } else {
                    next = <div className="next disable">{this.props.nextText}</div>
                }
            }
            if (this.props.maxPage >= 10 && (endIndex - startIndex) <= 10) {
                startIndex = endIndex - 10;
            }
            for (let i = startIndex; i < endIndex; i++) {
                let selected = this.props.currentPage == i ? "current-page-selected" : "";
                options.push(<div className={selected} data-value={i} key={"pager_" + i}
                                  onClick={(event) =>this.pageChange(event)}>{i + 1}</div>);

                nbPages++;
            }
            paginationClass = paginationClass + nbPages;
        }
        const p = this.props.currentPage;
        const responsiveOptions = [<div className={"current-page-selected"} data-value={p} key={"pager_" + p}>
            {p + 1}/{this.props.maxPage }</div>];
        return (
            <div className="row custom-pager">
                <div className="left">{previous}</div>
                <div className="pages center">
                    <MediaQuery query='(max-width: 768px)'>
                        {isMobile => <div
                            className={isMobile ? "total-1" : paginationClass}>{isMobile ? responsiveOptions : options}
                        </div>}
                    </MediaQuery>
                </div>
                <div className="right">{next}</div>
            </div>
        )
    }
}




