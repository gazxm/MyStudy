/* eslint-disable */
import React, {Component, createClass} from 'react';
import classnames from 'classnames';
import 'scss/activity/reduction-interest.component.scss';
import {hrefNative as native, platform, goHome} from 'utils';

const title = '降息活动';

export default class Operator extends Component{
    
    state = {}
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
    }
    render(){
        return (
            <div className='wrapper wrapper-reduction-interest loaded'>
                <div className='button' onClick={goHome}/>
                <div className='tips'>本活动最终解释权归现金卡所有，与Apple.Inc无关</div>
            </div>
        )
    }
};