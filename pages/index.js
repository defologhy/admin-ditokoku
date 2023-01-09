
import React, { useState } from 'react';
import { Breadcrumb, Layout } from 'antd';
const { Content } = Layout;

const ContentHome = () => {

  return (
    <Content
      style={{
        margin: '0 16px',
      }}
    >
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Beranda</Breadcrumb.Item>
        <Breadcrumb.Item>Beranda</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          //   background: colorBgContainer,
        }}
      >
        Bill is a cat.
      </div>
    </Content>
  );
};
export default ContentHome;