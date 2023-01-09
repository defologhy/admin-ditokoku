import {
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
import Link from 'next/link'
import Image from 'next/image'
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [getItem(<Link href="/">
  Beranda
</Link>, '1', <UserOutlined />),
getItem(<Link href="/resellers/page">
  Reseller
</Link>, '2', <UserOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [
  //   getItem('Tom', '3'),
  //   getItem('Bill', '4'),
  //   getItem('Alex', '5'),
  // ]),
  // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  // getItem('Files', '9', <FileOutlined />),
];
const Sidebar = () => {
  return (
    <>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >

        <Image src="/assets/images/ditokoku.png" alt="Image description" width="200" height="100" layout="responsive" style={{ background: '#ffffff' }} />
        <Menu
          theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}
        />
      </Sider>
    </>
  );
};
export default Sidebar;