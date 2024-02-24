import React from 'react'
import SideNav from '../../components/SideNav'
import Manage from '../../components/activity/Manage'
import Audit from '../../components/activity/Audit'

export default function index(props) {
  const { currentUser } = props;
  let isAdmin = false;
  if (currentUser) {
    isAdmin = currentUser.role == 'admin'
  }

  return (
    <SideNav isAdmin={isAdmin} >
      {isAdmin ? <Audit /> : <Manage {...props} />}
    </SideNav>
  )
}


