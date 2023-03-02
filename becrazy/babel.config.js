// disable eslint in this file because its normal js not jsx or tsx
/* eslint-disable */
module.exports = function(api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"]
	};
};
