import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { MainViewKey } from './types';

jest.mock('./services/tmdbService', () => ({
  getTrendingMovies: jest.fn(() => Promise.resolve({ results: [] })),
  getTrendingSeries: jest.fn(() => Promise.resolve({ results: [] })),
}));

jest.mock('./services/animeService', () => ({
  getTopAnime: jest.fn(() => Promise.resolve([])),
}));

jest.mock('./services/bookService', () => ({
  getBooks: jest.fn(() => Promise.resolve([])),
}));

jest.mock('./services/movieService', () => ({
  getMovies: jest.fn(() => Promise.resolve([])),
}));

jest.mock('./services/seriesService', () => ({
  getSeries: jest.fn(() => Promise.resolve([])),
}));

// Mock all components with named exports
jest.mock('./components/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

jest.mock('./components/LeftSidebar', () => ({
  LeftSidebar: () => <div data-testid="mock-left-sidebar">Left Sidebar</div>
}));

jest.mock('./components/MainContentArea', () => ({
  MainContentArea: () => <div data-testid="mock-main-content">Main Content</div>
}));

jest.mock('./components/BottomDock', () => ({
  BottomDock: () => <div data-testid="mock-bottom-dock">Bottom Dock</div>
}));

jest.mock('./components/CornerWidget', () => ({
  CornerWidget: () => <div data-testid="mock-corner-widget">Corner Widget</div>
}));

jest.mock('./components/RightSidebar', () => ({
  RightSidebar: ({ onViewSelect }: { onViewSelect: (view?: MainViewKey) => void }) => (
    <div data-testid="mock-right-sidebar">
      <button onClick={() => onViewSelect(MainViewKey.Analytics)}>Analytics</button>
      <button onClick={() => onViewSelect(MainViewKey.Academics)}>Academics</button>
      <button onClick={() => onViewSelect(MainViewKey.LifeStyle)}>Lifestyle</button>
      <button onClick={() => onViewSelect(MainViewKey.Media)}>Media</button>
      <button onClick={() => onViewSelect(MainViewKey.Design)}>Design</button>
      <button onClick={() => onViewSelect(MainViewKey.Email)}>Email</button>
      <button onClick={() => onViewSelect(MainViewKey.Contact)}>Contact</button>
    </div>
  )
}));

// Mock widget components
jest.mock('./components/analytic/widgets/SampleAnalyticWidget', () => ({
  SampleAnalyticWidget: () => <div data-testid="mock-analytic-widget">Analytic Widget</div>
}));

jest.mock('./components/academics/widgets/SampleAcademicsWidget', () => ({
  SampleAcademicsWidget: () => <div data-testid="mock-academics-widget">Academics Widget</div>
}));

jest.mock('./components/lifestyle/widgets/SampleLifeStyleWidget', () => ({
  SampleLifeStyleWidget: () => <div data-testid="mock-lifestyle-widget">Lifestyle Widget</div>
}));

jest.mock('./components/media/widgets/SampleMediaWidget', () => ({
  SampleMediaWidget: () => <div data-testid="mock-media-widget">Media Widget</div>
}));

jest.mock('./components/design/widgets/SampleDesignWidget', () => ({
  SampleDesignWidget: () => <div data-testid="mock-design-widget">Design Widget</div>
}));

jest.mock('./components/email/widgets/SampleEmailWidget', () => ({
  SampleEmailWidget: () => <div data-testid="mock-email-widget">Email Widget</div>
}));

jest.mock('./components/contact/widgets/SampleContactWidget', () => ({
  SampleContactWidget: () => <div data-testid="mock-contact-widget">Contact Widget</div>
}));

// Mock specialized view components
jest.mock('./components/analytic/AnalyticHeader', () => ({
  AnalyticHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-analytic-header">
      <button onClick={() => onSubModuleSelect('analytics-test')}>Analytics Header Button</button>
    </div>
  )
}));

jest.mock('./components/analytic/AnalyticLeftSidebar', () => ({
  AnalyticLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-analytic-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Analytics Sidebar
    </div>
  )
}));

jest.mock('./components/academics/AcademicsHeader', () => ({
  AcademicsHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-academics-header">
      <button onClick={() => onSubModuleSelect('academics-test')}>Academics Header Button</button>
    </div>
  )
}));

jest.mock('./components/academics/AcademicsLeftSidebar', () => ({
  AcademicsLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-academics-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Academics Sidebar
    </div>
  )
}));

jest.mock('./components/lifestyle/LifeStyleHeader', () => ({
  LifeStyleHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-lifestyle-header">
      <button onClick={() => onSubModuleSelect('lifestyle-test')}>Lifestyle Header Button</button>
    </div>
  )
}));

jest.mock('./components/lifestyle/LifeStyleLeftSidebar', () => ({
  LifeStyleLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-lifestyle-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Lifestyle Sidebar
    </div>
  )
}));

jest.mock('./components/media/MediaHeader', () => ({
  MediaHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-media-header">
      <button onClick={() => onSubModuleSelect('media-test')}>Media Header Button</button>
    </div>
  )
}));

jest.mock('./components/media/MediaLeftSidebar', () => ({
  MediaLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-media-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Media Sidebar
    </div>
  )
}));

jest.mock('./components/design/DesignHeader', () => ({
  DesignHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-design-header">
      <button onClick={() => onSubModuleSelect('design-test')}>Design Header Button</button>
    </div>
  )
}));

jest.mock('./components/design/DesignLeftSidebar', () => ({
  DesignLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-design-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Design Sidebar
    </div>
  )
}));

jest.mock('./components/email/EmailHeader', () => ({
  EmailHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-email-header">
      <button onClick={() => onSubModuleSelect('email-test')}>Email Header Button</button>
    </div>
  )
}));

jest.mock('./components/email/EmailLeftSidebar', () => ({
  EmailLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-email-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Email Sidebar
    </div>
  )
}));

jest.mock('./components/contact/ContactHeader', () => ({
  ContactHeader: ({ onSubModuleSelect }: { onSubModuleSelect: (key: string) => void }) => (
    <div data-testid="mock-contact-header">
      <button onClick={() => onSubModuleSelect('contact-test')}>Contact Header Button</button>
    </div>
  )
}));

jest.mock('./components/contact/ContactLeftSidebar', () => ({
  ContactLeftSidebar: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-contact-sidebar" className={isOpen ? 'visible' : 'hidden'}>
      Contact Sidebar
    </div>
  )
}));

describe('App Component', () => {
  test('renders without crashing and shows main elements', () => {
    render(<App />);

    // Check for presence of main content area
    const mainContent = screen.getByTestId('mock-main-content');
    expect(mainContent).toBeInTheDocument();

    // Check for presence of bottom dock
    const bottomDock = screen.getByTestId('mock-bottom-dock');
    expect(bottomDock).toBeInTheDocument();

    // Check for presence of corner widget
    const cornerWidget = screen.getByTestId('mock-corner-widget');
    expect(cornerWidget).toBeInTheDocument();

    // Check for presence of right sidebar
    const rightSidebar = screen.getByTestId('mock-right-sidebar');
    expect(rightSidebar).toBeInTheDocument();
  });

  test('switches between views and manages sidebars correctly', () => {
    render(<App />);

    // Test Analytics view
    fireEvent.click(screen.getByText('Analytics'));
    expect(screen.getByTestId('mock-analytic-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-analytic-header')).toBeInTheDocument();

    // Test Academics view
    fireEvent.click(screen.getByText('Academics'));
    expect(screen.getByTestId('mock-academics-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-academics-header')).toBeInTheDocument();
    // Analytics view should be unmounted
    expect(screen.queryByTestId('mock-analytic-sidebar')).not.toBeInTheDocument();

    // Test Lifestyle view
    fireEvent.click(screen.getByText('Lifestyle'));
    expect(screen.getByTestId('mock-lifestyle-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-lifestyle-header')).toBeInTheDocument();
    // Academics view should be unmounted
    expect(screen.queryByTestId('mock-academics-sidebar')).not.toBeInTheDocument();

    // Test Media view
    fireEvent.click(screen.getByText('Media'));
    expect(screen.getByTestId('mock-media-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-media-header')).toBeInTheDocument();
    // Lifestyle view should be unmounted
    expect(screen.queryByTestId('mock-lifestyle-sidebar')).not.toBeInTheDocument();

    // Test Design view
    fireEvent.click(screen.getByText('Design'));
    expect(screen.getByTestId('mock-design-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-design-header')).toBeInTheDocument();
    // Media view should be unmounted
    expect(screen.queryByTestId('mock-media-sidebar')).not.toBeInTheDocument();

    // Test Email view
    fireEvent.click(screen.getByText('Email'));
    expect(screen.getByTestId('mock-email-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-email-header')).toBeInTheDocument();
    // Design view should be unmounted
    expect(screen.queryByTestId('mock-design-sidebar')).not.toBeInTheDocument();

    // Test Contact view
    fireEvent.click(screen.getByText('Contact'));
    expect(screen.getByTestId('mock-contact-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact-header')).toBeInTheDocument();
    // Email view should be unmounted
    expect(screen.queryByTestId('mock-email-sidebar')).not.toBeInTheDocument();

    // Test toggling sidebar in current view
    fireEvent.click(screen.getByText('Contact')); // Click again to toggle
    expect(screen.getByTestId('mock-contact-sidebar')).toHaveClass('hidden');
    fireEvent.click(screen.getByText('Contact')); // Click again to toggle back
    expect(screen.getByTestId('mock-contact-sidebar')).toHaveClass('visible');
  });
});
