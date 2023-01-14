
import React, { useEffect, useState, useRef } from 'react';
import NProgress from 'nprogress';
import axios from "axios";
import Router, { useRouter } from 'next/router';
import { Card, Layout, Upload, Button, Input, Form, Select, Row, Col, Modal, Image } from 'antd';
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

const Banner = (props) => {

    const router = useRouter()
    if (process.browser){
        if (props.status_code === 401) {
            router.push('/auth/login')
        }
    }

    const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);

    const [form] = Form.useForm();
    // usestate
    const [txtDescriptionProperties, settxtDescriptionProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [inputFileBannerImage, setInputFileBannerImage] = useState(null)
    const [bannerId, setBannerId] = useState(null)
    const [imageFilename, setImageFilename] = useState(null)


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await getDataBanners();
    }

    const getDataBanners = async () => {
        try {

            //Set Axios Configuration For Sign In to NextJS Server
            const axiosConfigForGetData = {
                url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + '/banners'
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
                
                setBannerId((getData.data.length!=0 ? getData.data[0].banner_id : null))
                setImageFilename((getData.data.length!=0 ? getData.data[0].banner_filename : null))

                // form.setFieldsValue({
                //     bannerId : (getData.data.length!=0 ? getData.data[0].banner_id : '')
                //     , imageConstruct: (getData.data.length!=0 ? getData.data[0].banner_filename : '')
                //     , descriptionConstruct: (getData.data.length!=0 ? getData.data[0].banner_description : '')/
                // });
            } catch (error) {
                console.log(error)
                if (error.response == null) {
                    Modal.error({
                        title: "Internal Server Error",
                        content: "Error saat Get Data Banner",
                    });
                } else {
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
    // const handletxtAmountChange = (e) => {
    //     //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
    //     if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
    //         settxtAmountProperties({
    //             value: e.target.value,
    //             validateStatus: 'success',
    //             errorMsg: null,
    //         })
    //         form.setFieldsValue({
    //             amount: e.target.value,
    //         });
    //     } else {
    //         settxtMinimumAmountSalesOrderProperties({
    //             value: txtAmountProperties.value,
    //             validateStatus: 'error',
    //             errorMsg: 'Nomor HP hanya dapat di isi dengan angka',
    //         })
    //         form.setFieldsValue({
    //             minimumAmountSalesOrder: txtMinimumAmountSalesOrderProperties.value,
    //         });
    //     }
    // }

    // const handletxtMinimumAmountSalesOrderChange = (e) => {
    //     //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
    //     if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
    //         settxtMinimumAmountSalesOrderProperties({
    //             value: e.target.value,
    //             validateStatus: 'success',
    //             errorMsg: null,
    //         })
    //         form.setFieldsValue({
    //             minimumAmountSalesOrder: e.target.value,
    //         });
    //     } else {
    //         settxtMinimumAmountSalesOrderProperties({
    //             value: txtAmountProperties.value,
    //             validateStatus: 'error',
    //             errorMsg: 'Nomor HP hanya dapat di isi dengan angka',
    //         })
    //         form.setFieldsValue({
    //             minimumAmountSalesOrder: txtMinimumAmountSalesOrderProperties.value,
    //         });
    //     }
    // }

    // button save
    const handleSave = () => {
        console.log("form"); console.log(form.getFieldsValue())
        form
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Simpan Data Banner ?</span>,
                    content: <div>
                        <Row><Col span={24}>Kamu Akan Simpan Data:</Col></Row>
                        <br />
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Nama File
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {(inputFileBannerImage ? inputFileBannerImage[0].name : '')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Merubah Data Banner?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {

                        const formData = new FormData();
                        const fileFormat = inputFileBannerImage[0].name.split('.');
                        const filenameFormat =  'banner-' + bannerId + new Date().getTime() + '.' + fileFormat[fileFormat.length - 1];
                        formData.append("file", inputFileBannerImage[0]);
                        formData.append("file_name", filenameFormat);
                        formData.append("banner_id", bannerId);
                        try {
                            const res = await axios.post(
                                process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image",
                                formData
                        );
                            success({
                                title: <span>Sukses</span>,
                                content: <div>
                                    <Row><Col span={24}>Data Banner Berhasil Di Rubah.</Col></Row>
                                </div>
                            })
                            setImageFilename(filenameFormat)
                            console.log(res);
                        } catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Rubah Data Banner.(Harap Lapor Kepada Admin)",
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
                        
                        // //Execute  Data
                        // const axiosConfigForBannerSave = {
                        //     url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners"
                        //     , method: "PATCH"
                        //     , timeout: 40000
                        //     , responseType: "json"
                        //     , responseEncoding: "utf8"
                        //     , headers: { "Content-Type": "application/json" }
                        //     , data: {
                        //         "banner_id": 1,
                        //         "banner_description": 2,
                        //         "responsible_user_id": 1
                        //     }
                        // };

                        // //Execute Axios Configuration For JsonContentValidation
                        // try {
                        //     const bannerResults = await axios.request(axiosConfigForBannerSave);
                        //     if (bannerResults.data.hasOwnProperty('status_code') && bannerResults.data.status_code != 200) {
                        //         throw bannerResults.data
                        //     }
                        //     else {
                        //         success({
                        //             title: <span>Sukses</span>,
                        //             content: <div>
                        //                 <Row><Col span={24}>Data Banner Berhasil Di Rubah.</Col></Row>
                        //             </div>
                        //         })

                        //     }
                        // }
                        // catch (error) {
                        //     console.log(error)
                        //     if (error.response == null) {
                        //         Modal.error({
                        //             title: "Internal Server Error",
                        //             content: "Error Saat Simpan Data Banner.(Harap Lapor Kepada Admin)",
                        //         });
                        //     }
                        //     else {
                        //         if (error.response.status === 401) {
                        //             Router.push("/auth/login");
                        //             return {}
                        //         }
                        //         Modal.error({
                        //             title: error.response.data.error_title,
                        //             content: error.response.data.error_message,
                        //         });
                        //     }
                        // }

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
                title="Banner Foto"
                bordered={false}
            >
                {bannerId
                ?
                <Image
                    width={'30%'}
                    src={process.env.REACT_APP_DITOKOKU_API_BASE_URL +'/assets/images/banner/'+imageFilename}
                    preview={false}
                    crossOrigin='anonymous'
                />
                :
                <Image
                    width={'30%'}
                    src={process.env.REACT_APP_DITOKOKU_API_BASE_URL +'/assets/images/banner/default.png'}
                    preview={false}
                    crossOrigin='anonymous'
                />
                }
                
            <br /><br />

                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    autoComplete="off"
                    style={{ width: '50%' }}
                >
                    
                    <Form.Item
                        label="Rubah Banner"
                        name="formItemBannerImage"
                        rules={[
                            { required: true, message: 'Mohon Isi Foto' }
                        ]}
                    >
                        <Input
                            type={'file'}
                            placeholder="Rubah Banner"
                            onChange={(e) => setInputFileBannerImage(e.target.files)}
                            onClick={(e) => {
                                setInputFileBannerImage(null)
                                e.target.value = null
                            }}
                            />
                    </Form.Item>
                    
                    <Button type="primary" style={{ marginLeft: '100px' }} onClick={handleSave}>
                        Rubah
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

export default Banner;