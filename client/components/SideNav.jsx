
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ScheduleOutlined
} from '@ant-design/icons';

import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;

export default function SideNav({ children, isAdmin }) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const router = useRouter();

  const menuItems = [
    {
      key: '1',
      icon: <ScheduleOutlined />,
      label: '活动管理',
      children: [
        {
          key: 'a1',
          label: '活动列表',
        }
      ]
    }
  ];
  if (!isAdmin) {
    menuItems[0].children.push({
      key: 'a2',
      label: '创建活动',
    });
  }
  if (isAdmin) {
    menuItems.push({
      key: '2',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'b1',
          label: '用户列表',
        },
        {
          key: 'b2',
          label: '新增用户',
        }
      ],
    });
  }



  const handleMenuItemClick = (key) => {
    switch (key) {
      case 'a1':
        router.push('/activities');
        break;
      case 'a2':
        router.push('/activities/create');
        break;
      case 'b1':
        router.push('/activities/users');
        break;
      case 'b2':
        router.push('/activities/addUser');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={({ key }) => handleMenuItemClick(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#eee",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}




