import HeaderPage from '../components/header';
import FooterPage from '../components/footer';
import SidebarPage from '../components/sidebar';
import React from 'react';
import { Layout } from 'antd';
import Head from 'next/head'

const LayoutBase = ({ children }) => {

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Head>
        <title>Ditokoku.id</title>
        <link rel="shortcut icon" href="/assets/images/ditokoku2.png" />
      </Head>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider> */}
      <SidebarPage/>
      <Layout className="site-layout">
        <HeaderPage />
        {children}
        <FooterPage />
      </Layout>
    </Layout>
  );
};
export default LayoutBase;