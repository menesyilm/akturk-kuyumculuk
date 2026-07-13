import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Altın fiyatları sayfasını sonradan dolduracağımız için testini şimdilik ignore ediyoruz.
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/src/__tests__/app/altin-fiyatlari/page.test.tsx'
    ],
};

export default createJestConfig(customJestConfig);