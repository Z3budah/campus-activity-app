
import React, { useState } from 'react'
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

export default function signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/activities/manage')
  })

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>登录</h1>
      <div className='form-group'>
        <label>邮箱地址：</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
      </div>
      <div className='form-group'>
        <label>密码：</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className='form-control' />
      </div>
      <button className='btn btn-primary'>登录</button>
      {errors}
    </form>
  );
};
