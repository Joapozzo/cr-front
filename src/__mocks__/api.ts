import { vi } from 'vitest';

export const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
};

// Also mock default export if necessary
export default mockAxios;
