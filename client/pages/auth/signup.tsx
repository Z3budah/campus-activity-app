import React, { useState } from 'react'
import useRequest from '../../hooks/use-request';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import Router from 'next/router';
import Image from 'next/image';
import auth from './auth.module.less'

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function signup() {

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    onSuccess: () => Router.push('/activities/manage')
  })


  const onSubmit = async (values: any) => {
    await doRequest(values);
    console.log(
      errors
    )
  }

  return (
    <div className={auth.container}>
      <div className={auth.login}>
        <div className={`${auth.bgimage} ${auth.dnone} ${auth.dblock}`}>
          <Image
            src="/img/02.jpg"
            alt="register image"
            width={433}
            height={576}
          ></Image>
        </div>
        <Form
          className={auth.formTable}
          onFinish={onSubmit}>
          <h2>Create an Account!</h2>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: 'Please enter username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder='Enter Username..' />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button className={auth.logbtn} type="primary" htmlType="submit">
              Register
            </Button>
            <br />
          </Form.Item>
          {errors &&
            (<div className='alert alert-danger'>
              <h4>Ooops...</h4>
              <ul className='my-0'>
                {errors.map(err => <li key={err.message}> {err.message} </li>)}
              </ul>
            </div>)
          }
        </Form>

      </div>
    </div>
  );
};