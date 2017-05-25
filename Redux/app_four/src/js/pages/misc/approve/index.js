import React, {Component}  from 'react'
import {Toast} from 'antd-mobile';
import {get, post, login, redirect} from 'utils'
import 'scss/misc/approve.component.scss'


export default class Approve extends React.Component {
    //初始化加载

    constructor(props) {
        super(props);
        this.state = {
            status : 1,
            list : []
        };
        console.log("c")
    }

    componentWillMount(){
        document.title = '借贷认证';
        Toast.loading("加载中...", 0);
        get('http://credit.xianjincard.com/approve-auth/get-user-approve-info').then(data => data.data).then(response => {
            var that = this;
            if(response.code != 0) {
                if (response.code == -2) {
                    login();
                    return;
                }
                Toast.fail(response.message, 1.5);
                this.setState({status : 0 }, function () {
                    //console.log(111)
                });
                return;
            }
            this.setState({status : 1 , list : response.data }, function () {
                Toast.hide();
            });
        });

    }

    componentDidMount() {
        //console.log("b")
    }

    fetchData() {
        // get('http://credit.xianjincard.com/credit-app/multi-index').then(result => {console.log(result)})
    }
    handleClick(id, active, e){
        if(active == "1"){
            return;
        }
        window.location.href = "approve/login?id="+id;
    }
    reloadPage(e){
        window.location.reload();
    }
    render() {
        return (
            <div class="approve">
                {this.state.status == 0 ?
                    <div class="crash">
                        <div class="title">系统开小差了</div>
                        <div class="content">您可以尝试重新加载页面</div>
                        <div class="btnArea">
                            <a onClick={this.reloadPage.bind(this)} href="javascript:void(0)">重新加载</a>
                        </div>
                    </div>
                    :
                    <div class="block-outer">
                        {
                            this.state.list && this.state.list.map(
                                ({icon, title, id, active} = item, index) => (
                                    <div key={index} class="block" onClick={this.handleClick.bind(this, id, active)}>
                                        {active == "0" ? "" :
                                            <img class="auth_done_icon" src="/assets/img/misc/approve/already_auth.png"/>
                                        }
                                        <div class="pd">
                                            <div class="block-in">
                                                <div class="icon">
                                                    <img src={icon}/>
                                                </div>
                                                <div class="title">
                                                    <p>{title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                }

            </div>
        )
    }
}
