
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

const CategoryProductAdd = (props) => {

    // router
    const router = useRouter()
    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }
    
    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    useEffect(() => {

    }, []);

    const [formAdd] = Form.useForm();
    // usestate
    const [txtCategoryProductNameProperties, setTxtCategoryProductNameProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });

    // onchange item form
    const handleTxtCategoryProductNameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtCategoryProductNameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formAdd.setFieldsValue({
                categoryProductName: e.target.value,
            });
        } else {
            setTxtCategoryProductNameProperties({
                value: txtCategoryProductNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Nama Kategori Produk Tidak Valid',
            })
            formAdd.setFieldsValue({
                categoryProductName: txtCategoryProductNameProperties.value,
            });
        }
    }

    const cleanFormAdd = () => {
        formAdd.setFieldsValue({
            categoryProductName: ''
        });
    }

    // button save
    const handleAdd = () => {
        formAdd
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Simpan Data Kategori Produk ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Menyimpan Data:</Col></Row>
                        <br />
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Nama Kategori Produk
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formAdd.getFieldValue('categoryProductName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Menyimpan Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Add Data
                        const axiosConfigForCategoryProductAdd = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/category-products"
                            , method: "POST"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "category_product_name": formAdd.getFieldValue('categoryProductName'),
                                "responsible_user_id": 1
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const categoryProductResults = await axios.request(axiosConfigForCategoryProductAdd);
                            if (categoryProductResults.data.hasOwnProperty('status_code') && categoryProductResults.data.status_code != 201) {
                                throw categoryProductResults.data
                            }
                            else {
                                cleanFormAdd();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Disimpan.</Col></Row>
                                    </div>,
                                    onOk: async () => {
                                        router.push('/category-products')
                                    }
                                })

                            }
                        }
                        catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Menyimpan Data Category Product.(Harap Lapor Kepada Admin)",
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
                title="Tambah Data Kategori Produk"
                bordered={false}
            // extra={<Button type="primary" >Tambah Kategori Produk</Button>}
            >
                <Form
                    name="basic"
                    form={formAdd}
                    labelCol={{ span: 6 }}
                    // initialValues={{
                    //     FullName: txtFullNameProperties.value
                    //     , CategoryProductEffectiveStartDatetime: txtCategoryProductEffectiveStartDatetimeProperties.value
                    //     , CategoryProductEffectiveFinishDatetime: txtCategoryProductEffectiveFinishDatetimeProperties.value
                    // }}
                    autoComplete="off"
                    style={{ width: '60%' }}
                >
                    <Form.Item
                        label="Nama Kategori Produk"
                        name="categoryProductName"
                        rules={[
                            { required: true, message: 'Mohon Isi Nama Kategori Produk' }
                        ]}
                        validateStatus={txtCategoryProductNameProperties.validateStatus}
                        help={txtCategoryProductNameProperties.errorMsg}
                    >
                        <Input
                            onChange={handleTxtCategoryProductNameChange}
                            onBlur={handleTxtCategoryProductNameChange}
                            placeholder="Nama Kategori Produk"
                        />
                    </Form.Item>

                    <Button type="primary" style={{ marginLeft: '160px' }} onClick={handleAdd}>
                        Simpan
                    </Button>
                </Form>
            </Card>
        </Content >
    );
};

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
    console.log("getcookie category product add page");
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
  
export default CategoryProductAdd;