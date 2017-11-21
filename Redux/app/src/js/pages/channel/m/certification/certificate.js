import qs from 'qs';
import extend from 'extend';
import lrz from 'lrz';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Button, Toast} from 'antd-mobile'
import classnames from 'classnames'
import {createForm} from 'rc-form'
import Upload from 'rc-upload';
import request from 'common/request'
import 'scss/channel/m/certification/certification-layout.component.scss'
import 'scss/channel/m/certification/certificate.component.scss'

import {resolveUrl as url, redirect} from 'utils';

function customRequest(name, config){
    Toast.loading(undefined, 0);
    lrz(config.file, {
        width: 640
    }).then(data => {
        let {middleware} = this.props;
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
            Toast.success(response.message);
        }).catch(middleware.bind(this));
    }).catch(error => {
        Toast.fail('图片上传失败，请重试');
    });
}

const upload = {
    className: 'needsclick',
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

class certificate extends Component {
  state = {
    lock: true,
    // 数据加载完毕
    loaded: false,
    // request loading
    loading: false,
    // 按钮文案
    buttonText: this.props.READY_TEXT
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    let {middleware, step, loaded, formatPickerData, route, hideSteps, getButtonText} = this.props;
    let {buttonText} = this.state;
    let {router} = this.context;
    hideSteps()
    request('credit-card/get-person-info').then(response => {
      let {
        face_recognition_picture: selfie,
        id_number_z_picture: id_card_front,
        id_number_f_picture: id_card_back,
      } = response.data.item
      buttonText = getButtonText(route);
      this.setState({
        selfie,
        id_card_front,
        id_card_back,
        buttonText,
        loaded: true
      })
    }).catch(response => {
      middleware.bind(this)(response)
      if(code != -2){
        setTimeout(() => {
          redirect.goBack()
        }, 3000)
      }
    })
  }
  componentWillUnmount(){
    let {showSteps} = this.props;
    showSteps()
  }
  submit(){
    let {selfie, id_card_front, id_card_back} = this.state
    let params = {selfie, id_card_front, id_card_back}
    redirect.replace({
        pathname: '/channel/m/certification/information',
        search: `?checkout&${qs.stringify(params)}`
    })
  }
  render () {
    let {id_card_front, id_card_back, selfie, lock, loaded, loading, buttonText} = this.state
    return (
      <div className='certificate' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        <div className='id_card'>
          <div className='frond'>
            <div className='upload' style={id_card_front ? {
                backgroundImage: `url(${id_card_front})`,
                backgroundSize: 'cover'
            } : {}}>
                <Upload {...extend(uploadIdCardFrondProps, {
                    customRequest: customRequest.bind(this, 'id_card_front')
                })}/>
            </div>
            <p>请拍摄上传本人<br />身份证正面</p>
          </div>
          <div className='back'>
            <div className='upload' style={id_card_back ? {
                backgroundImage: `url(${id_card_back})`,
                backgroundSize: 'cover'
            } : {}}>
                <Upload {...extend(uploadIdCardBackProps, {
                    customRequest: customRequest.bind(this, 'id_card_back')
                })}/>
            </div>
            <p>请拍摄上传本人<br />身份证反面</p>
          </div>
        </div>
        <div className='selfie'>
          <div className='upload' style={selfie ? {
                backgroundImage: `url(${selfie})`,
                backgroundSize: 'cover'
            } : {}}>
                <Upload {...extend(uploadSelfieProps, {
                    customRequest: customRequest.bind(this, 'selfie')
                })}/>
            </div>
          <p>请拍摄上传本人自拍照</p>
        </div>
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
      </div>
    )
  }
};

export default createForm()(certificate)