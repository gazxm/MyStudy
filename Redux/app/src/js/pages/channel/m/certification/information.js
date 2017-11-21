/* eslint-disable */
import extend from 'extend';
import lrz from 'lrz';
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {List, InputItem, Button, Picker, Toast, ImagePicker, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import Upload from 'rc-upload';
import classnames from 'classnames';
import 'scss/channel/m/certification/certification-layout.component.scss';
import 'scss/channel/m/certification/information.component.scss';

import request from 'common/request';
import {resolveUrl as url, redirect} from 'utils';
import Certificate from './certificate'

const title = '个人信息';
const Item = List.Item;

function customRequest(name, config){
    Toast.loading(undefined, 0);
    lrz(config.file, {
        width: 640
    }).then(data => {
        let {middleware, form: {setFieldsValue}} = this.props;
        request.post(config.action, extend(config.data, {
            attach: data.base64
        })).then(response => {
            let {item: {url}} = response.data;
            let image = new Image();
                image.src = url;
                image.onload = () => {
                    this.setState({
                        [name]: url
                    });
                }
                image.error = () => {
                    this.setState({
                        [name]: url
                    });
                }
                setFieldsValue({
                    [name]: url
                });
            Toast.success(response.message);
        }).catch(middleware.bind(this));
    }).catch(error => {
        Toast.fail('图片上传失败，请重试');
    });
}

const upload = {
    name: 'attach',
    action: url('http://credit.xianjincard.com/picture/upload-file'),
    data: {
        ocrtype: 4
    },
    accept: 'image/*',
    component: 'div',
    withCredentials: true,
    onError(error){
        Toast.fail('图片上传失败，请重试');
    }
};

const uploadSelfieProps = extend(true, {
    data: {
        type: 100
    }
}, upload);
const uploadIdCardFrondProps = extend(true, {
    data: {
        type: 110
    }
}, upload);
const uploadIdCardBackProps = extend(true, {
    data: {
        type: 120
    }
}, upload);

class Information extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        lock: true,
        // 数据加载完毕
        loaded: false,
        // request loading
        loading: false,
        // 按钮文案
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
        
    }
    componentDidMount(){
        document.title = title;
        let {middleware, step, loaded, formatPickerData, route, hideSteps, getButtonText} = this.props;
        let {buttonText} = this.state;
        let {router} = this.context;
        request('credit-card/get-person-info').then(response => {
            let {
                // 姓名
                name,
                // 身份证号码
                id_number,
                is_new_user,
                face_recognition_picture: selfie,
                id_number_z_picture: id_card_front,
                id_number_f_picture: id_card_back,
                company_worktype_id: worktype,
                company_worktype_list: worktypes,
                // 学历选中
                degrees: education,
                // 学历列表
                degrees_all: educations,
                // 现居地址
                address,
                address_distinct: street,
                // 居住时长选中
                live_period: liveTime,
                // 居住时长列表
                live_time_type_all: liveTimes,
                // 婚姻状况选中
                marriage,
                // 婚姻状况列表
                marriage_all: marriages,
                verify_loan_pass,
                real_verify_status: disabled
            } = response.data.item;
            [worktypes, educations, marriages, liveTimes].map(data => data.map(formatPickerData));
            buttonText = getButtonText(route);
            this.setState({
                name,
                id_number,
                is_new_user,
                selfie,
                id_card_front,
                id_card_back,
                worktype: worktype ? [worktype] : null,
                worktypes,
                education: education ? [education] : null,
                educations,
                address,
                street,
                marriage: marriage ? [marriage] : null,
                marriages,
                liveTime: liveTime ? [liveTime] : null,
                liveTimes,
                verify_loan_pass,
                disabled,
                buttonText,
                loaded: 1
            });
        }).catch(middleware.bind(this));
    }
    submit(){
        let {COMPLETED_TEXT, nextStepLink, route, middleware} = this.props;
        let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
        let {selfie, id_card_front, id_card_back} = this.state
        if(!selfie){
            Toast.fail('请拍摄上传本人自拍照')
            return
        }else if(!id_card_front){
            Toast.fail('请拍摄上传本人身份证正面照')
            return
        }else if(!id_card_back){
            Toast.fail('请拍摄上传本人身份证反面照')
            return
        }
        validateFields({force: false}, (errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, 3, () => {
                            let element = getFieldInstance(error.field);
                            if(element && element.refs && element.refs.input){
                                let {input} = element.refs;
                                setTimeout(input.focus());
                            }
                        });
                    });
                    break;
                }
            }else{
                let {lock, buttonText, disabled} = this.state;
                let {name, id_number, worktype, education, address, street: address_distinct, marriage, liveTime} = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loaded: 0, loading: 1});

                    let start = Date.now();
                    request.post(disabled ? 'credit-info/save-person-info' : 'credit-card/save-person-info', {
                        name,
                        id_number,
                        work_type: worktype ? worktype[0] : null,
                        degrees: education ? education[0] : null,
                        address: address || '',
                        address_distinct: address_distinct|| '',
                        marriage: marriage ? marriage[0] : null,
                        live_time_type: liveTime ? liveTime[0] : null
                    }).then(response => {
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        let {message} = response;
                        setTimeout(() => {
                            Toast.success(message, 3, () => {
                                buttonText = COMPLETED_TEXT;
                                setTimeout(() => nextStepLink(route));
                            });
                            this.setState({lock: 1, loaded: 1, loading: 0, disabled: 1, buttonText});
                        }, timeout);
                    }).catch(middleware.bind(this));
                }
            }
        });
    }
    componentWillReceiveProps(nextProps){
        let {middleware} = this.props
        let {query} = nextProps.location
        let {selfie, id_card_front, id_card_back} = query
        if('checkout' in query){
            this.setState({
                selfie, id_card_front, id_card_back
            })
        }
    }
    render(){
        let {form: {getFieldProps, getFieldsError, isFieldsTouched}, label} = this.props;
        let errors = getFieldsError();
        let {certificate} = this.props.location.query
        let {
            is_new_user,
            name,
            selfie,
            id_card_front,
            id_card_back,
            id_number,
            worktype,
            worktypes,
            education,
            educations,
            address,
            street,
            marriage,
            marriages,
            liveTime,
            liveTimes,
            buttonText,
            lock,
            loading,
            loaded,
            disabled,
            verify_loan_pass
        } = this.state;
        let editable = !loading && loaded && lock;
        return (
            <div className='information'>
                <List>
                    <Item
                    className='upload'
                    extra={
                        (selfie && id_card_front && id_card_back) ? '已上传' : '请上传'
                    }
                    arrow='horizontal'
                    onClick={() => redirect.push('/channel/m/certification/information?certificate')}>上传证件照片</Item>
                    <InputItem
                    editable={editable && !disabled}
                    labelNumber={5}
                    placeholder='姓名'
                    {...getFieldProps('name', {
                        initialValue: name,
                        rules: [{
                            required: true,
                            message: '姓名不能为空'
                        }, {
                            pattern: /[\u4e00-\u9fa5]+/,
                            message: '请输入正确的姓名'
                        }]
                    })}>
                        {label('姓名')}
                    </InputItem>
                    <InputItem
                    clear
                    editable={editable && !disabled}
                    labelNumber={5}
                    placeholder='身份证号码'
                    {...getFieldProps('id_number', {
                        initialValue: id_number,
                        rules: [{
                            required: true,
                            message: '身份证不能为空'
                        }, {
                            min: 15,
                            max: 18,
                            message: '身份证长度错误'
                        }]
                    })}>
                        {label('身份证号码')}
                    </InputItem>
                    <Picker
                    cols={1}
                    disabled={!editable}
                    labelNumber={5}
                    data={educations}
                    {...getFieldProps('education', {
                        initialValue: education,
                        rules: [{
                            required: true,
                            message: '请选择学历'
                        }]
                    })}>
                        <List.Item arrow='horizontal'>{label('学历')}</List.Item>
                    </Picker>
                    <Picker
                    cols={1}
                    disabled={!editable}
                    labelNumber={5}
                    data={worktypes}
                    {...getFieldProps('worktype', {
                        initialValue: worktype,
                        rules: [{
                            required: true,
                            message: '请选择工作类型'
                        }]
                    })}>
                        <List.Item arrow='horizontal'>{label('工作类型')}</List.Item>
                    </Picker>
                    {
                        // <InputItem
                        //     editable={editable}
                        //     labelNumber={5}
                        //     placeholder='现居地址'
                        //     {...getFieldProps('address', {
                        //         initialValue: address,
                        //         rules: [{
                        //             required: true,
                        //             message: '现居地址不能为空'
                        //         }]
                        //     })}>
                        //         {label('现居地址')}
                        //     </InputItem>
                        //     <InputItem
                        //     editable={editable}
                        //     className='street'
                        //     placeholder='填写具体街道门牌号'
                        //     {...getFieldProps('street', {
                        //         initialValue: street,
                        //         rules: [{
                        //             required: true,
                        //             message: '街道门牌号不能为空'
                        //         }]
                        //     })}></InputItem>
                    }
                    {
                        // <Picker
                        // cols={1}
                        // disabled={!editable}
                        // labelNumber={5}
                        // data={marriages}
                        // {...getFieldProps('marriage', {
                        //     initialValue: marriage,
                        //     rules: [{
                        //         required: true,
                        //         message: '请选择婚姻状况'
                        //     }]
                        // })}>
                        //     <List.Item arrow='horizontal'>{label('婚姻状况')}</List.Item>
                        // </Picker>
                        // <Picker
                        // cols={1}
                        // disabled={!editable}
                        // labelNumber={5}
                        // data={liveTimes}
                        // {...getFieldProps('liveTime', {
                        //     initialValue: liveTime,
                        //     rules: [{
                        //         required: true,
                        //         message: '请选择居住时长'
                        //     }]
                        // })}>
                        //     <List.Item arrow='horizontal'>{label('居住时长')}</List.Item>
                        // </Picker>
                    }
                </List>
                <Button
                    type='primary'
                    // disabled={!lock || disabled || loading}
                    loading={loading}
                    className={classnames({
                    'button-submit': true,
                    'button-round': true,
                    'button-loading': !loaded,
                    // 'button-disabled': disabled
                })}
                onClick={this.submit.bind(this)}>{buttonText}</Button>
                <div className='security'>银行级数据加密防护</div>
                {certificate !== undefined ? <Certificate {...this.props}/> : false}
            </div>
        )
    }
};

export default createForm()(Information);