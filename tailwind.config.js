// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
	theme: {
		extend: {
			colors: {
				// overwrite all of `gray` with Tailwind’s official `stone` palette
				gray: colors.stone
			}
		}
	}
};
