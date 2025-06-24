import React, { useEffect, useState } from 'react';
import { getTopAnime } from './services/animeService';
import { getBooks } from './services/bookService';
import { getMovies } from './services/movieService';
import { getSeries } from './services/seriesService';
import { fetchIPTVChannels } from './services/iptvService';
import { BottomDock } from './components/BottomDock';
import { CornerWidget } from './components/CornerWidget';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { MainContentArea } from './components/MainContentArea';
import { RightSidebar } from './components/RightSidebar';
import {
  ACADEMICS_HEADER_BUTTONS,
  ANALYTICS_HEADER_BUTTONS,
  CONTACT_HEADER_BUTTONS,
  DESIGN_HEADER_BUTTONS,
  EMAIL_HEADER_BUTTONS,
  LIFESTYLE_HEADER_BUTTONS,
  MEDIA_HEADER_BUTTONS
} from './constants';
import { MainViewKey, ModuleKey } from './types';

// Import Analytics components
import { AnalyticHeader } from './components/analytic/AnalyticHeader';
import { AnalyticLeftSidebar } from './components/analytic/AnalyticLeftSidebar';
import { AnalyticMainContent } from './components/analytic/AnalyticMainContent';

// Import Academics components
import { AcademicsHeader } from './components/academics/AcademicsHeader';
import { AcademicsLeftSidebar } from './components/academics/AcademicsLeftSidebar';
import { AcademicsMainContent } from './components/academics/AcademicsMainContent';

// Import LifeStyle components
import { LifeStyleHeader } from './components/lifestyle/LifeStyleHeader';
import { LifeStyleLeftSidebar } from './components/lifestyle/LifeStyleLeftSidebar';
import { LifeStyleMainContent } from './components/lifestyle/LifeStyleMainContent';

// Import Media components
import { MediaHeader } from './components/media/MediaHeader';
import { MediaLeftSidebar } from './components/media/MediaLeftSidebar';
import { MediaMainContent } from './components/media/MediaMainContent';

// Import Design components
import { DesignHeader } from './components/design/DesignHeader';
import { DesignLeftSidebar } from './components/design/DesignLeftSidebar';
import { DesignMainContent } from './components/design/DesignMainContent';

// Import Email components
import { EmailHeader } from './components/email/EmailHeader';
import { EmailLeftSidebar } from './components/email/EmailLeftSidebar';
import { EmailMainContent } from './components/email/EmailMainContent';

// Import Contact components
import { ContactHeader } from './components/contact/ContactHeader';
import { ContactLeftSidebar } from './components/contact/ContactLeftSidebar';
import { ContactMainContent } from './components/contact/ContactMainContent';

const App: React.FC = () => {
  const [anime, setAnime] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [iptvChannels, setIptvChannels] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookPage, setBookPage] = useState(1);
  const [moviePage, setMoviePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMainView, setCurrentMainView] = useState<MainViewKey>(MainViewKey.Default);
  const [defaultViewSelectedModule, setDefaultViewSelectedModule] = useState<ModuleKey | null>(ModuleKey.School);

  const [defaultViewShowLeftSidebar, setDefaultViewShowLeftSidebar] = useState<boolean>(true);
  const [analyticsViewShowLeftSidebar, setAnalyticsViewShowLeftSidebar] = useState<boolean>(false);
  const [academicsViewShowLeftSidebar, setAcademicsViewShowLeftSidebar] = useState<boolean>(false);
  const [lifeStyleViewShowLeftSidebar, setLifeStyleViewShowLeftSidebar] = useState<boolean>(false);
  const [mediaViewShowLeftSidebar, setMediaViewShowLeftSidebar] = useState<boolean>(false);
  const [designViewShowLeftSidebar, setDesignViewShowLeftSidebar] = useState<boolean>(false);
  const [emailViewShowLeftSidebar, setEmailViewShowLeftSidebar] = useState<boolean>(false);
  const [contactViewShowLeftSidebar, setContactViewShowLeftSidebar] = useState<boolean>(false);

  // State for active sub-modules in specialized views
  const [activeAnalyticsSubModule, setActiveAnalyticsSubModule] = useState<string | null>(null);
  const [activeAcademicsSubModule, setActiveAcademicsSubModule] = useState<string | null>(null);
  const [activeLifeStyleSubModule, setActiveLifeStyleSubModule] = useState<string | null>(null);
  const [activeMediaSubModule, setActiveMediaSubModule] = useState<string | null>(null);
  const [activeDesignSubModule, setActiveDesignSubModule] = useState<string | null>(null);
  const [activeEmailSubModule, setActiveEmailSubModule] = useState<string | null>(null);
  const [activeContactSubModule, setActiveContactSubModule] = useState<string | null>(null);


  const handleHeaderModuleSelect = (moduleKey: ModuleKey) => {
    setCurrentMainView(MainViewKey.Default);
    if (moduleKey === defaultViewSelectedModule) {
      setDefaultViewShowLeftSidebar(!defaultViewShowLeftSidebar);
    } else {
      setDefaultViewSelectedModule(moduleKey);
      setDefaultViewShowLeftSidebar(true);
    }
  };

  // Handler functions for sub-module selection with toggle behavior
  const handleAnalyticsSubModuleSelect = (key: string) => {
    if (key === activeAnalyticsSubModule) {
      // If clicking the same sub-module, toggle sidebar
      setAnalyticsViewShowLeftSidebar(!analyticsViewShowLeftSidebar);
    } else {
      // If clicking a different sub-module, set it as active and show sidebar
      setActiveAnalyticsSubModule(key);
      setAnalyticsViewShowLeftSidebar(true);
    }
  };

  const handleAcademicsSubModuleSelect = (key: string) => {
    if (key === activeAcademicsSubModule) {
      setAcademicsViewShowLeftSidebar(!academicsViewShowLeftSidebar);
    } else {
      setActiveAcademicsSubModule(key);
      setAcademicsViewShowLeftSidebar(true);
    }
  };

  const handleLifeStyleSubModuleSelect = (key: string) => {
    if (key === activeLifeStyleSubModule) {
      setLifeStyleViewShowLeftSidebar(!lifeStyleViewShowLeftSidebar);
    } else {
      setActiveLifeStyleSubModule(key);
      setLifeStyleViewShowLeftSidebar(true);
    }
  };

  const handleMediaSubModuleSelect = (key: string) => {
    if (key === activeMediaSubModule) {
      setMediaViewShowLeftSidebar(!mediaViewShowLeftSidebar);
    } else {
      setActiveMediaSubModule(key);
      setMediaViewShowLeftSidebar(true);
    }
  };

  const handleDesignSubModuleSelect = (key: string) => {
    if (key === activeDesignSubModule) {
      setDesignViewShowLeftSidebar(!designViewShowLeftSidebar);
    } else {
      setActiveDesignSubModule(key);
      setDesignViewShowLeftSidebar(true);
    }
  };

  const handleEmailSubModuleSelect = (key: string) => {
    if (key === activeEmailSubModule) {
      setEmailViewShowLeftSidebar(!emailViewShowLeftSidebar);
    } else {
      setActiveEmailSubModule(key);
      setEmailViewShowLeftSidebar(true);
    }
  };

  const handleContactSubModuleSelect = (key: string) => {
    if (key === activeContactSubModule) {
      setContactViewShowLeftSidebar(!contactViewShowLeftSidebar);
    } else {
      setActiveContactSubModule(key);
      setContactViewShowLeftSidebar(true);
    }
  };

  const handleRightSidebarViewSelect = (viewKey?: MainViewKey) => {
    if (viewKey && viewKey !== currentMainView) {
      setCurrentMainView(viewKey);
      // Open the new view's sidebar and close others
      setDefaultViewShowLeftSidebar(viewKey === MainViewKey.Default);
      setAnalyticsViewShowLeftSidebar(viewKey === MainViewKey.Analytics);
      setAcademicsViewShowLeftSidebar(viewKey === MainViewKey.Academics);
      setLifeStyleViewShowLeftSidebar(viewKey === MainViewKey.LifeStyle);
      setMediaViewShowLeftSidebar(viewKey === MainViewKey.Media);
      setDesignViewShowLeftSidebar(viewKey === MainViewKey.Design);
      setEmailViewShowLeftSidebar(viewKey === MainViewKey.Email);
      setContactViewShowLeftSidebar(viewKey === MainViewKey.Contact);

    } else if (viewKey === currentMainView) { // Toggle current view's sidebar
      switch (viewKey) {
        case MainViewKey.Default: setDefaultViewShowLeftSidebar(!defaultViewShowLeftSidebar); break;
        case MainViewKey.Analytics: setAnalyticsViewShowLeftSidebar(!analyticsViewShowLeftSidebar); break;
        case MainViewKey.Academics: setAcademicsViewShowLeftSidebar(!academicsViewShowLeftSidebar); break;
        case MainViewKey.LifeStyle: setLifeStyleViewShowLeftSidebar(!lifeStyleViewShowLeftSidebar); break;
        case MainViewKey.Media: setMediaViewShowLeftSidebar(!mediaViewShowLeftSidebar); break;
        case MainViewKey.Design: setDesignViewShowLeftSidebar(!designViewShowLeftSidebar); break;
        case MainViewKey.Email: setEmailViewShowLeftSidebar(!emailViewShowLeftSidebar); break;
        case MainViewKey.Contact: setContactViewShowLeftSidebar(!contactViewShowLeftSidebar); break;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const animeData = await getTopAnime(25);
        const booksData = await getBooks(bookPage, 32);
        const moviesData = await getMovies();
        const seriesData = await getSeries();
        const iptvData = await fetchIPTVChannels();

        setAnime(animeData);
        setBooks(prevBooks => bookPage === 1 ? booksData : [...prevBooks, ...booksData]);
        setMovies(moviesData);
        setSeries(seriesData);
        setIptvChannels(iptvData.slice(0, 50)); // Limit to first 50 channels for performance
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally, set an error state here to show an error message in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookPage]);

  useEffect(() => {
    if (currentMainView !== MainViewKey.Default) setDefaultViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Analytics) setAnalyticsViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Academics) setAcademicsViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.LifeStyle) setLifeStyleViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Media) setMediaViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Design) setDesignViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Email) setEmailViewShowLeftSidebar(false);
    if (currentMainView !== MainViewKey.Contact) setContactViewShowLeftSidebar(false);

    // Initialize active sub-module and open sidebar for the new view
    switch (currentMainView) {
      case MainViewKey.Analytics:
        setAnalyticsViewShowLeftSidebar(true);
        setActiveAnalyticsSubModule(ANALYTICS_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Academics:
        setAcademicsViewShowLeftSidebar(true);
        setActiveAcademicsSubModule(ACADEMICS_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.LifeStyle:
        setLifeStyleViewShowLeftSidebar(true);
        setActiveLifeStyleSubModule(LIFESTYLE_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Media:
        setMediaViewShowLeftSidebar(true);
        setActiveMediaSubModule(MEDIA_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Design:
        setDesignViewShowLeftSidebar(true);
        setActiveDesignSubModule(DESIGN_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Email:
        setEmailViewShowLeftSidebar(true);
        setActiveEmailSubModule(EMAIL_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Contact:
        setContactViewShowLeftSidebar(true);
        setActiveContactSubModule(CONTACT_HEADER_BUTTONS[0]?.key || null);
        break;
      case MainViewKey.Default:
        setDefaultViewShowLeftSidebar(!!defaultViewSelectedModule);
        break;
    }
  }, [currentMainView]);


  let ActiveHeader, ActiveLeftSidebar, ActiveMainContent;
  let showCurrentLeftSidebar = false;
  let currentHeaderHeight = '4rem'; // Default h-16
  const specificViewHeaderHeight = '3.5rem'; // Default h-14 for non-default views

  switch (currentMainView) {
    case MainViewKey.Analytics:
      ActiveHeader = <AnalyticHeader activeSubModuleKey={activeAnalyticsSubModule} onSubModuleSelect={handleAnalyticsSubModuleSelect} />;
      ActiveLeftSidebar = <AnalyticLeftSidebar isOpen={analyticsViewShowLeftSidebar} onToggle={() => setAnalyticsViewShowLeftSidebar(!analyticsViewShowLeftSidebar)} activeSubModuleKey={activeAnalyticsSubModule} />;
      ActiveMainContent = <AnalyticMainContent />;
      showCurrentLeftSidebar = analyticsViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Academics:
      ActiveHeader = <AcademicsHeader activeSubModuleKey={activeAcademicsSubModule} onSubModuleSelect={handleAcademicsSubModuleSelect} />;
      ActiveLeftSidebar = <AcademicsLeftSidebar isOpen={academicsViewShowLeftSidebar} onToggle={() => setAcademicsViewShowLeftSidebar(!academicsViewShowLeftSidebar)} activeSubModuleKey={activeAcademicsSubModule} />;
      ActiveMainContent = <AcademicsMainContent />;
      showCurrentLeftSidebar = academicsViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.LifeStyle:
      ActiveHeader = <LifeStyleHeader activeSubModuleKey={activeLifeStyleSubModule} onSubModuleSelect={handleLifeStyleSubModuleSelect} />;
      ActiveLeftSidebar = <LifeStyleLeftSidebar isOpen={lifeStyleViewShowLeftSidebar} onToggle={() => setLifeStyleViewShowLeftSidebar(!lifeStyleViewShowLeftSidebar)} activeSubModuleKey={activeLifeStyleSubModule} />;
      ActiveMainContent = <LifeStyleMainContent activeSubModuleKey={activeLifeStyleSubModule} />;
      showCurrentLeftSidebar = lifeStyleViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Media:
      ActiveHeader = <MediaHeader activeSubModuleKey={activeMediaSubModule} onSubModuleSelect={handleMediaSubModuleSelect} onSearch={setSearchQuery} />;
      ActiveLeftSidebar = <MediaLeftSidebar isOpen={mediaViewShowLeftSidebar} onToggle={() => setMediaViewShowLeftSidebar(!mediaViewShowLeftSidebar)} activeSubModuleKey={activeMediaSubModule} />;
      ActiveMainContent = <MediaMainContent activeSubModuleKey={activeMediaSubModule} anime={anime} books={books} movies={movies} series={series} searchQuery={searchQuery} bookPage={bookPage} setBookPage={setBookPage} moviePage={moviePage} setMoviePage={setMoviePage} isLoading={isLoading} />;
      showCurrentLeftSidebar = mediaViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Design:
      ActiveHeader = <DesignHeader activeSubModuleKey={activeDesignSubModule} onSubModuleSelect={handleDesignSubModuleSelect} />;
      ActiveLeftSidebar = <DesignLeftSidebar isOpen={designViewShowLeftSidebar} onToggle={() => setDesignViewShowLeftSidebar(!designViewShowLeftSidebar)} activeSubModuleKey={activeDesignSubModule} onSubModuleChange={setActiveDesignSubModule} />;
      ActiveMainContent = <DesignMainContent activeSubModuleKey={activeDesignSubModule} />;
      showCurrentLeftSidebar = designViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Email:
      ActiveHeader = <EmailHeader activeSubModuleKey={activeEmailSubModule} onSubModuleSelect={handleEmailSubModuleSelect} />;
      ActiveLeftSidebar = <EmailLeftSidebar isOpen={emailViewShowLeftSidebar} onToggle={() => setEmailViewShowLeftSidebar(!emailViewShowLeftSidebar)} activeSubModuleKey={activeEmailSubModule} onSubModuleChange={setActiveEmailSubModule} />;
      ActiveMainContent = <EmailMainContent activeSubModuleKey={activeEmailSubModule} />;
      showCurrentLeftSidebar = emailViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Contact:
      ActiveHeader = <ContactHeader activeSubModuleKey={activeContactSubModule} onSubModuleSelect={handleContactSubModuleSelect} />;
      ActiveLeftSidebar = <ContactLeftSidebar isOpen={contactViewShowLeftSidebar} onToggle={() => setContactViewShowLeftSidebar(!contactViewShowLeftSidebar)} activeSubModuleKey={activeContactSubModule} />;
      ActiveMainContent = <ContactMainContent />;
      showCurrentLeftSidebar = contactViewShowLeftSidebar;
      currentHeaderHeight = specificViewHeaderHeight;
      break;
    case MainViewKey.Default:
    default:
      ActiveHeader = <Header activeModule={defaultViewSelectedModule} onModuleSelect={handleHeaderModuleSelect} />;
      ActiveLeftSidebar = <LeftSidebar selectedModule={defaultViewSelectedModule} isOpen={defaultViewShowLeftSidebar} />;
      ActiveMainContent = <MainContentArea activeModule={defaultViewSelectedModule} />;
      showCurrentLeftSidebar = defaultViewShowLeftSidebar;
      currentHeaderHeight = '4rem'; // Standard header height
      break;
  }

  const sidebarWidthClass = 'ml-52 sm:ml-60';

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden antialiased">
      {ActiveLeftSidebar}
      <div
        className={`flex-1 flex flex-col relative overflow-hidden h-full transition-all duration-300 ease-in-out ${
          showCurrentLeftSidebar ? sidebarWidthClass : 'ml-0'
        }`}
      >
        {ActiveHeader}
        <div className="flex-1 overflow-hidden" style={{height: `calc(100vh - ${currentHeaderHeight})`}}>
          {ActiveMainContent}
        </div>
        <BottomDock />
        <CornerWidget />
      </div>
      <RightSidebar onViewSelect={handleRightSidebarViewSelect} />
    </div>
  );
};

export default App;
