const path = require('path');

module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.test.json',
        },
    },
    // do not touch - will use later
    // moduleNameMapper: {
    //     'test-utils': '<rootDir>/jest/test-utils.tsx',
    // },
    // snapshotSerializers: ['jest-emotion'],
    // setupFilesAfterEnv: ['<rootDir>/jest/setupFilesAfterEnv.ts'],
    collectCoverageFrom: [
        // exclude
        '!**/src/**/*.stories.tsx',
        '!**/src/assets/**',
        '!**/src/themes/**',
        '!**/src/**/constants*',
        '!**/src/**/styles.ts',
        '!**/src/**/*.d.ts',
        // include
        '**/src/**/*.tsx',
        '**/src/**/*.ts',
    ],
};
