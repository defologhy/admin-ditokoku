import {
  UserOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
const { Footer } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const FooterPage = () => {
  return (
    <>
    <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ditokoku.id ©2023
        </Footer>
    </>
  );
};
export default FooterPage;