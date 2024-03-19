import React from 'react'
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { Button, Radio, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';


/* redux */
import { connect } from 'react-redux';
import action from '../../store/actions';

const LoginForm = function LoginFrom(props) {

  console.log(props);
  let { addUser } = props;

  const apiUrl = `/api/users/${props.type}`;


  const { doRequest, errors } = useRequest({
    url: apiUrl,
    method: 'post',
    onSuccess: (data) => {
      if (props.type === 'create') {
        console.log("data:", data);
        addUser(data);
        Router.push('/users')
      }
      else Router.push('/');
    }
  })

  const onSubmit = async (values) => {
    await doRequest(values);
    console.log(
      errors
    )
  }

  const btnTxt = {
    'signin': '登录',
    'signup': '注册',
    'create': '创建'
  }


  const reg = props.type !== 'signin';

  return (
    <>
      <Form onFinish={onSubmit} className="mt-5" >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "请输入邮箱地址..." }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入邮箱地址..." />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '"请输入密码...!' }]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='请输入密码...' />
        </Form.Item>
        {reg && (<Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('输入密码不匹配，请重新输入!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='请确认密码...' />
        </Form.Item>
        )}
        {reg && (
          <Form.Item name="role" label="用户类型" rules={[{ required: true, message: '"请选择用户类型...!' }]}>
            <Radio.Group>
              <Radio value="publisher">发布者</Radio>
              <Radio value="admin">管理员</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item >
          <Button className="rounded-pill" block type="primary" htmlType="submit">
            {btnTxt[props.type]}
          </Button>
          <br />
        </Form.Item>
      </Form>
      {errors &&
        (<div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {errors.map(err => <li key={err.message}> {err.message} </li>)}
          </ul>
        </div>)
      }
    </>
  )
};


export default connect(
  state => state.user,
  action.user
)(LoginForm);