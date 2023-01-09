import React,{Fragment} from 'react';
import { Layout, theme, Menu, Avatar } from 'antd';
const { Header } = Layout;
import {
  UserOutlined, LogoutOutlined
} from '@ant-design/icons';
import { getUsernameAvatar } from './user-avatar';

const HeaderPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
    <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Menu mode="horizontal" style={{
            float: 'right'
          }}>
          <Menu.SubMenu title={getUsernameAvatar('defit')} >
          <Menu.Item key="setting:1">
            <span>
              <UserOutlined />
              &nbsp;Profile
            </span>
          </Menu.Item>
          <Menu.Item key="setting:2">
            <span>
              <LogoutOutlined onClick={'#'} />
              &nbsp;Logout
            </span>
          </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        </Header>
    </>
  );
};
export default HeaderPage;