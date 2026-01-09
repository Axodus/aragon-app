// Setup testing-library DOM element matchers (e.g. toBeInTheDocument)
// See full list of matchers here (https://github.com/testing-library/jest-dom?tab=readme-ov-file#custom-matchers)
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { TextDecoder, TextEncoder } from 'util';

// Ensure baseline env vars exist for tests.
// Some modules validate env at import time; tests should not fail just because backend URLs are not set.
process.env.ARAGON_BACKEND_URL ??= 'http://localhost:3000';
process.env.NEXT_PUBLIC_ARAGON_BACKEND_URL ??= process.env.ARAGON_BACKEND_URL;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { mockFetch, mockTranslations, testLogger, timeUtils } = require('./utils') as typeof import('./utils');

// Setup test logger
testLogger.setup();

// Mock global fetch
mockFetch();

// Setup test translations
mockTranslations.setup();

// Setup test times
timeUtils.setup();

// Globally setup TextEncoder/TextDecoder needed by viem
Object.assign(global, { TextDecoder, TextEncoder });

// Mock ResizeObserver functionality
global.ResizeObserver = jest
    .fn()
    .mockImplementation(() => ({ observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() }));

// Allow spying on library functions
jest.mock('react-hook-form', () => ({ __esModule: true, ...jest.requireActual<object>('react-hook-form') }));
jest.mock('viem', () => ({ __esModule: true, ...jest.requireActual<object>('viem') }));
jest.mock('next/font/local', () => ({
    __esModule: true,
    default: () => ({ className: '' }),
}));
