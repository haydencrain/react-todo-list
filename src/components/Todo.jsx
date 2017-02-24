import React, { Component } from 'react';
import moment from 'moment';
import { map, findIndex, find, sortBy } from 'lodash';
import keypress from 'react-keypress';
import './styles.css';

/**
* @method: guid
* @desc: Generates unique guid
**/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    return (<div>{'Hello this is todo list'}</div>);
  }
}
