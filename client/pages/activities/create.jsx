import React from 'react'
import SideNav from '../../components/SideNav'
import Create from '../../components/activity/Create'


export default function create(props) {
  return (
    <SideNav>
      <Create {...props} />
    </SideNav>
  )
}
