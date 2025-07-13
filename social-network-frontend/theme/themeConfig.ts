import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#ff4500',
    borderRadius: 4,
    colorBgContainer: '#ffffff',
    colorText: '#1c1c1c',
    colorLink: '#ff4500',
    colorLinkHover: '#e03e00',
    colorLinkActive: '#c63700',
  },
  components: {
    Button: {
      colorPrimary: '#ff4500',
      colorPrimaryHover: '#e03e00',
      colorPrimaryActive: '#c63700',
      algorithm: true,
    },
    Card: {
      padding: 16,
      borderRadius: 8,
      headerBg: '#f8f9fa',
    },
    Input: {
      borderRadius: 4,
    },
    Menu: {
      itemHoverBg: '#fff8f6',
      itemSelectedBg: '#fff8f6',
      itemSelectedColor: '#ff4500',
    },
  },
};

export default theme;