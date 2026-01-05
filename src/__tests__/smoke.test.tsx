import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

// Mock LandingPage to isolate the page component
vi.mock('../app/components/landing/LandingPage', () => ({
    default: () => <div data-testid="landing-page">Landing Page Content</div>,
}));

describe('Smoke Tests', () => {
    it('should render home page without crashing', () => {
        render(<Home />);

        // Check if the landing page component is rendered
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
        expect(screen.getByText('Landing Page Content')).toBeInTheDocument();
    });
});
