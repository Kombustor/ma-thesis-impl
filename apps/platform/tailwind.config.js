// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const daisyUiThemes = require('daisyui/src/colors/themes');

/* eslint-disable unicorn/prefer-module */
module.exports = {
  ...require('@mbg/config/tailwind.config'),
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
  content: [
    'src/**/*.{js,ts,jsx,tsx}',
    'node_modules/react-daisyui/dist/react-daisyui.cjs',
    'node_modules/daisyui/dist/**/*',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        highlights: {
          yellow: {
            base: '#F1C93C52',
            active: '#F1C93C',
          },
          gray: {
            base: '#EBEBEB',
            active: '#b0b0b0',
          },
        },
        feedback: {
          agree: '#56CC21',
          disagree: '#FF7474',
        },
      },
    },
  },
  daisyui: {
    logs: false,
    themes: [
      'light',
      'dark',
      {
        studylight: {
          ...daisyUiThemes['[data-theme=light]'],
          primary: '#8382b0',
          secondary: '#F1C93C', // highlights-yellow-active
          accent: '#b0b0b0', // highlights-gray-active
        },
      },
    ],
  },
};
