'use strict'

import React, {Component} from 'react'

import ActorSearchContainer from './ActorSearchContainer'

const GRID_BODY_MIN_HEIGHT = 450;

export default class ActorSearchPage extends Component {
	constructor(p_props) {
		super(p_props);
	}

	render() {
		let gridBodyHeight = Math.max($(window).height()-260, GRID_BODY_MIN_HEIGHT);

		return (<ActorSearchContainer gridBodyHeight={gridBodyHeight} />);
	}
}
