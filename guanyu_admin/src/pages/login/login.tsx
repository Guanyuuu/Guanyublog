import React,{FC, useState} from "react";
import {Form, Input, Button} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Slide from "../../components/Slide/Slide"
import {requestLoginAuth} from '../../util/requestMethod'
import './css.scss'

interface loginInfo {
    username:string
    password:string
}

const Login:FC = (props:any) => {
    const [slideShow, setSlideShow] = useState<boolean>(false)

    const onFinish = async(values: loginInfo) => {
        let res = await requestLoginAuth(values)
        if(res.data.data === '登录成功') {
            sessionStorage.setItem('uniqueIdf', res.data.uniqueIdf)
            setSlideShow(true)
        }else {
            console.log('fail');
        }
    }
    

    return (
        <div className="login-con">
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <a className="login-form-forgot" href="/">
                    Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    Or <a href="/main">register now!</a>
                </Form.Item>
            </Form>
            {
                slideShow && <Slide history={props.history}/>
            }
        </div>
    )
}
export default Login