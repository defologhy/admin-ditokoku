import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  FileImageOutlined,
  ProfileOutlined,
  MoneyCollectOutlined
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
const items = [
  getItem(<Link href="/"> Beranda </Link>, '1', <HomeOutlined />),
  getItem(<Link href="/banners"> Banner </Link>, '2', <FileImageOutlined />),
  getItem(<Link href="/admin"> Admin </Link>, '3', <UserOutlined />),
  getItem(<Link href="/resellers"> Reseller </Link>, '4', <UserOutlined />),
  getItem(<Link href="/resellers/topup-balances-regular"> Top Up Saldo </Link>, '5',  <MoneyCollectOutlined />),
  getItem(<Link href="/category-products"> Kategori Produk </Link>, '6',  <ProfileOutlined />),
  getItem('Konfigurasi', 'sub1', <SettingOutlined />, [
    getItem(<Link href="/configurations/balance-bonus"> Saldo Bonus </Link>, '7', ''),
    getItem(<Link href="/configurations/payment-account-destinations"> Akun Bank Tujuan </Link>, '8', '')
  ]),
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