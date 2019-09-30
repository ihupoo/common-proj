module.exports = {
    "presets": [
        [
            "@babel/preset-env"
        ],
    ],
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-decorators",
        "@babel/plugin-proposal-class-properties",
        ['@babel/plugin-transform-runtime',
            {
                'corejs': 3,
            },
        ],
    ]
}
