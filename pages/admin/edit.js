
import React, { useEffect, useState, useRef } from 'react';
import NProgress from 'nprogress';
import axios from "axios";
import Router, { useRouter } from 'next/router';
import { Card, Layout, Upload, Button, Input, Form, Select, Row, Col, Modal } from 'antd';
const { Content } = Layout;
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

Router.onRouteChangeStart = (url) => {
    console.log(url);
    NProgress.start();
}
Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };
const { confirm, success } = Modal;

const AdminEdit = (props) => {

    // router
    const router = useRouter()
    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }
    
    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    const [formEdit] = Form.useForm();
    // usestate
    const [txtFullNameProperties, setTxtFullNameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtUsernameProperties, setTxtUsernameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPasswordProperties, setTxtPasswordProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });

    useEffect(() => {
        formEdit.setFieldsValue({
            adminFullName: (router.query.admin_full_name ? router.query.admin_full_name : null)
            , adminUsername: router.query.admin_username
        });
    }, []);

    // onchange item form
    const handleTxtFullNameChange = (e) => {
        setTxtFullNameProperties({
            value: e.target.value,
            validateStatus: 'success',
            errorMsg: null,
        })
        formEdit.setFieldsValue({
            adminFullName: e.target.value,
        });
    }

    const handleTxtUsernameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtUsernameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                adminUsername: e.target.value,
            });
        } else {
            setTxtUsernameProperties({
                value: txtUsernameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Username Tidak Valid',
            })
            formEdit.setFieldsValue({
                adminUsername: txtUsernameProperties.value,
            });
        }
    }

    const handleTxtPasswordChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPasswordProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                adminPassword: e.target.value,
            });
        } else {
            setTxtPasswordProperties({
                value: txtPasswordProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Password Tidak Valid',
            })
            formEdit.setFieldsValue({
                adminPassword: txtPasswordProperties.value,
            });
        }
    }

    const cleanFormEdit = () => {
        formEdit.setFieldsValue({
            adminFullName: null
            , adminUsername: null
            , adminPassword: null
        });
    }

    // button save
    const handleEdit = () => {
        console.log("formEdit"); console.log(formEdit.getFieldsValue())
        formEdit
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Ubah Data Admin ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Merubah Data:</Col></Row>
                        <br />
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Username
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('adminUsername')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Nama Lengkap
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('adminFullName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Merubah Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Edit Data
                        const axiosConfigForAdminEdit = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/admins"
                            , method: "PATCH"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "admin_id": router.query.admin_id,
                                "admin_username": formEdit.getFieldValue('adminUsername'),
                                "admin_password": (formEdit.getFieldValue('adminPassword') ? formEdit.getFieldValue('adminPassword') : null),
                                "responsible_user_id": 1,
                                "admin_full_name": formEdit.getFieldValue('adminFullName')
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const adminResults = await axios.request(axiosConfigForAdminEdit);
                            if (adminResults.data.hasOwnProperty('status_code') && adminResults.data.status_code != 200) {
                                throw adminResults.data
                            }
                            else {
                                cleanFormEdit();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Dirubah.</Col></Row>
                                    </div>,
                                    onOk: async () => {
                                        router.push('/admin')
                                    }
                                })

                            }
                        }
                        catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Merubah Data Admin.(Harap Lapor Kepada Admin)",
                                });
                            }
                            else {
                                if (error.response.status === 401) {
                                    Router.push("/auth/login");
                                    return {}
                                }
                                Modal.error({
                                    title: error.response.data.error_title,
                                    content: error.response.data.error_message,
                                });
                            }
                        }

                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);

            });

    };

    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <br />
            <Card
                title="Ubah Data Admin"
                bordered={false}
            // extra={<Button type="primary" >Tambah Admin</Button>}
            >
                <Form
                    name="basic"
                    form={formEdit}
                    labelCol={{ span: 6 }}
                    autoComplete="off"
                    style={{ width: '50%' }}
                >
                    <Form.Item
                        label="Nama Lengkap"
                        name="adminFullName"
                        rules={[
                            { required: true, message: 'Mohon Isi Nama Lengkap' }
                        ]}
                    >
                        <Input
                            defaultValue={router.query.admin_full_name}
                            onChange={handleTxtFullNameChange}
                            onBlur={handleTxtFullNameChange}
                            placeholder="Nama Lengkap"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="adminUsername"
                        rules={[
                            { required: true, message: 'Mohon Isi Username' }
                        ]}
                        validateStatus={txtUsernameProperties.validateStatus}
                        help={txtUsernameProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.admin_username}
                            onChange={handleTxtUsernameChange}
                            onBlur={handleTxtUsernameChange}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="adminPassword"
                    >
                        <Input.Password
                            onChange={handleTxtPasswordChange}
                            onBlur={handleTxtPasswordChange}
                            placeholder="Password (Kosongkan Bila Tidak Ingin Ubah)"
                        />
                    </Form.Item>

                    <Button type="primary" style={{ marginLeft: '100px' }} onClick={handleEdit}>
                    Ubah
                    </Button>
                </Form>
            </Card>
        </Content >
    );
};

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
    console.log("getcookie admin page");
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
  
export default AdminEdit;