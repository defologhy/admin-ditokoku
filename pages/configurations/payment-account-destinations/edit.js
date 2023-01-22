
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

const ConfigurationPaymentAccountDestinationEdit = (props) => {

    const router = useRouter()
    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }

    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    const [formEdit] = Form.useForm();
    // usestate
    const [txtPaymentAccountDestinationBankNameProperties, setTxtPaymentAccountDestinationBankNameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPaymentAccountDestinationNumberProperties, setTxtPaymentAccountDestinationNumberProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPaymentAccountDestinationHolderNameProperties, setTxtPaymentAccountDestinationHolderNameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });

    useEffect(() => {
        formEdit.setFieldsValue({
            paymentAccountDestinationBankName: (router.query.payment_account_destination_bank_name ? router.query.payment_account_destination_bank_name : null)
            , paymentAccountDestinationNumber: router.query.payment_account_destination_number
            , paymentAccountDestinationHolderName: router.query.payment_account_destination_holder_name
        });
    }, []);

    // onchange item form
    const handleTxtPaymentAccountDestinationBankNameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPaymentAccountDestinationBankNameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationBankName: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationBankNameProperties({
                value: txtPaymentAccountDestinationBankNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Tidak Valid',
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationBankName: txtPaymentAccountDestinationBankNameProperties.value,
            });
        }
    }

    const handleTxtPaymentAccountDestinationNumberChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPaymentAccountDestinationNumberProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationNumber: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationNumberProperties({
                value: txtPaymentAccountDestinationBankNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Isi Dengan Angka',
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationNumber: txtPaymentAccountDestinationNumberProperties.value,
            });
        }
    }

    const handleTxtPaymentAccountDestinationHolderNameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPaymentAccountDestinationHolderNameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationHolderName: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationHolderNameProperties({
                value: txtPaymentAccountDestinationHolderNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Tidak Valid',
            })
            formEdit.setFieldsValue({
                paymentAccountDestinationHolderName: txtPaymentAccountDestinationHolderNameProperties.value,
            });
        }
    }

    const cleanFormEdit = () => {
        formEdit.setFieldsValue({
            paymentAccountDestinationBankName: null
            , paymentAccountDestinationNumber: null
            , paymentAccountDestinationHolderName: null
        })
    }

    // button save
    const handleEdit = () => {
        formEdit
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Ubah Data Konfigurasi Akun Bank Tujuan ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Merubah Data:</Col></Row>
                        <br />
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Nama Bank
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('paymentAccountDestinationBankName')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Nomor Rekening
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('paymentAccountDestinationNumber')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Atas Nama
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('paymentAccountDestinationHolderName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Merubah Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Edit Data
                        const axiosConfigForConfigurationPaymentAccountDestinationEdit = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/configuration-payment-account-destinations"
                            , method: "PATCH"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "payment_account_destination_id":router.query.payment_account_destination_id,
                                "payment_account_destination_holder_name": 
                                formEdit.getFieldValue('paymentAccountDestinationHolderName'),
                                "payment_account_destination_number": 
                                formEdit.getFieldValue('paymentAccountDestinationNumber'),
                                "payment_account_destination_bank_name":
                                formEdit.getFieldValue('paymentAccountDestinationBankName'),
                                "responsible_user_id": cookiesData.admin_id
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const configurationPaymentAccountDestinationResults = await axios.request(axiosConfigForConfigurationPaymentAccountDestinationEdit);
                            if (configurationPaymentAccountDestinationResults.data.hasOwnProperty('status_code') && configurationPaymentAccountDestinationResults.data.status_code != 200) {
                                throw configurationPaymentAccountDestinationResults.data
                            }
                            else {
                                cleanFormEdit();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Dirubah.</Col></Row>
                                    </div>,
                                    onOk: async () => {
                                        router.push('/configurations/payment-account-destinations')
                                    }
                                })

                            }
                        }
                        catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Merubah Data Konfigurasi Akun Bank Tujuan.(Harap Lapor Kepada Admin)",
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
                title="Ubah Data Konfigurasi Akun Bank Tujuan"
                bordered={false}
            // extra={<Button type="primary" >Tambah Reseller</Button>}
            >
                <Form
                    name="basic"
                    form={formEdit}
                    labelCol={{ span: 6 }}
                    autoComplete="off"
                    style={{ width: '50%' }}
                >
                    <Form.Item
                        label="Nama Bank"
                        name="paymentAccountDestinationBankName"
                        rules={[
                            { required: true, message: 'Mohon Isi Nama Bank' }
                        ]}
                        validateStatus={txtPaymentAccountDestinationBankNameProperties.validateStatus}
                        help={txtPaymentAccountDestinationBankNameProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.payment_account_destination_bank_name}
                            onChange={handleTxtPaymentAccountDestinationBankNameChange}
                            onBlur={handleTxtPaymentAccountDestinationBankNameChange}
                            placeholder="Nama Bank"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Nomor Rekening"
                        name="paymentAccountDestinationNumber"
                        rules={[
                            { required: true, message: 'Mohon Isi Nomor Rekening' }
                        ]}
                        validateStatus={txtPaymentAccountDestinationNumberProperties.validateStatus}
                        help={txtPaymentAccountDestinationNumberProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.payment_account_destination_number}
                            maxLength={15}
                            onChange={handleTxtPaymentAccountDestinationNumberChange}
                            onBlur={handleTxtPaymentAccountDestinationNumberChange}
                            placeholder="No HP"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Atas Nama"
                        name="paymentAccountDestinationHolderName"
                        rules={[
                            { required: true, message: 'Mohon Isi Atas Nama' }
                        ]}
                        validateStatus={txtPaymentAccountDestinationHolderNameProperties.validateStatus}
                        help={txtPaymentAccountDestinationHolderNameProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.payment_account_destination_holder_name}
                            onChange={handleTxtPaymentAccountDestinationHolderNameChange}
                            onBlur={handleTxtPaymentAccountDestinationHolderNameChange}
                            placeholder="Atas Nama"
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

export default ConfigurationPaymentAccountDestinationEdit;