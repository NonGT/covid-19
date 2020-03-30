const defaultMapTheme = '/mapTheme.json';
const defaultMapDataSource = 'https://vector.hereapi.com/v2/vectortiles/base/mc';
const defaultStyleSet = 'tilezen';
const defaultAuthParamName = 'apikey';

export const map = {
  authKey: process.env.REACT_APP_MAP_AUTH_KEY,
  authParamName: process.env.REACT_APP_MAP_AUTH_FIELD_NAME || defaultAuthParamName,
  defaultTheme: process.env.REACT_APP_MAP_THEME || defaultMapTheme,
  defaultStyleSet: process.env.REACT_APP_MAP_STYLE_SET || defaultStyleSet,
  dataSourceUrl: process.env.REACT_APP_MAP_DATA_SOURCE_URL || defaultMapDataSource,
};
