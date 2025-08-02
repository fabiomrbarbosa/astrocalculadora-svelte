// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
	daisyui: {
		themes: ['light', 'dark'],
		darkTheme: 'dark'
	},
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' }
			},
			colors: {
				// overwrite all of `gray` with Tailwind’s official `stone` palette
				gray: colors.stone
			}
		}
	}
};
