import React from 'react';
import SideNav from '../../components/SideNav'
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';

export default function addUser(props) {
  const { currentUser } = props;
  return (
    <SideNav isAdmin={currentUser.role == 'admin'}>
      <div style={{ margin: '0 auto', width: '50%' }}>
        <LoginForm type='signup' />
      </div>

    </SideNav>
  )

};
