import React from 'react'
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { Button, Radio, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function LoginFrom(props) {

  const apiUrl = `/api/users/${props.type}`;
  console.log(apiUrl);

  const { doRequest, errors } = useRequest({
    url: apiUrl,
    method: 'post',
    onSuccess: (data) => {
      console.log(data);
      if (data.role == "publisher") Router.push('/activities');
      else Router.push('/');
    }
  })

  const onSubmit = async (values) => {
    console.log(values);
    await doRequest(values);
    console.log(
      errors
    )
  }

  const btnText = props.type === 'signin' ? '登录' : '注册';

  const regSty = props.type === 'signup' ? "" : "d-none";
  const reg = props.type === 'signin';
  console.log(reg);

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
        {props.type === 'signup' && (<Form.Item
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
        {props.type === 'signup' && (
          <Form.Item name="role" label="用户类型" rules={[{ required: true, message: '"请选择用户类型...!' }]}>
            <Radio.Group>
              <Radio value="publisher">发布者</Radio>
              <Radio value="admin">管理员</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item >
          <Button className="rounded-pill" block type="primary" htmlType="submit">
            {btnText}
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
}