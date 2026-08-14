/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 中性色（莫兰迪雾灰）
        bg: '#F2F3F5',
        surface: '#FFFFFF',
        'surface-2': '#EDEFF3',
        border: '#E4E7EC',
        'border-strong': '#D5DAE1',
        ink: '#24282E',
        'ink-2': '#5F6672',
        'ink-3': '#979EA8',
        // 主色（雾灰蓝）
        primary: '#5A7594',
        'primary-hover': '#4B6481',
        'primary-active': '#3F5670',
        'primary-soft': '#EAEFF5',
        'primary-soft-strong': '#D6E0EB',
        'primary-on-soft': '#47607D',
        // 功能色（莫兰迪化）
        success: '#7C9A82',
        'success-soft': '#EDF3EE',
        'success-on-soft': '#54705A',
        warning: '#C2A878',
        'warning-soft': '#F7F2E7',
        'warning-on-soft': '#8A7440',
        danger: '#C08A82',
        'danger-soft': '#F7EDEB',
        'danger-on-soft': '#8F5852',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans SC"', '-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 32, 0.04), 0 8px 24px rgba(20, 24, 32, 0.06)',
      },
    },
  },
  plugins: [],
}
