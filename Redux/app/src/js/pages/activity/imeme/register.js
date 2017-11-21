/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import {Modal} from 'antd-mobile';
import classnames from 'classnames';
import {resolveUrl as url, redirect} from 'utils';
import Register from 'components/register';

import 'scss/activity/imeme.component.scss';

const title = '么么直播';

export default class iMeme extends Component{
    state = {
        lock: 1,
        loaded: 1,
        loading: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {query} = this.props.location;
        this.setState({
            query
        });
    }
    onSuccess(){
        let {query} = this.props.location;
        redirect.push({
            pathname: '/mobile/channel',
            search: `?${qs.stringify(query)}`
        })
    }
    render(){
        let {className} = this.props;
        let {query, loaded, loading} = this.state;
        return (
            <div className={classnames({
                'wrapper wrapper-activity-imeme': true,
                loaded
            })}>
                <Register query={query} onSuccess={this.onSuccess.bind(this)}/>
            </div>
        )
    }
};