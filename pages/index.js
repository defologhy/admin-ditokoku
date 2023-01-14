
import React, { useState } from 'react';
import { Breadcrumb, Layout } from 'antd';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import Router, { useRouter } from 'next/router';
const { Content } = Layout;

const ContentHome = (props) => {
  
  const router = useRouter()
  if (process.browser){
      if (props.status_code === 401) {
          router.push('/auth/login')
      }
  }

  const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

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

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
  console.log("getcookie dashboard page");
  console.log(getCookie('admin_cookies', { req, res }))
  if (!getCookie('admin_cookies', { req, res })) {
      return {
          props: {
              status_code: 401,
              error_title: "Unauthorized",
              error_message: "Please sign in to Ditokoku Information System",
          }
      }
  }

  return {
      props: {
          status_code: 200,
          error_title: "cookie is active",
          error_message: "cookie is active",
          cookies_data: getCookie('admin_cookies', { req, res })
      }
  }

}

export default ContentHome;