/**
 * 다국어 딕셔너리 타입 정의
 * 
 * 이 타입은 애플리케이션 전체에서 사용되는 모든 다국어 문자열의 구조를 정의합니다.
 * 각 페이지와 컴포넌트에서 필요한 텍스트를 중첩된 객체 구조로 관리합니다.
 * 
 * 타입 안정성을 보장하여 오타나 누락된 번역을 컴파일 타임에 감지할 수 있습니다.
 */
export type Dictionary = {
  home: {
    title: string;
    description: string;
    getStarted: string;
    learnMore: string;
    viewAllServices: string;
    stats: {
      title: string;
      vehicles: string;
      vehiclesDesc: string;
      platform: string;
      platformDesc: string;
      partners: string;
      partnersDesc: string;
      technology: string;
      technologyDesc: string;
    };
    vision: {
      title: string;
      subtitle: string;
      description: string;
    };
    technology: {
      title: string;
      subtitle: string;
      ai: {
        title: string;
        description: string;
      };
      software: {
        title: string;
        description: string;
      };
      platform: {
        title: string;
        description: string;
      };
    };
    careersPreview: {
      title: string;
      description: string;
      button: string;
    };
  };
  nav: {
    home: string;
    about: string;
    services: string;
    careers: string;
    location: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: {
      title: string;
      description: string;
    };
    values: {
      title: string;
      innovation: string;
      innovationDesc: string;
      excellence: string;
      excellenceDesc: string;
      integrity: string;
      integrityDesc: string;
      collaboration: string;
      collaborationDesc: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    description: string;
    digitalStrategy: {
      title: string;
      description: string;
    };
    webDevelopment: {
      title: string;
      description: string;
    };
    dataAnalytics: {
      title: string;
      description: string;
    };
  };
  location: {
    title: string;
    subtitle: string;
    description: string;
    tabs: {
      seoul: string;
      shanghai: string;
    };
    seoul: {
      title: string;
      company: string;
      address: string;
      phone: string;
      email: string;
      latitude: number;
      longitude: number;
      timezone: string;
      country: string;
      city: string;
    };
    shanghai: {
      title: string;
      company: string;
      address: string;
      phone: string;
      email: string;
      latitude: number;
      longitude: number;
      timezone: string;
      country: string;
      city: string;
    };
  };
  footer: {
    company: {
      name: string;
      description: string;
    };
    quickLinks: string;
    contact: string;
    email: string;
    phone: string;
    copyright: string;
  };
  careers: {
    title: string;
    subtitle: string;
    description: string;
    filters: {
      title: string;
      search: string;
      searchPlaceholder: string;
      department: string;
      experience: string;
      location: string;
      all: string;
      reset: string;
    };
    featuredJobs: {
      title: string;
    };
    jobList: {
      title: string;
      noResults: string;
      apply: string;
      fullTime: string;
      contract: string;
      intern: string;
      remote: string;
      hybrid: string;
    };
    departments: {
      engineering: string;
      ai: string;
      product: string;
      design: string;
      business: string;
      operations: string;
    };
    experience: {
      entry: string;
      junior: string;
      mid: string;
      senior: string;
    };
    locations: {
      seoul: string;
      busan: string;
      remote: string;
      hybrid: string;
    };
  };
  notFound: {
    title: string;
    subtitle: string;
    description: string;
    backHome: string;
  };
};

