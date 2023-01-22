
import React, { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import axios from "axios";
import Router, { useRouter } from 'next/router';
import { Card, Layout, Button, Input, Form, Row, Col, Modal } from 'antd';
const { Content } = Layout;
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next';

Router.onRouteChangeStart = (url) => {
    console.log(url);
    NProgress.start();
}
Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };
const { confirm, success } = Modal;

const ConfigurationPaymentAccountDestinationAdd = (props) => {

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
    const [txtPaymentAccountDestinationBankNameProperties, setTxtPaymentAccountDestinationBankNameProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPaymentAccountDestinationNumberProperties, setTxtPaymentAccountDestinationNumberProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPaymentAccountDestinationHolderNameProperties, setTxtPaymentAccountDestinationHolderNameProperties] = useState({
        value: '',
        validateStatus: 'success',
        errorMsg: null,
    });

    // onchange item form
    const handleTxtPaymentAccountDestinationBankNameChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[A-Za-z0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPaymentAccountDestinationBankNameProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formAdd.setFieldsValue({
                paymentAccountDestinationBankName: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationBankNameProperties({
                value: txtPaymentAccountDestinationBankNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Tidak Valid',
            })
            formAdd.setFieldsValue({
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
            formAdd.setFieldsValue({
                paymentAccountDestinationNumber: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationNumberProperties({
                value: txtPaymentAccountDestinationBankNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Isi Dengan Angka',
            })
            formAdd.setFieldsValue({
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
            formAdd.setFieldsValue({
                paymentAccountDestinationHolderName: e.target.value,
            });
        } else {
            setTxtPaymentAccountDestinationHolderNameProperties({
                value: txtPaymentAccountDestinationHolderNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Tidak Valid',
            })
            formAdd.setFieldsValue({
                paymentAccountDestinationHolderName: txtPaymentAccountDestinationHolderNameProperties.value,
            });
        }
    }

    const cleanFormAdd = () => {
        formAdd.setFieldsValue({
            paymentAccountDestinationBankName: ''
            , paymentAccountDestinationNumber: ''
            , paymentAccountDestinationHolderName: ''
        });
    }

    // button save
    const handleAdd = () => {
        formAdd
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Simpan Data Konfigurasi Akun Bank Tujuan ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Menyimpan Data:</Col></Row>
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
                                {formAdd.getFieldValue('paymentAccountDestinationBankName')}
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
                                {formAdd.getFieldValue('paymentAccountDestinationNumber')}
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
                                {formAdd.getFieldValue('paymentAccountDestinationHolderName')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Menyimpan Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Add Data
                        const axiosConfigForConfigurationPaymentAccountDestinationAdd = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/configuration-payment-account-destinations"
                            , method: "POST"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "payment_account_destination_holder_name": 
                                formAdd.getFieldValue('paymentAccountDestinationHolderName'),
                                "payment_account_destination_number": 
                                formAdd.getFieldValue('paymentAccountDestinationNumber'),
                                "payment_account_destination_bank_name":
                                formAdd.getFieldValue('paymentAccountDestinationBankName'),
                                "responsible_user_id": cookiesData.admin_id
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const configurationPaymentAccountDestinationResults = await axios.request(axiosConfigForConfigurationPaymentAccountDestinationAdd);
                            if (configurationPaymentAccountDestinationResults.data.hasOwnProperty('status_code') && configurationPaymentAccountDestinationResults.data.status_code != 201) {
                                throw configurationPaymentAccountDestinationResults.data
                            }
                            else {
                                cleanFormAdd();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Disimpan.</Col></Row>
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
                                    content: "Error Saat Menyimpan Data Konfigurasi Akun Bank Tujuan.(Harap Lapor Kepada Admin)",
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
                title="Tambah Data Konfigurasi Akun Bank Tujuan"
                bordered={false}
            // extra={<Button type="primary" >Tambah Akun Bank Tujuan</Button>}
            >
                <Form
                    name="basic"
                    form={formAdd}
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
                            maxLength={15}
                            onChange={handleTxtPaymentAccountDestinationNumberChange}
                            onBlur={handleTxtPaymentAccountDestinationNumberChange}
                            placeholder="No Rekening"
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
                            onChange={handleTxtPaymentAccountDestinationHolderNameChange}
                            onBlur={handleTxtPaymentAccountDestinationHolderNameChange}
                            placeholder="Atas Nama"
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

export default ConfigurationPaymentAccountDestinationAdd;