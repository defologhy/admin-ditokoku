
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

const BalanceBonus = (props) => {

    
    const router = useRouter()
    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }

    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    const [form] = Form.useForm();
    // usestate
    const [txtAmountProperties, settxtAmountProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtMinimumAmountSalesOrderProperties, settxtMinimumAmountSalesOrderProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [dataConfigBonus, setDataConfigBonus] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await getDataData();
    }

    const getDataData = async () => {
        try {

            //Set Axios Configuration For Sign In to NextJS Server
            const axiosConfigForGetData = {
                url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + '/configuration-balance-bonus'
                , method: "GET"
                , timeout: 40000
                , responseType: "json"
                , responseEncoding: "utf8"
                , headers: { "Content-Type": "application/json" }
            };

            //Execute Axios Configuration For JsonContentValidation
            try {
                const getDataResults = await axios.request(axiosConfigForGetData);
                const getData = getDataResults.data;
                
                form.setFieldsValue({
                    amount: (getData.data.length!=0 ? getData.data[0].configuration_balance_bonus_amount : 0)
                    , minimumAmountSalesOrder: (getData.data.length!=0 ? getData.data[0].minimum_amount_sales_order : 0)
                });
            } catch (error) {
                console.log(error)
                if (error.response == null) {
                    // Modal.error({
                    //     title: "Internal Server Error",
                    //     content: "Error On Get Data SKU Plant Storage Location. (Please contact you system administrator and report this error message)",
                    // });
                } else {
                    // if (error.response.status === 401) {
                    //     Router.push("/security/sign-in");
                    //     return {}
                    // }
                    // Modal.error({
                    //     title: error.response.data.error_title,
                    //     content: error.response.data.error_message,
                    // });
                }
            }

        } catch (error) {
            console.log(error.error_message)
            console.log(error)
            // Modal.error({
            //     title: error.error_title,
            //     content: error.error_message,
            // });
        }
    }

    // onchange item form
    const handletxtAmountChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
            settxtAmountProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            form.setFieldsValue({
                amount: e.target.value,
            });
        } else {
            settxtMinimumAmountSalesOrderProperties({
                value: txtAmountProperties.value,
                validateStatus: 'error',
                errorMsg: 'Nomor HP hanya dapat di isi dengan angka',
            })
            form.setFieldsValue({
                minimumAmountSalesOrder: txtMinimumAmountSalesOrderProperties.value,
            });
        }
    }

    const handletxtMinimumAmountSalesOrderChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
            settxtMinimumAmountSalesOrderProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            form.setFieldsValue({
                minimumAmountSalesOrder: e.target.value,
            });
        } else {
            settxtMinimumAmountSalesOrderProperties({
                value: txtAmountProperties.value,
                validateStatus: 'error',
                errorMsg: 'Nomor HP hanya dapat di isi dengan angka',
            })
            form.setFieldsValue({
                minimumAmountSalesOrder: txtMinimumAmountSalesOrderProperties.value,
            });
        }
    }

    // button save
    const handleSave = () => {
        console.log("form"); console.log(form.getFieldsValue())
        form
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Simpan Data Konfigurasi Saldo Bonus ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Simpan Data:</Col></Row>
                        <br />
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Jumlah Bonus
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {form.getFieldValue('amount')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Minimal Order
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {form.getFieldValue('minimumAmountSalesOrder')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Simpan Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute  Data
                        const axiosConfigForBalanceBonusSave = {
                            url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/configuration-balance-bonus"
                            , method: "POST"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "amount": form.getFieldValue('amount'),
                                "minimum_amount_sales_order": form.getFieldValue('minimumAmountSalesOrder'),
                                "responsible_user_id": 1
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const balanceBonusResults = await axios.request(axiosConfigForbalanceBonusSave);
                            if (balanceBonusResults.data.hasOwnProperty('status_code') && balanceBonusResults.data.status_code != 200) {
                                throw balanceBonusResults.data
                            }
                            else {
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Di Simpan.</Col></Row>
                                    </div>
                                })

                            }
                        }
                        catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Simpan Data Balance Bonus.(Harap Lapor Kepada Admin)",
                                });
                            }
                            else {
                                if (error.response.status === 401) {
                                    Router.push("/auth/sign-in");
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
                title="Konfigurasi Saldo Bonus"
                bordered={false}
            // extra={<Button type="primary" >Tambah Balance Bonus</Button>}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    // initialValues={{
                    //     FullName: txtAmountProperties.value
                    //     , Balance BonusEffectiveStartDatetime: txtBalance BonusEffectiveStartDatetimeProperties.value
                    //     , Balance BonusEffectiveFinishDatetime: txtBalance BonusEffectiveFinishDatetimeProperties.value
                    // }}
                    autoComplete="off"
                    style={{ width: '50%' }}
                >
                    <Form.Item
                        label="Jumlah Saldo Bonus"
                        name="amount"
                        rules={[
                            { required: true, message: 'Mohon Isi Jumlah Saldo Bonus' }
                        ]}
                        validateStatus={txtAmountProperties.validateStatus}
                        help={txtAmountProperties.errorMsg}
                    >
                        <Input
                            defaultValue={form.getFieldValue('amount')}
                            onChange={handletxtAmountChange}
                            onBlur={handletxtAmountChange}
                            placeholder="Jumlah Saldo Bonus"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Minimal Order"
                        name="minimumAmountSalesOrder"
                        rules={[
                            { required: true, message: 'Mohon Isi Minimal Order' }
                        ]}
                        validateStatus={txtMinimumAmountSalesOrderProperties.validateStatus}
                        help={txtMinimumAmountSalesOrderProperties.errorMsg}
                    >
                        <Input
                            defaultValue={form.getFieldValue('minimumAmountSalesOrder')}
                            maxLength={15}
                            onChange={handletxtMinimumAmountSalesOrderChange}
                            onBlur={handletxtMinimumAmountSalesOrderChange}
                            placeholder="Minimal Order"
                        />
                    </Form.Item>
                    
                    <Button type="primary" style={{ marginLeft: '100px' }} onClick={handleSave}>
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

export default BalanceBonus;