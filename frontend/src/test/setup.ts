import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch
vi.stubGlobal("fetch", vi.fn());

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("localStorage", localStorageMock);
