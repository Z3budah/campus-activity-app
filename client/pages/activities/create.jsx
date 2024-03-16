import React from 'react'
import SideNav from '../../components/SideNav'
import Create from '../../components/activity/Create'


export default function create(props) {
  const { currentUser } = props;
  return (
    <SideNav isAdmin={currentUser.role == 'admin'}>
      <Create {...props} />
    </SideNav>
  )
}
