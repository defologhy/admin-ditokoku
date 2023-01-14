import React,{Fragment} from 'react';
import { Layout, theme, Menu, Avatar } from 'antd';
const { Header } = Layout;
import {
  UserOutlined, LogoutOutlined
} from '@ant-design/icons';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import Router, { useRouter } from 'next/router';

const HeaderPage = () => {

  const router = useRouter()

  const handleSignOut = async () => {
    deleteCookie('admin_cookies')
    router.push('/auth/login')
}

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
          <Menu.SubMenu title={
            <Avatar
            // style={{
            //   backgroundColor: 'black'
            // }}
            size={'medium'}
            icon={<UserOutlined />}
          >
          </Avatar>
          } style={{marginRight:'10px'}} >
          {/* <Menu.Item key="setting:1">
            <span>
              <UserOutlined />
              &nbsp;Profile
            </span>
          </Menu.Item> */}
          <Menu.Item key="setting:2" onClick={handleSignOut}>
            <span>
              <LogoutOutlined />
              &nbsp;Keluar
            </span>
          </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        </Header>
    </>
  );
};
export default HeaderPage;