
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, Layout, Table, Space, Tooltip, Button, Input, Form, Modal, Row, Col } from 'antd';
const { Content } = Layout;
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import axios from "axios";
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const { confirm, success } = Modal;

Router.onRouteChangeStart = (url) => {
  console.log(url);
  NProgress.start();
}


Router.onRouteChangeComplete = () => { NProgress.done() };
Router.onRouteChangeError = () => { NProgress.done() };

const Admin = (props) => {
  
  const router = useRouter()
  if (process.browser){
      if (props.status_code === 401) {
          router.push('/')
      }
  }

const cookiesData = (props.cookies_data ? JSON.parse(props.cookies_data) : null);
console.log("cookiesData:",cookiesData)

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
      {
        "admin_full_name": ${(form.getFieldValue('admin_full_name_for_search') === null || form.getFieldValue('admin_full_name_for_search') === undefined ? null : `["${form.getFieldValue('admin_full_name_for_search')}"]`)},
        
        "admin_username": ${(form.getFieldValue('admin_username_for_search') === null || form.getFieldValue('admin_username_for_search') === undefined ? null : `["${form.getFieldValue('admin_username_for_search')}"]`)}

      }`;

      //Set Axios Configuration For Sign In to NextJS Server
      const axiosConfigForBaseData = {
        url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + '/admins'
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
          Modal.error({
              title: "Internal Server Error",
              content: "Error Saat Get Data Admin",
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
      Modal.error({
          title: error.error_title,
          content: error.error_message,
      });
    }
  }

  const getBaseDataConstruct = async () => {
    await getBase();
  }

  //Handle search 
  const handleSearch = async (selectedKeys, confirm, dataIndex) => {

    switch (dataIndex) {
      case 'admin_full_name':
        form.setFieldsValue({
          'admin_full_name_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;

      case 'admin_phone_number':
        form.setFieldsValue({
          'admin_phone_number_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
        })
        break;

      case 'admin_username':
        form.setFieldsValue({
          'admin_username_for_search': (selectedKeys[0] === undefined || selectedKeys[0] === null ? null : selectedKeys[0])
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
      case 'admin_full_name':
        form.setFieldsValue({
          'admin_full_name_for_search': null
        })
        break;

      case 'admin_phone_number':
        form.setFieldsValue({
          'admin_phone_number_for_search': null
        })
        break;

      case 'admin_username':
        form.setFieldsValue({
          'admin_username_for_search': null
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
      dataIndex: 'admin_full_name',
      key: 'admin_full_name',
      // sorter: (a, b) => a.admin_full_name.localeCompare(b.admin_full_name),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('admin_full_name')
    },
    {
      title: 'Username',
      width: '35%',
      dataIndex: 'admin_username',
      key: 'admin_username',
      // sorter: (a, b) => a.admin_username.localeCompare(b.admin_username),
      sortDirections: ['descend', 'ascend'],
      render(text, record) {
        return {
          props: {
            style: { textAlign: 'left' }
          },
          children: <div>{text}</div>
        };
      },
      ...getColumnSearchProps('admin_username')
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
  
  // button click
  const handleAddButtonClick = async () => {
    router.push('/admin/add')
  }

  const handleEditButtonClick = useCallback((data) => {
    return async (e) => {
      e.preventDefault() //we can all this directly here now!
      router.push({
        pathname: '/admin/edit',
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
                {data.admin_username}
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
                {data.admin_full_name}
              </Col>
            </Row>
            <br />
            <Row><Col span={24}>Apakah Anda Yakin Akan Menghapus Data Ini?</Col></Row>
          </div>,
          okText: 'Delete',
          cancelText: 'Cancel',
          onOk: async () => {
            //Execute Delete Data
            const axiosConfigForadmin = {
              url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/admins"
              , method: "DELETE"
              , timeout: 40000
              , responseType: "json"
              , responseEncoding: "utf8"
              , headers: { "Content-Type": "application/json" }
              , data: {
                admin_id: data.admin_id
                , responsible_user_id: 1
              }
            };

            //Execute Axios Configuration For JsonContentValidation
            try {
              const adminResults = await axios.request(axiosConfigForadmin);
              if (adminResults.data.hasOwnProperty('status_code') && adminResults.data.status_code != 200) {
                throw adminResults.data
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
                  , error_message: "Error Saat Hapus Data admin.(Harap Lapor Kepada Admin)"
                }
              }
              else {
                if (error.response.status === 401) {
                  Router.push("/auth/login");
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

  // view
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
            <Breadcrumb.Item>admin</Breadcrumb.Item>
            <Breadcrumb.Item>admin</Breadcrumb.Item>
          </Breadcrumb> */}

      {/* list admin */}
      <br />
      <Card
        title="Admin"
        bordered={false}
      // extra={<Button type="primary" >Tambah admin</Button>}
      >
        <Table
          style={{ top: 10 }}
          columns={columns}
          rowKey={record => record.admin_id}
          dataSource={dataTableBase.data}
          pagination={dataTableBase.pagination}
          loading={dataTableBase.loading}
          onChange={handleTableBase}
          showSorterTooltip={false}
          bordered
          // scroll={{ y: "250px", x: "1300px" }}
          size="small"
          title={() => {
            return (
              <Button size={"middle"} shape="round" type="primary" icon={<PlusOutlined />}
                onClick={handleAddButtonClick}
              >
                Tambah Data
              </Button>
            )
          }}
        />

      </Card>


    </Content>
  );
};

// Get Server Side Props
export async function getServerSideProps({ req, res }) {
  console.log("getcookie balance bonus config page");
  console.log(getCookie('admin_cookies', { req, res }))
  if (!getCookie('admin_cookies', { req, res }) || getCookie('admin_cookies', { req, res }) === null || getCookie('admin_cookies', { req, res })==='') {
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

export default Admin;