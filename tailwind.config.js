// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
	darkMode: ['selector', '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				// overwrite all of `gray` with Tailwind’s official `stone` palette
				gray: colors.stone
			}
		}
	}
};
