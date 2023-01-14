import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Form, Input, Button, Modal, Checkbox, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import {MagicSpinner} from "react-spinners-kit";
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import styles from '../../styles/login.module.css'
import Head from 'next/head'

Router.onRouteChangeStart = (url) => {
    console.log(url);
    NProgress.start();
}

Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };

function LoginPage(props) {

    const router = useRouter()
    if (process.browser) {
        if (props.status_code === 200) {
            router.push('/')
        }
    }

    const [values, setValues] = useState({
        phoneNumber: "08111994426"
        , emailAddress: ""
        , password: "SaYAJ1MMY"
        , loading: false
        , redirectToHomePage: false
    })

    const handleLogin = async (formData) => {
        try {
            console.log(formData.username);
            setValues({
                ...values
                , username: formData.username
                , password: formData.password
                , loading: true
            });
            let signInResult;

            //Set Axios Configuration For Sign In to NextJS Server
            const axiosConfigSignIn = {
                url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + '/admins/sign-in'
                , method: "POST"
                , timeout: 40000
                , responseType: "json"
                , responseEncoding: "utf8"
                , headers: { "Content-Type": "application/json" }
                , data: {
                    "admin_username": formData.username
                    , "admin_password": formData.password
                }
            };

            //Execute Axios Configuration For JsonContentValidation
            try {
                signInResult = await axios.request(axiosConfigSignIn);
                console.log("signInResult:");console.log(signInResult);
                setValues({ ...values, loading: false });

                setCookie('admin_cookies', signInResult.data.data, { expires: Number(process.env.REACT_APP_COOKIE_EXPIRES) });
                // setCookie('admin_cookies', signInResult.data.data, { maxAge: Number(process.env.REACT_APP_COOKIE_EXPIRES) });

                console.log("Hasil Sig In")
                //console.log(sigInResults);
                router.push("/");
            } catch (error) {
                console.log("signIn Error:");console.log(error);
                throw error.response.data;
            }

        } catch (error) {
            setValues({ ...values, loading: false });
            //setIsModalVisible(true);
            Modal.error({
                title: error.error_title,
                content: error.error_message,
            });
            console.log(error)
        }
    };

    return (
        <div>
            <Head>
                <title>Admin Ditokoku.id</title>
            </Head>
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '80vh' }}>
                <Form onFinish={handleLogin} className={styles.form}>
                    <div className={styles.imgcontainer}>
                        <img src="/assets/images/ditokoku.png" alt="Avatar" className={styles.avatar} />
                    </div>

                    <div className={styles.container}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon Isi Username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mohon Isi Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={styles.button}>
                                Log in
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Row>
        </div>
    )
}

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
    console.log("getcookie login page");
    console.log(getCookie('admin_cookies', { req, res }))
    if (!getCookie('admin_cookies', { req, res }) || getCookie('admin_cookies', { req, res }) === null || getCookie('admin_cookies', { req, res }) === '') {
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

export default LoginPage;
