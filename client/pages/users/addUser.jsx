import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

export default function addUser(props) {
  return (
    <>
      <div style={{ margin: '0 auto', width: '50%' }}>
        <LoginForm type='create' />
      </div>
    </>
  )

};
