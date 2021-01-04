module.exports = {
  extends: ['gristow'],
  rules: {
    'no-console': 0,
    'react/prop-types': 0,
    'no-use-before-define': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unescaped-entities': 0,
    "jsx-a11y/label-has-associated-control": [ "error", {
      "required": {
        "some": [ "nesting", "id"  ]
      }
    }],
    "jsx-a11y/label-has-for": [ "error", {
      "required": {
        "some": [ "nesting", "id"  ]
      }
    }],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
      },
    ],
  },
};
