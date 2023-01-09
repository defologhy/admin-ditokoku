
import React, { useEffect, useState, useRef } from 'react';
import NProgress from 'nprogress';
import axios from "axios";
import Router, { useRouter } from 'next/router';
import { Card, Layout, Upload, Button, Input, Form, Select, Row, Col, Modal } from 'antd';
const { Content } = Layout;
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

Router.onRouteChangeStart = (url) => {
    console.log(url);
    NProgress.start();
}
Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };
const { confirm, success } = Modal;

const ResellerEdit = () => {

    // router
    const router = useRouter()
    const [formEdit] = Form.useForm();
    // usestate
    const [txtFullNameProperties, setTxtFullNameProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [txtPhoneNumberProperties, setTxtPhoneNumberProperties] = useState({
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
    const [selectGenderProperties, setSelectGenderProperties] = useState({
        value: null,
        validateStatus: 'success',
        errorMsg: null,
    });
    const [selectedGenderLabel, setSelectedGenderLabel] = useState(null);
    const [genderData, setGenderData] = useState([]);
    const [isShowUploadList, setIsShowUploadList] = useState(true);
    const [uploadImageReseller, setUploadImageReseller] = useState(null);
    const [resellerImageFile, setResellerImageFile] = useState(null)

    useEffect(() => {
        formEdit.setFieldsValue({
            resellerFullName: (router.query.reseller_full_name ? router.query.reseller_full_name : null)
            , resellerPhoneNumber: router.query.reseller_phone_number
            , resellerUsername: router.query.reseller_username
            , resellerGender: (router.query.gender_id ? router.query.gender_id : null)
        });
        setSelectedGenderLabel(router.query.gender_name)
        getGender();
    }, []);

    const getGender = async () => {
        await getGenderData();
    }

    const getGenderData = async () => {
        try {

            //Set Axios Configuration For Sign In to NextJS Server
            const axiosConfigForGenderData = {
                url: process.env.REACT_APP_RESELLER_API_BASE_URL + process.env.REACT_APP_RESELLER_API_VERSION_URL + '/genders'
                , method: "GET"
                , timeout: 40000
                , responseType: "json"
                , responseEncoding: "utf8"
                , headers: { "Content-Type": "application/json" }
                , params: {
                    all_data: true
                }
            };

            //Execute Axios Configuration For JsonContentValidation
            try {
                const GenderDataResults = await axios.request(axiosConfigForGenderData);
                const GenderData = GenderDataResults.data;

                setGenderData(GenderData.data)
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
    const handleTxtFullNameChange = (e) => {
        setTxtFullNameProperties({
            value: e.target.value,
            validateStatus: 'success',
            errorMsg: null,
        })
        formEdit.setFieldsValue({
            resellerFullName: e.target.value,
        });
    }

    const handleTxtPhoneNumberChange = (e) => {
        //validation entry an hanya bisa AlphaNumerik, Spasi [ ] dan tanda titik [.]
        if (/^(?![\s-])[0-9_\s-.]*$/i.test(e.target.value) === true) {
            setTxtPhoneNumberProperties({
                value: e.target.value,
                validateStatus: 'success',
                errorMsg: null,
            })
            formEdit.setFieldsValue({
                resellerPhoneNumber: e.target.value,
            });
        } else {
            setTxtPhoneNumberProperties({
                value: txtFullNameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Nomor HP hanya dapat di isi dengan angka',
            })
            formEdit.setFieldsValue({
                resellerPhoneNumber: txtPhoneNumberProperties.value,
            });
        }
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
                resellerUsername: e.target.value,
            });
        } else {
            setTxtUsernameProperties({
                value: txtUsernameProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Username Tidak Valid',
            })
            formEdit.setFieldsValue({
                resellerUsername: txtUsernameProperties.value,
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
                resellerPassword: e.target.value,
            });
        } else {
            setTxtPasswordProperties({
                value: txtPasswordProperties.value,
                validateStatus: 'error',
                errorMsg: 'Format Password Tidak Valid',
            })
            formEdit.setFieldsValue({
                resellerPassword: txtPasswordProperties.value,
            });
        }
    }

    const handleSelectGenderChange = (selected) => {
        setSelectGenderProperties({
            value: selected.value,
            validateStatus: 'success',
            errorMsg: null,
        })
        formEdit.setFieldsValue({
            resellerGender: selected.value,
        });
        setSelectedGenderLabel(selected.label)
    }

    const handleChangeFoto = (fileProperties) => {
        switch (fileProperties.file.type) {
            case "image/jpeg":
                if (fileProperties.fileList.length > 0) {
                    setUploadImageReseller(fileProperties);
                    setIsShowUploadList(true);
                }
                else {
                    formEdit.resetFields(['uploadImageReseller'])
                    setIsShowUploadList(false);
                }
                break;

            case "image/png":
                if (fileProperties.fileList.length > 0) {
                    setUploadImageReseller(fileProperties);
                    setIsShowUploadList(true);
                }
                else {
                    formEdit.resetFields(['uploadImageReseller'])
                    setIsShowUploadList(false);
                }
                break;

            case "image/jpg":
                if (fileProperties.fileList.length > 0) {
                    setUploadImageReseller(fileProperties);
                    setIsShowUploadList(true);
                }
                else {
                    formEdit.resetFields(['uploadImageReseller'])
                    setIsShowUploadList(false);
                }
                break;

            default:
                formEdit.resetFields(['uploadImageReseller'])
                setIsShowUploadList(false);
                break;
        }
    };

    const handleRemoveFileFoto = () => {
        formEdit.resetFields(['uploadImageReseller'])
    };

    const cleanFormEdit = () => {
        formEdit.setFieldsValue({
            resellerFullName: null
            , resellerPhoneNumber: null
            , resellerUsername: null
            , resellerPassword: null
            , resellerGender: null
        });
        formEdit.resetFields(['uploadImageReseller'])
    }

    // button save
    const handleEdit = () => {
        console.log("formEdit"); console.log(formEdit.getFieldsValue())
        formEdit
            .validateFields()
            .then((values) => {
                confirm({
                    icon: <QuestionCircleOutlined />,
                    title: <span>Rubah Data Reseller ?</span>,
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
                                {formEdit.getFieldValue('resellerUsername')}
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
                                {formEdit.getFieldValue('resellerFullName')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                No HP
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {formEdit.getFieldValue('resellerPhoneNumber')}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Gender
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {selectedGenderLabel}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={8}>
                                Image
                            </Col>
                            <Col span={1}>
                                :
                            </Col>
                            <Col span={12}>
                                {(resellerImageFile ? resellerImageFile[0].name : '')}
                            </Col>
                        </Row>
                        <br />
                        <Row><Col span={24}>Apakah Anda Yakin Akan Merubah Data Ini?</Col></Row>
                    </div>,
                    okText: 'Save',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        //Execute Edit Data
                        const axiosConfigForResellerEdit = {
                            url: process.env.REACT_APP_RESELLER_API_BASE_URL + process.env.REACT_APP_RESELLER_API_VERSION_URL + "/resellers"
                            , method: "PATCH"
                            , timeout: 40000
                            , responseType: "json"
                            , responseEncoding: "utf8"
                            , headers: { "Content-Type": "application/json" }
                            , data: {
                                "reseller_id": router.query.reseller_id,
                                "reseller_username": formEdit.getFieldValue('resellerUsername'),
                                "reseller_phone_number": formEdit.getFieldValue('resellerPhoneNumber'),
                                "reseller_password": (formEdit.getFieldValue('resellerPassword') ? formEdit.getFieldValue('resellerPassword') : null),
                                "responsible_user_id": 1,
                                "reseller_full_name": formEdit.getFieldValue('resellerFullName'),
                                "reseller_gender_id": formEdit.getFieldValue('resellerGender'),
                                "reseller_image": null
                            }
                        };

                        //Execute Axios Configuration For JsonContentValidation
                        try {
                            const ResellerResults = await axios.request(axiosConfigForResellerEdit);
                            if (ResellerResults.data.hasOwnProperty('status_code') && ResellerResults.data.status_code != 200) {
                                throw ResellerResults.data
                            }
                            else {
                                if(resellerImageFile){
                                    const formData = new FormData();
                                    formData.append("file", resellerImageFile[0]);
                                    formData.append("fileName", resellerImageFile[0].name);
                                    formData.append("reseller_id", router.query.reseller_id);
                                    try {
                                        const res = await axios.post(
                                            process.env.REACT_APP_RESELLER_API_BASE_URL + process.env.REACT_APP_RESELLER_API_VERSION_URL + "/resellers/upload-profile",
                                            formData
                                    );
                                        console.log(res);
                                    } catch (ex) {
                                        console.log(ex);
                                    }
                                }
                                cleanFormEdit();
                                success({
                                    title: <span>Sukses</span>,
                                    content: <div>
                                        <Row><Col span={24}>Data Berhasil Dirubah.</Col></Row>
                                    </div>,
                                    onOk: async () => {
                                        router.push('page')
                                    }
                                })

                            }
                        }
                        catch (error) {
                            console.log(error)
                            if (error.response == null) {
                                Modal.error({
                                    title: "Internal Server Error",
                                    content: "Error Saat Merubah Data Reseller.(Harap Lapor Kepada Admin)",
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
                title="Rubah Data Reseller"
                bordered={false}
            // extra={<Button type="primary" >Tambah Reseller</Button>}
            >
                <Form
                    name="basic"
                    form={formEdit}
                    labelCol={{ span: 6 }}
                    // initialValues={{
                    //     FullName: txtFullNameProperties.value
                    //     , ResellerEffectiveStartDatetime: txtResellerEffectiveStartDatetimeProperties.value
                    //     , ResellerEffectiveFinishDatetime: txtResellerEffectiveFinishDatetimeProperties.value
                    // }}
                    autoComplete="off"
                    style={{ width: '50%' }}
                >
                    <Form.Item
                        label="Nama Lengkap"
                        name="resellerFullName"
                    >
                        <Input
                            defaultValue={router.query.reseller_full_name}
                            onChange={handleTxtFullNameChange}
                            onBlur={handleTxtFullNameChange}
                            placeholder="Nama Lengkap"
                        />
                    </Form.Item>

                    <Form.Item
                        label="No HP"
                        name="resellerPhoneNumber"
                        rules={[
                            { required: true, message: 'Mohon Isi Nomor Hp' }
                        ]}
                        validateStatus={txtPhoneNumberProperties.validateStatus}
                        help={txtPhoneNumberProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.reseller_phone_number}
                            maxLength={15}
                            onChange={handleTxtPhoneNumberChange}
                            onBlur={handleTxtPhoneNumberChange}
                            placeholder="No HP"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="resellerUsername"
                        rules={[
                            { required: true, message: 'Mohon Isi Username' }
                        ]}
                        validateStatus={txtUsernameProperties.validateStatus}
                        help={txtUsernameProperties.errorMsg}
                    >
                        <Input
                            defaultValue={router.query.reseller_username}
                            onChange={handleTxtUsernameChange}
                            onBlur={handleTxtUsernameChange}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="resellerGender"
                    >
                        <Select
                            defaultValue={{
                                value: router.query.gender_id,
                                label: router.query.gender_name,
                            }}
                            showSearch
                            placeholder="Gender"
                            optionFilterProp="children"
                            onChange={(text, index) => {
                                handleSelectGenderChange(index)
                            }}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                genderData.map(data => ({ value: data.gender_id, label: data.gender_name }))
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="resellerPassword"
                    >
                        <Input.Password
                            onChange={handleTxtPasswordChange}
                            onBlur={handleTxtPasswordChange}
                            placeholder="Password (Kosongkan Bila Tidak Ingin Rubah)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Foto"
                        name="uploadImageReseller"
                    >
                        <Input
                            type={'file'}
                            placeholder="Rubah Foto"
                            onChange={(e) => setResellerImageFile(e.target.files)}
                            onClick={(e) => {
                                setResellerImageFile(null)
                                e.target.value = null
                            }}
                        />
                        {/* <Upload
                            showUploadList={isShowUploadList}
                            name="uploadImageReseller"
                            className="resellerImage"
                            type="file"
                            accept="jpg, jpeg, png"
                            maxCount={1}
                            listType="picture"
                            onChange={handleChangeFoto}
                            onRemove={handleRemoveFileFoto}
                            style={{ width: '100%' }}
                        >
                            <Button icon={<UploadOutlined />} style={{ width: '200px' }}>Upload</Button>
                        </Upload> */}
                    </Form.Item>
                    <Button type="primary" style={{ marginLeft: '100px' }} onClick={handleEdit}>
                        Submit
                    </Button>
                </Form>
            </Card>
        </Content >
    );
};
export default ResellerEdit;