module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    "node": true,
    "jest": true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    "no-unused-vars": [
      "error", { 
        "vars": "all",
        "args": "none",
        "ignoreRestSiblings": true,
        "varsIgnorePattern": "(res)|(req)|(resolve)|(reject)|(.*Result)|(.*logger)"
      }]
      
  }
}
  