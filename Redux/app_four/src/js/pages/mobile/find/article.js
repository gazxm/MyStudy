/* eslint-disable */
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {Card, List, Flex, Icon, Toast, TextareaItem, Modal, Button} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/articles.component.scss';
import {redirect, login} from 'utils';
import request from 'common/request';

const title = '文章详情';
const Item = List.Item;
const Brief = Item.Brief;

let thumb = require('../../../../assets/img/mobile/find/icon-avatar.png');

class Article extends Component {
    state = {
        lock: 1,
        visible: 0,
        loaded: 1,
        commentId: 0,
        commentContent: null,
        commentPopover: 0,
        commentPopoverLock: 1,
        commentLock: 1,
        commentLoading: 0
    }
    constructor(props){
        super(props);
        request.interceptors.response.use(response => {
            let {code, message} = response;
            if(code == -2){
                Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress(){
                        login();
                    }
                }])
                return Promise.reject(response);
            }else if([0, -2].indexOf(code) == -1){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        }, error => {
            return Promise.reject(error);
        });
    }
    componentDidMount(){
        document.title = title;
        this.article.bind(this)();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.params.id != nextProps.params.id){
            this.article.bind(this)(nextProps.params.id);
        }
    }
    middleware(response){
        let {code, message} = response;
        Toast.hide();
        if([0, -2].indexOf(code) == -1){
            Toast.fail(message, 1.5);
        }
        this.setState({
            lock: 1,
            commentLock: 1,
            commentLoading: 0
        });
    }
    article(id){
        Toast.loading(undefined, 0);
        let {params} = this.props;
        let {wrapper} = this.refs;
        request(`notice/find-article?id=${id || params.id}`).then(response => {
            let {count: like, item: article, recommend, comment} = response.data;
            if(article && article.content){
                let content = document.createElement('div');
                    content.innerHTML = article.content;
                let elements = content.querySelectorAll('*');
                    for(let i in elements){
                        let element = elements[i];
                        if(element.style){
                            element.style.lineHeight = '';
                            element.style.fontSize = '';
                            element.style.fontFamily = '';
                            element.style.backgroundColor = '';
                        }
                    }
                article.content = content.innerHTML.replace(/https?\:/g, '');
            }
            this.setState({
                like,
                article,
                recommend,
                comment
            });
            // 回到顶部
            wrapper && (wrapper.scrollTop = 0);
            Toast.hide();
            id && redirect.push(`/mobile/find/article/${id}`);
        }).catch(this.middleware.bind(this));
    }
    hideComment(){
        this.setState({
            visible: 0
        });
        setTimeout(() => {
            let {setFieldsValue} = this.props.form;
            setFieldsValue({
                comment: ''
            });
        });
    }
    reply(id){
        let {setFieldsValue, getFieldInstance} = this.props.form;
        let comment = getFieldInstance('comment');
        let {comment: comments, commentContent} = this.state;
        let {textarea: element} = comment.refs;
        setTimeout(element.focus());
        if(id){
            comments && comments.map(data => {
                if(data.id == id){
                    setFieldsValue({
                        comment: data.comment
                    });
                }
            });
        }else{
            setFieldsValue({
                comment: commentContent
            });
        }
        this.setState({
            visible: 1,
            commentId: id || 0,
            commentPopover: 0
        });
    }
    showPopover(id){
        let {commentPopover, commentPopoverLock} = this.state;
        if(commentPopoverLock){
            this.setState({commentPopoverLock: 0});
            commentPopover == id && (id = 0);
            setTimeout(() => {
                this.setState({
                    commentPopover: id,
                    commentPopoverLock: 1
                });
            }, 300);
        }
    }
    like(id){
        let {lock, article, comment} = this.state;
        if(article && article.id){
            let params = {};
                params.id = article.id;
                id && (params.father_id = id);
            Toast.loading(undefined, 0);
            request('notice/give-the-thumbs-up', {
                params
            }).then(response => {
                let {count: like, message} = response;
                Toast.success(message, 1.5);
                if(!id){
                    article.give = !article.give;
                    this.setState({
                        like,
                        article
                    });
                }else{
                    comment.map(data => {
                        if(id == data.id){
                            data.laud = like;
                            data.userGive = !data.userGive;
                        }
                    });
                    this.setState({
                        comment,
                        commentPopover: 0
                    });
                }
            }).catch(this.middleware.bind(this));
        }else{
            Toast.offline('缺少参数', 1.5);
        }
    }
    setCommentContent(value){
        let {commentId, comment} = this.state;
        if(commentId){
            comment && comment.map(data => {
                (data.id == commentId) && (data.comment = value);
            });
            this.setState({
                comment
            });
        }else{
            this.setState({
                commentContent: value
            });
        }
    }
    comment(){
        let {article, comment: comments, commentId, commentLock} = this.state;
        let {setFieldsValue, getFieldValue, getFieldInstance} = this.props.form;
        let comment = getFieldInstance('comment');
        let {textarea: element} = comment.refs;
        if(commentLock){
            if(!getFieldValue('comment')){
                Toast.offline('内容不能为空', 1.5, () => {
                    setTimeout(element.focus());
                });
                return;
            }
            this.setState({commentLock: 0, commentLoading: 1});
            let data = {};
                data.id = article.id;
                data.content = getFieldValue('comment');
            if(commentId){
                comments.map(comment => {
                    (comment.id == commentId) && (data.reply = commentId);
                });
            }
            request.post('notice/thumb-up', data).then(response => {
                let {id, phone, user_id, message} = response;
                Toast.success(message, 1.5, () => {
                    this.setState({
                        commentLock: 1,
                        commentLoading: 0,
                        visible: 0
                    });
                    setTimeout(() => {
                        setFieldsValue({
                            comment: ''
                        });
                        if(commentId){
                            comments.map(data => {
                                (data.id == commentId) && (data.comment = '');
                            });
                        }else{
                            this.setState({commentContent: ''});
                        }
                        comments.push({
                            id,
                            content: data.content,
                            created_at: '刚刚',
                            laud: 0,
                            phone,
                            user_id,
                            userGive: 0
                        });
                        this.setState({
                            comment: comments
                        });
                        let {wrapper} = this.refs;
                        wrapper && (wrapper.scrollTop = wrapper.scrollHeight);
                    });
                });
            }).catch(this.middleware.bind(this));
        }
    }
    render(){
        let {form: {getFieldProps}} = this.props;
        let {like = 0, article, recommend, comment, visible, loaded, commentContent, commentPopover, commentLoading} = this.state;
        return (
            <div ref='wrapper' className={classnames({'wrapper wrapper-mobile wrapper-find-article': true, loaded})}>
                {article ? 
                    <List className='main'>
                        <Item>
                            <div className='title'>{article.title}</div>
                            <div className='desc'>
                                <span>{article.created_at}</span>
                                <span className='total'>{article.count}</span>
                            </div>
                            <Brief>
                                <div className='content' dangerouslySetInnerHTML={{__html: article.content}}/>
                            </Brief>
                        </Item>
                    </List>
                : ''}
                {(recommend && recommend.length) ? (
                    <List className='recommend' renderHeader={() => '更多推荐'}>
                        {recommend.map((data, index) => (
                            <Item key={index} onClick={this.article.bind(this, data.id)}>{data.title}</Item>
                        ))}
                    </List>
                ) : ''}
                {(comment && comment.length) ? 
                    <List className='comments' renderHeader={() => '回复'}>
                        {comment.map((data, index) => (
                            <Item key={index} thumb={thumb}>
                                <div className='title'>
                                    <span>{data.phone ? data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : `用户_${data.user_id}`}</span>
                                    <div className={classnames({handle: true, active: commentPopover == data.id})} onClick={this.showPopover.bind(this, data.id)}/>
                                    <div className={classnames({popover: true, active: commentPopover == data.id})}>
                                        <div className='like' onClick={this.like.bind(this, data.id)}>{!data.userGive ? '赞一下' : '取消'}</div>
                                        {false && (<div className='reply' onClick={this.reply.bind(this, data.id)}>回复</div>)}
                                    </div>
                                </div>
                                <Brief>
                                    <div className='date'>{data.created_at}</div>
                                    <div className='content'>{data.content}</div>
                                    <div className='laud'>
                                        <span>{data.laud}</span>
                                    </div>
                                </Brief>
                            </Item>
                        ))}
                    </List>
                : ''}
                <div className={classnames({'comment': true, visible})}>
                    <TextareaItem
                    rows={5}
                    count={150}
                    editable={!commentLoading}
                    {...getFieldProps('comment', {
                        onChange: this.setCommentContent.bind(this)
                    })}/>
                    <div className='button'>
                        <Button type='primary' size='small' inline disabled={commentLoading} loading={commentLoading} onClick={this.comment.bind(this)}>发表</Button>
                    </div>
                </div>
                <div className={classnames({'comment-mask': true, visible})} onClick={this.hideComment.bind(this)}/>
                <div ref='toolbar' className='toolbar' onClick={() => this.setState({commentPopover: 0})}>
                    <div className={classnames({'button like': true, active: (article && article.give)})} onClick={this.like.bind(this, undefined)}>
                        {like > 0 ? (<span>{like}</span>) : ''}
                    </div>
                    <div className='button reply' onClick={this.reply.bind(this, undefined)}>
                        <span>回复</span>
                    </div>
                </div>
                <div className={classnames({'popover-mask': true, visible: commentPopover})} onClick={() => this.setState({commentPopover: 0})}/>
            </div>
        )
    }
};

export default createForm()(Article);