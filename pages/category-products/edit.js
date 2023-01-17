
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

const CategoryProductEdit = (props) => {

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
    const [txtCategoryProductNameProperties, setTxtCategoryProductNameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });

    useEffect(() => {
        formEdit.setFieldsValue({
            categoryProductName: router.query.category_product_name
        });
    }, []);

    // onchange item form
    const handleTxtCategoryProductNameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtCategoryProductNameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                categoryProductName: e.target.value,
            });
        } else {
            setTxtCategoryProductNameProperties({
                value: txtCategoryProductNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Nama Kategori Produk Tidak Valid',
            })
            formEdit.setFieldsValue({
                categoryProductName: txtCategoryProductNameProperties.value,
            });
        }
    }

    const cleanFormEdit = () => {
        formEdit.setFieldsValue({
            categoryProductName: null
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
                    title: <span>Rubah Data Kategori Produk ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Merubah Data:</Col></Row>
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
                                {formEdit.getFieldValue('categoryProductName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Merubah Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Edit Data
                        const axiosConfigForCategoryProductEdit = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/category-products"
                            , method: "PATCH"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "category_product_id": router.query.category_product_id,
                                "category_product_name": formEdit.getFieldValue('categoryProductName'),
                                "responsible_user_id": 1
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const categoryProductResults = await axios.request(axiosConfigForCategoryProductEdit);
                            if (categoryProductResults.data.hasOwnProperty('status_code') && categoryProductResults.data.status_code != 200) {
                                throw categoryProductResults.data
                            }
                            else {
                                cleanFormEdit();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Dirubah.</Col></Row>
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
                                    content: "Error Saat Merubah Data Category Product.(Harap Lapor Kepada Admin)",
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
                title="Rubah Data Kategori Produk"
                bordered={false}
            // extra={<Button type="primary" >Tambah Kategori Produk</Button>}
            >
                <Form
                    name="basic"
                    form={formEdit}
                    labelCol={{ span: 6 }}
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
                            defaultValue={router.query.category_product_name}
                            onChange={handleTxtCategoryProductNameChange}
                            onBlur={handleTxtCategoryProductNameChange}
                            placeholder="Nama Kategori Produk"
                        />
                    </Form.Item>

                    <Button type="primary" style={{ marginLeft: '160px' }} onClick={handleEdit}>
                    Rubah
                    </Button>
                </Form>
            </Card>
        </Content >
    );
};

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
    console.log("getcookie category product edit page");
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
  
export default CategoryProductEdit;