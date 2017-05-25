<List>
    <InputItem value={phone} editable={false}></InputItem>
    <InputItem
    extra={'忘记密码?'}
    editable={editable}
    placeholder='请输入手机服务密码'
    {...getFieldProps('service_password', {
        // initialValue: lineal_mobile,
        rules: [{
            required: true,
            message: '手机服务密码不能为空'
        }]
    })}/>
</List>
<div className='tips'>
    <p>温馨提示：</p>
    <p>1.请输入正确的运营商（移动、联通、电信）服务密码，如若忘记可通过拨打运营商服务电话或者登陆网上营业厅找回密码； </p>
    <p>2.运营商认证需要2~3分钟，请耐心等待；</p>
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
<AgreeItem defaultChecked={agree} {...getFieldProps('agree', {
    initialValue: agree,
    rules: [{
        required: true,
        message: '请同意运营商授权协议'
    }]
})}>我已阅读并同意<a href={url('http://credit.xianjincard.com/credit-web/operator')}>《运营商授权协议》</a></AgreeItem>
<div className='security'>银行级数据加密防护</div>