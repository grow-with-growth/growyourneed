import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EmailAnalyticsWidget } from './EmailAnalyticsWidget';

describe('EmailAnalyticsWidget', () => {
  it('renders loading state', () => {
    render(<EmailAnalyticsWidget />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('renders campaign selector', async () => {
    render(<EmailAnalyticsWidget />);
    expect(await screen.findByLabelText('Select Campaign')).toBeInTheDocument();
  });
  it('renders time range selector', () => {
    render(<EmailAnalyticsWidget />);
    expect(screen.getByLabelText('Time Range Selector')).toBeInTheDocument();
  });
});
