
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Layout, Table, Space, Tooltip, Button, Input, Form, Modal, Row, Col } from 'antd';
const { Content } = Layout;
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import axios from "axios";
const { confirm, success } = Modal;

Router.onRouteChangeStart = (url) => {
  console.log(url);
  NProgress.start();
}

Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };

const ResellerPage = () => {

  // usestate
  const [dataTableBase, setDataTableBase] = useState({
    data: []
    , pagination: {
      current: 1
      , pageSize: 10
      , total: 0
      , showQuickJumper: true
    }
    , loading: false
  })

  // useref
  const [form] = Form.useForm();
  const searchBase = useRef(null);
  useEffect(() => {
    getBaseDataConstruct();
  }, []);

  const getBase = async (pagination) => {
    try {
      setDataTableBase(
        {
          ...dataTableBase
          , loading: true
        }
      )

      // setting filter array
      const searchArrayValues = `
      {"reseller_full_name": ${(form.getFieldValue('reseller_full_name_for_search') === null || form.getFieldValue('reseller_full_name_for_search') === undefined ? null : `["${form.getFieldValue('reseller_full_name_for_search')}"]`)},
      "reseller_phone_number": ${(form.getFieldValue('reseller_phone_number_for_search') === null || form.getFieldValue('reseller_phone_number_for_search') === undefined ? null : `["${form.getFieldValue('reseller_phone_number_for_search')}"]`)},
      "reseller_username": ${(form.getFieldValue('reseller_username_for_search') === null || form.getFieldValue('reseller_username_for_search') === undefined ? null : `["${form.getFieldValue('reseller_username_for_search')}"]`)},
      "gender_name": ${(form.getFieldValue('gender_name_for_search') === null || form.getFieldValue('gender_name_for_search') === undefined ? null : `["${form.getFieldValue('gender_name_for_search')}"]`)}
      }`;

      //Set Axios Configuration For Sign In to NextJS Server
      const axiosConfigForBaseData = {
        url: process.env.REACT_APP_RESELLER_API_BASE_URL + process.env.REACT_APP_RESELLER_API_VERSION_URL + '/resellers'
        , method: "GET"
        , timeout: 40000
        , responseType: "json"
        , responseEncoding: "utf8"
        , headers: { "Content-Type": "application/json" }
        , params: {
          current_page: (pagination == null ? dataTableBase.pagination.current : pagination.current)
          , page_size: (pagination == null ? dataTableBase.pagination.pageSize : pagination.pageSize)
          , filter: searchArrayValues
          // , sort_by: sortDataAssignSku.map((item)=>{
          //     return item.key + ' ' + item.sort
          // }).toString()
        }
      };

      //Execute Axios Configuration For JsonContentValidation
      try {
        const baseDataResults = await axios.request(axiosConfigForBaseData);
        const baseData = baseDataResults.data;
        setDataTableBase(
          {
            data: baseData.data
            , pagination: {
              current: baseData.pagination.current_page
              , pageSize: baseData.pagination.page_size
              , total: baseData.pagination.total_records
              , showQuickJumper: true
            }
            , loading: false
          }
        )
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

  const getBaseDataConstruct = async () => {
    await getBase();
  }

  //Handle search 
  const handleSearch = async (selectedKeys, confirm, dataIndex) => {

    switch (dataIndex) {
      case 'reseller_full_name':
        form.setFieldsValue({
          'reseller_full_name_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;

      case 'reseller_phone_number':
        form.setFieldsValue({
          'reseller_phone_number_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;

      case 'reseller_username':
        form.setFieldsValue({
          'reseller_username_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;

      case 'gender_name':
        form.setFieldsValue({
          'gender_name_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;
    }

    await getBaseDataConstruct();
    confirm();

  };

  //Handle reset 
  const handleReset = async (clearFilters, confirm, dataIndex) => {

    switch (dataIndex) {
      case 'reseller_full_name':
        form.setFieldsValue({
          'reseller_full_name_for_search': null
        })
        break;

      case 'reseller_phone_number':
        form.setFieldsValue({
          'reseller_phone_number_for_search': null
        })
        break;

      case 'reseller_username':
        form.setFieldsValue({
          'reseller_username_for_search': null
        })
        break;

      case 'gender_name':
        form.setFieldsValue({
          'gender_name_for_search': null
        })
        break;
    }

    clearFilters();

    await getBaseDataConstruct();
    confirm();

  };

  //Search for UI
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Form form={form}>
          <Form.Item name={dataIndex + "_for_search"} style={{
            marginBottom: 8,
            display: 'block',
          }}>
            <Input
              ref={searchBase}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}

            />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              id='handleResetSearch'
              onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
          </Space>
        </Form>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          //   color: filtered ? 'black' : 'white',
          color: 'white',
          fontSize: '15px'
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchBase.current?.select(), 100);
      }
    },
    render: (text) =>
      text
  });

  // column table base
  const columns = [
    {
      title: 'Nama Lengkap',
      width: '35%',
      dataIndex: 'reseller_full_name',
      key: 'reseller_full_name',
      // sorter: (a, b) => a.reseller_full_name.localeCompare(b.reseller_full_name),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('reseller_full_name')
    },
    {
      title: 'Nomor HP',
      width: '35%',
      dataIndex: 'reseller_phone_number',
      key: 'reseller_phone_number',
      // sorter: (a, b) => a.reseller_phone_number.localeCompare(b.reseller_phone_number),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('reseller_phone_number')
    },
    {
      title: 'Username',
      width: '35%',
      dataIndex: 'reseller_username',
      key: 'reseller_username',
      // sorter: (a, b) => a.reseller_username.localeCompare(b.reseller_username),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('reseller_username')
    },
    {
      title: 'Gender',
      width: '35%',
      dataIndex: 'gender_name',
      key: 'gender_name',
      // sorter: (a, b) => a.gender_name.localeCompare(b.gender_name),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('gender_name')
    },
    {
      title: 'Opsi',
      key: 'opsi',
      align: 'center',
      render: (text, record) => (
        <Space direction="horizontal" size="small">
          <Tooltip title="Edit">
            <Button style={{ backgroundColor: '#f2c629', color: 'white' }} shape="circle" icon={<EditOutlined />}
              onClick={handleEditButtonClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button style={{ backgroundColor: '#F53910', color: 'white' }} type="danger" shape="circle" icon={<DeleteOutlined />}
              onClick={handleDeleteButtonClick(record)}
            />
          </Tooltip>
        </Space>
      ),
      width: '15%',
    },
  ];



  const handleTableBase = async (pagination, filters, sorter) => {
    setDataTableBase(
      {
        ...dataTableBase
        , loading: true
      }
    )

    await getBase(pagination);
  };
  const router = useRouter()
  // button click
  const handleAddButtonClick = async () => {
    router.push('add')
  }

  const handleEditButtonClick = useCallback((data) => {
    return async (e) => {
      e.preventDefault() //we can all this directly here now!
      router.push({
        pathname: 'edit',
        query: data
      }, 'edit')
    }
  }, [])

  const handleDeleteButtonClick = useCallback((data) => {
    return async (e) => {
      try {
        e.preventDefault() //we can all this directly here now!
        confirm({
          icon: <QuestionCircleOutlined />,
          title: <span>Hapus Data ?</span>,
          content: <div>
            <Row><Col span={24}>Kamu Akan <b>Hapus Data</b> Ini:</Col></Row>
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
                {data.reseller_username}
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
                {data.reseller_full_name}
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
                {data.reseller_phone_number}
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
                {data.gender_name}
              </Col>
            </Row>
            <br />
            <Row><Col span={24}>Apakah Anda Yakin Akan Menghapus Data Ini?</Col></Row>
          </div>,
          okText: 'Delete',
          cancelText: 'Cancel',
          onOk: async () => {
            //Execute Delete Data
            const axiosConfigForReseller = {
              url: process.env.REACT_APP_RESELLER_API_BASE_URL + process.env.REACT_APP_RESELLER_API_VERSION_URL + "/resellers"
              , method: "DELETE"
              , timeout: 40000
              , responseType: "json"
              , responseEncoding: "utf8"
              , headers: { "Content-Type": "application/json" }
              , data: {
                reseller_id: data.reseller_id
                , responsible_user_id: 1
              }
            };

            //Execute Axios Configuration For JsonContentValidation
            try {
              const ResellerResults = await axios.request(axiosConfigForReseller);
              if (ResellerResults.data.hasOwnProperty('status_code') && ResellerResults.data.status_code != 200) {
                throw ResellerResults.data
              }
              else {
                await getBase()
                success({
                  title: <span>Sukses</span>,
                  content: <div>
                    <Row><Col span={24}>Data Telah Dihapus.</Col></Row>
                  </div>
                });

              }
            }
            catch (error) {
              console.log(error)
              if (error.response == null) {
                throw {
                  error_title: "Internal Server Error"
                  , error_message: "Error Saat Hapus Data Reseller.(Harap Lapor Kepada Admin)"
                }
              }
              else {
                if (error.response.status === 401) {
                  Router.push("/auth/sign-in");
                  return {}
                }
                throw error.response.data;
              }
            }
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
      catch (error) {
        console.log("error:"); console.log(error)
        // setDataTableBase(
        //   {
        //     ...dataTableBase
        //     , loading: false
        //   }
        // )
        Modal.error({
          title: "Internal Server Error",
          content: error,
        });
      }
    }
  }, [])


  return (
    <Content
      style={{
        margin: '0 16px',
      }}
    >
      {/* breadcumb */}
      {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Reseller</Breadcrumb.Item>
            <Breadcrumb.Item>Reseller</Breadcrumb.Item>
          </Breadcrumb> */}

      {/* list reseller */}
      <br />
      <Card
        title="Reseller"
        bordered={false}
      // extra={<Button type="primary" >Tambah Reseller</Button>}
      >
        <Table
          style={{ top: 10 }}
          columns={columns}
          rowKey={record => record.reseller_id}
          dataSource={dataTableBase.data}
          pagination={dataTableBase.pagination}
          loading={dataTableBase.loading}
          onChange={handleTableBase}
          showSorterTooltip={false}
          bordered
          // scroll={{ y: "250px", x: "1300px" }}
          size="small"
        // title={() => {
        //   return (
        //     <Button size={"middle"} shape="round" type="primary" icon={<PlusOutlined />}
        //       onClick={handleAddButtonClick}
        //     >
        //       Tambah Data
        //     </Button>
        //   )
        // }}
        />

      </Card>


    </Content>
  );
};
export default ResellerPage;