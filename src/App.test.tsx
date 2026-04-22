import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

// Mock hooks and child components used inside App
vi.mock('./hooks/useCurrentTime', () => ({ useCurrentTime: () => ({ currentTime: new Date(2024, 0, 1, 12, 0, 0) }) }));
vi.mock('./hooks/usePrayerAPI', () => ({ usePrayerAPI: () => ({ prayerData: {}, loading: false, error: null }) }));
vi.mock('./components/PrayerHeaderSection', () => ({ PrayerHeaderSection: () => <div>PrayerHeaderSection</div> }));
vi.mock('./components/PrayerTabsSection', () => ({ PrayerTabsSection: () => <div>PrayerTabsSection</div> }));
vi.mock('./components/PrayerCardSection', () => ({ PrayerCardSection: () => <div>PrayerCardSection</div> }));


describe('App', () => {
  it('renders the main page and child components without crashing', () => {
    render(<App />);
    expect(screen.getByText('PrayerHeaderSection')).toBeInTheDocument();
    expect(screen.getByText('PrayerCardSection')).toBeInTheDocument();
    expect(screen.getByText('PrayerTabsSection')).toBeInTheDocument();
  });
});
