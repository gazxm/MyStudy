import React, {Component}  from 'react'
import {Carousel, List, Modal, Icon, Toast, Flex, ListView} from 'antd-mobile';
import {get, post, login, redirect, callBrowser} from 'utils'
import 'scss/misc/app-mart.component.scss'




export default class Approve extends React.Component {
    //初始化加载
    constructor(props) {
        super(props);

        console.log("c")
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            status : 1,
            ad_list : [],
            type_list : [],
            dataSource: dataSource.cloneWithRows([]),
            isLoading: true,
            page : 1,
            rawData : []
        };
    }

    componentWillMount(){
        document.title = '应用市场';
        Toast.loading("加载中...", 0);
        post('http://credit.xianjincard.com/appstore/index',{type_id : this.props.location.query.id}).then(data => data.data).then(response => {
            var that = this;
            if(response.code != 0) {
                Toast.fail(response.message);
                this.setState({status : 0 }, function () {
                    //console.log(111)
                });
                return;
            }
            this.setState({status : 1 , ad_list : response.data.ads }, function () {
                Toast.hide();
                console.log(this.state)
            });
        });
        this.load_list()
    }

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.load_list()
        }, 1000);
    }

    load_list() {
        post('http://credit.xianjincard.com/appstore/apps',{
            offset : (this.state.page-1)*10,
            limit : 10,
            type_id : this.props.location.query.id
        }).then(data => data.data).then(response => {
            var that = this;
            if(response.code != 0) {
                Toast.fail(response.message);
                this.setState({status : 0 }, function () {
                    //console.log(111)
                });
                return;
            }
            if(response.data.models.length <= 0){
                return;
            }
            //console.log(response.data.models)
            this.setState({rawData : [...this.state.rawData, ...response.data.models]},function () {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.rawData),
                    isLoading: false,
                    page : this.state.page+1
                }, function () {
                    Toast.hide();
                    console.log(this.state.page)
                });
            })

        });
    }

    componentDidMount() {
        //console.log("b")
    }

    fetchData() {
        // get('http://credit.xianjincard.com/credit-app/multi-index').then(result => {console.log(result)})
    }
    handleClick(id, install_url, e){
        e.stopPropagation()
        e.preventDefault()
        post('http://credit.xianjincard.com/appstore/action-log',{
            app_id : id,
            type : 1
        }).then(data => data.data).then(response => {

        });
        //下载app的方法
        callBrowser(install_url)
    }
    toDetailClick(id, e){
        window.location.href = "detail?id="+id;
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData
            return (
                <div key={rowID} class="item" onClick={this.toDetailClick.bind(this, obj.id)}>
                    <div class="icon">
                        <div class="img">
                            <img src={obj.icon_small} />
                        </div>
                    </div>
                    <div class="main-cont">
                        <div class="top">
                            <div class="left">
                                <p class="name">
                                    <span>{obj.name}</span>
                                </p>
                                <p class="size">{obj.size}MB</p>
                            </div>
                            <div class="btn">
                                <a href="javascript:void(0)" class="a-btn" onClick={this.handleClick.bind(this, obj.id, obj.install_url)}>安装</a>
                            </div>
                        </div>
                        <div class="info">
                            <p>{obj.brief_info}</p>
                        </div>
                    </div>
                </div>
            )
        }
        
        const separator = (sectionID, rowID) => (
            <div key={rowID} />
        )
        return (
            <div class="app-mart">
                {this.state.ad_list.length > 0 ?
                <div class='carousel'>
                    <Carousel autoplay={true} infinite>
                        {
                            this.state.ad_list && this.state.ad_list.map(
                                ({link, img} = item, index) => (
                        <a key={index} href={link} class='slider-link'>
                            <img src={img}/>
                        </a>
                                )
                            )
                        }
                    </Carousel>
                </div>
                : ""}
                <div class="list">
                    <ListView
                        ref='lvOne'
                        dataSource={this.state.dataSource}
                        renderRow={row}
                        renderSeparator={separator}
                        initialListSize={20}
                        pageSize={20}
                        scrollRenderAheadDistance={200}
                        scrollEventThrottle={20}
                        className='listview'
                        scrollerOptions={{ scrollbars: false }}
                        onEndReached={this.onEndReached.bind(this)}
                        onEndReachedThreshold={10}
                        style={{
                            overflow : 'hidden'
                        }}
                    />

                </div>
            </div>
        )
    }
}
