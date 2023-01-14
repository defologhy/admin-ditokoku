
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

const AdminAdd = (props) => {

    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }
    
    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    useEffect(() => {

    }, []);

    // router
    const router = useRouter()

    const [formAdd] = Form.useForm();
    // usestate
    const [txtFullNameProperties, setTxtFullNameProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtUsernameProperties, setTxtUsernameProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPasswordProperties, setTxtPasswordProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });

    // onchange item form
    const handleTxtFullNameChange = (e) => {
        setTxtFullNameProperties({
            value: e.target.value,
            validateStatus: 'success',
            errorMsg: null,
        })
        formAdd.setFieldsValue({
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
            formAdd.setFieldsValue({
                adminUsername: e.target.value,
            });
        } else {
            setTxtUsernameProperties({
                value: txtUsernameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Username Tidak Valid',
            })
            formAdd.setFieldsValue({
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
            formAdd.setFieldsValue({
                adminPassword: e.target.value,
            });
        } else {
            setTxtPasswordProperties({
                value: txtPasswordProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Password Tidak Valid',
            })
            formAdd.setFieldsValue({
                adminPassword: txtPasswordProperties.value,
            });
        }
    }

    const cleanFormAdd = () => {
        formAdd.setFieldsValue({
            adminFullName: ''
            , adminUsername: ''
            , adminPassword: ''
        });
    }

    // button save
    const handleAdd = () => {
        formAdd
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Simpan Data Admin ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Menyimpan Data:</Col></Row>
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
                                {formAdd.getFieldValue('adminUsername')}
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
                                {formAdd.getFieldValue('adminFullName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Menyimpan Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Add Data
                        const axiosConfigForAdminAdd = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/admins"
                            , method: "POST"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "admin_username": formAdd.getFieldValue('adminUsername'),
                                "admin_password": formAdd.getFieldValue('adminPassword'),
                                "responsible_user_id": 1,
                                "admin_full_name": formAdd.getFieldValue('adminFullName')
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const adminResults = await axios.request(axiosConfigForAdminAdd);
                            if (adminResults.data.hasOwnProperty('status_code') && adminResults.data.status_code != 201) {
                                throw adminResults.data
                            }
                            else {
                                cleanFormAdd();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Disimpan.</Col></Row>
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
                                    content: "Error Saat Menyimpan Data Admin.(Harap Lapor Kepada Admin)",
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
                title="Tambah Data Admin"
                bordered={false}
            // extra={<Button type="primary" >Tambah Admin</Button>}
            >
                <Form
                    name="basic"
                    form={formAdd}
                    labelCol={{ span: 6 }}
                    // initialValues={{
                    //     FullName: txtFullNameProperties.value
                    //     , AdminEffectiveStartDatetime: txtAdminEffectiveStartDatetimeProperties.value
                    //     , AdminEffectiveFinishDatetime: txtAdminEffectiveFinishDatetimeProperties.value
                    // }}
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
                            onChange={handleTxtUsernameChange}
                            onBlur={handleTxtUsernameChange}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="adminPassword"
                        rules={[
                            { required: true, message: 'Mohon Isi Password' }
                        ]}
                        validateStatus={txtPasswordProperties.validateStatus}
                        help={txtPasswordProperties.errorMsg}
                    >
                        <Input.Password
                            onChange={handleTxtPasswordChange}
                            onBlur={handleTxtPasswordChange}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Button type="primary" style={{ marginLeft: '100px' }} onClick={handleAdd}>
                        Simpan
                    </Button>
                </Form>
            </Card>
        </Content >
    );
};

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
    console.log("getcookie balance bonus config page");
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
  
export default AdminAdd;