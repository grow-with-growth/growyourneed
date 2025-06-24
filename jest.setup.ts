import '@testing-library/jest-dom';
import fetch from 'cross-fetch';

// Mock ResizeObserver for Recharts components
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add ResizeObserver to global object
global.ResizeObserver = ResizeObserverMock;

// Polyfill fetch for Jest environment
global.fetch = fetch;

// Mock React.Fragment for React 19 compatibility in tests

// Workaround for React.Fragment being readonly in React 19
// Provide a custom Fragment component for tests
// const CustomFragment = (props: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, props.children);

// Do not override React.Fragment to avoid Object.defineProperty error in React 19 tests
// Object.defineProperty(React, 'Fragment', {
//   configurable: true,
//   get: () => CustomFragment,
//   set: () => {
//     // no-op setter to prevent assignment errors
//   },
// });
