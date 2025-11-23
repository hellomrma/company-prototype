/**
 * 채용 공고 API 모듈
 * 
 * 이 모듈은 Ashby API에서 채용 공고를 가져와서 내부 형식으로 변환합니다.
 * Ashby는 채용 관리 시스템(ATS)으로, 공개 채용 공고를 API로 제공합니다.
 */

/**
 * Ashby API 응답의 Job 타입 정의
 * Ashby API에서 반환하는 원본 채용 공고 데이터 구조
 */
export type AshbyJob = {
  id: string;
  title: string;
  department: string;
  team?: string;
  employmentType: string;
  location: string;
  secondaryLocations?: string[];
  publishedAt: string;
  isListed: boolean;
  isRemote: boolean;
  address?: {
    postalAddress?: {
      addressRegion?: string;
      addressCountry?: string;
      addressLocality?: string;
    };
  };
  jobUrl: string;
  applyUrl: string;
  descriptionHtml: string;
  descriptionPlain: string;
};

/**
 * Ashby API 응답 타입
 * API에서 반환하는 전체 응답 구조
 */
export type AshbyApiResponse = {
  jobs: AshbyJob[]; // 채용 공고 배열
  apiVersion: string; // API 버전
};

/**
 * 내부 Job 타입 (UI에서 사용)
 * Ashby API의 Job을 변환한 후 UI에서 사용하는 표준 형식
 */
export type Job = {
  id: string; // 채용 공고 고유 ID
  title: string; // 채용 공고 제목
  department: string; // 정규화된 부서명 (예: "engineering", "ai")
  originalDepartment?: string; // 원본 부서명 (필터용, Ashby에서 받은 원본)
  experience: string; // 경력 수준 (entry, junior, mid, senior)
  location: string; // 정규화된 지역명 (예: "seoul", "remote")
  originalLocation?: string; // 원본 지역명 (필터용, Ashby에서 받은 원본)
  type: string; // 고용 형태 (fullTime, contract, intern)
  workType: string; // 근무 형태 (remote, hybrid)
  description: string; // 채용 공고 설명 (요약)
  jobUrl: string; // 채용 공고 상세 페이지 URL
  applyUrl: string; // 지원하기 URL
  team?: string; // 팀명 (선택적)
  publishedAt: string; // 공고 게시일 (ISO 8601 형식)
};

/**
 * Ashby API에서 채용 공고를 가져오는 함수
 * 
 * @returns 채용 공고 배열 (Promise)
 * 
 * @description
 * - Ashby API에서 공개된 채용 공고를 가져옵니다
 * - Next.js의 fetch 캐싱을 사용하여 1시간마다 재검증합니다
 * - isListed가 true인 공고만 반환합니다 (비공개 공고 제외)
 * - 오류 발생 시 빈 배열을 반환합니다
 * 
 * @example
 * ```typescript
 * const jobs = await fetchJobs();
 * console.log(jobs.length); // 채용 공고 개수
 * ```
 */
export async function fetchJobs(): Promise<Job[]> {
  try {
    // Ashby API 호출 (Next.js fetch 캐싱 사용)
    const response = await fetch("https://api.ashbyhq.com/posting-api/job-board/42dot", {
      next: {
        revalidate: 3600, // 1시간마다 재검증 (ISR)
      },
    });

    // HTTP 응답 상태 확인
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    // JSON 응답 파싱
    const data: AshbyApiResponse = await response.json();

    // 응답 형식 검증
    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error("잘못된 API 응답 형식");
    }

    // isListed가 true인 공고만 필터링하고 내부 형식으로 변환
    return data.jobs
      .filter((job) => job.isListed) // 공개된 공고만
      .map((job) => transformJob(job)); // 내부 형식으로 변환
  } catch (error) {
    // 오류 처리
    // 프로덕션 환경에서는 로깅 시스템으로 대체 권장
    if (process.env.NODE_ENV === "development") {
      console.error("채용 공고를 가져오는 중 오류 발생:", error);
    }
    // 오류 발생 시 빈 배열 반환 (UI가 깨지지 않도록)
    return [];
  }
}

/**
 * Ashby API의 Job을 내부 Job 타입으로 변환하는 함수
 * 
 * @param ashbyJob - Ashby API에서 받은 원본 채용 공고
 * @returns 변환된 내부 Job 객체
 * 
 * @description
 * - 부서명을 정규화합니다 (다양한 형식을 표준 형식으로 변환)
 * - 지역명을 정규화합니다
 * - 고용 형태를 변환합니다
 * - 경력 수준을 추론합니다
 * - 설명을 요약합니다
 */
function transformJob(ashbyJob: AshbyJob): Job {
  // Department 매핑 (대소문자 무시하고 매핑)
  // Ashby에서 받은 다양한 부서명을 표준 형식으로 변환
  const departmentUpper = ashbyJob.department.toUpperCase().trim();
  const departmentMap: Record<string, string> = {
    ENGINEERING: "engineering",
    "AI": "ai",
    "AI/ML": "ai", // AI/ML도 ai로 매핑
    "AIML": "ai",
    PRODUCT: "product",
    DESIGN: "design",
    BUSINESS: "business",
    OPERATIONS: "operations",
    SALES: "business", // Sales는 Business로 매핑
    MARKETING: "business", // Marketing도 Business로 매핑
  };

  // 정확한 매칭 시도
  let department = departmentMap[departmentUpper];
  
  // 매칭 실패 시 부분 매칭 시도 (부서명에 키워드가 포함된 경우)
  if (!department) {
    if (departmentUpper.includes("ENGINEERING") || departmentUpper.includes("SOFTWARE") || departmentUpper.includes("DEVELOPER")) {
      department = "engineering";
    } else if (departmentUpper.includes("AI") || departmentUpper.includes("ML") || departmentUpper.includes("MACHINE LEARNING")) {
      department = "ai";
    } else if (departmentUpper.includes("PRODUCT")) {
      department = "product";
    } else if (departmentUpper.includes("DESIGN") || departmentUpper.includes("UX") || departmentUpper.includes("UI")) {
      department = "design";
    } else if (departmentUpper.includes("BUSINESS") || departmentUpper.includes("SALES") || departmentUpper.includes("MARKETING")) {
      department = "business";
    } else {
      department = "engineering"; // 기본값 (매칭 실패 시)
    }
  }

  // Location 파싱 (원본도 저장하여 필터링에 사용)
  const location = parseLocation(ashbyJob.location, ashbyJob.isRemote);

  // Employment Type 변환 (Ashby 형식 -> 내부 형식)
  const typeMap: Record<string, string> = {
    FullTime: "fullTime", // 정규직
    Contract: "contract", // 계약직
    Intern: "intern", // 인턴
    PartTime: "contract", // 파트타임도 계약직으로 매핑
  };
  const type = typeMap[ashbyJob.employmentType] || "fullTime"; // 기본값: 정규직

  // Work Type 결정 (원격 근무 여부에 따라)
  const workType = ashbyJob.isRemote ? "remote" : "hybrid"; // 원격이 아니면 하이브리드

  // Experience 추론 (제목이나 설명에서 키워드를 찾아 경력 수준 추론)
  const experience = inferExperience(ashbyJob.title, ashbyJob.descriptionPlain);

  // Description (HTML 태그 제거하고 요약본 생성)
  const description = extractDescription(ashbyJob.descriptionPlain || ashbyJob.descriptionHtml);

  // 변환된 Job 객체 반환
  return {
    id: ashbyJob.id,
    title: ashbyJob.title,
    department, // 정규화된 부서명
    originalDepartment: ashbyJob.department, // 원본 부서명 저장 (필터링용)
    experience, // 추론된 경력 수준
    location, // 정규화된 지역명
    originalLocation: ashbyJob.location, // 원본 지역명 저장 (필터링용)
    type, // 변환된 고용 형태
    workType, // 근무 형태
    description, // 요약된 설명
    jobUrl: ashbyJob.jobUrl,
    applyUrl: ashbyJob.applyUrl,
    team: ashbyJob.team, // 팀명 (있는 경우)
    publishedAt: ashbyJob.publishedAt, // 공고 게시일
  };
}

/**
 * Location 문자열을 파싱하여 내부 location 키로 변환하는 함수
 * 
 * @param location - 원본 지역명 문자열
 * @param isRemote - 원격 근무 여부
 * @returns 정규화된 지역명 ("seoul", "busan", "remote", "hybrid")
 * 
 * @description
 * 다양한 형식의 지역명을 표준 형식으로 변환합니다.
 * - 원격 근무는 "remote"로 변환
 * - 서울 관련 지역(서울, 성남, 판교 등)은 "seoul"로 변환
 * - 부산은 "busan"으로 변환
 * - 하이브리드는 "hybrid"로 변환
 * - 기본값은 "seoul"
 */
function parseLocation(location: string, isRemote: boolean): string {
  // 원격 근무인 경우
  if (isRemote) {
    return "remote";
  }

  const locationLower = location.toLowerCase();

  // 서울 관련 지역 (서울, 성남, 판교 등)
  if (locationLower.includes("seoul") || locationLower.includes("서울") || 
      locationLower.includes("성남") || locationLower.includes("seongnam") || 
      locationLower.includes("판교") || locationLower.includes("pangyo")) {
    return "seoul";
  }
  // 부산
  if (locationLower.includes("busan") || locationLower.includes("부산")) {
    return "busan";
  }
  // 하이브리드
  if (locationLower.includes("hybrid")) {
    return "hybrid";
  }

  // 기본값 (매칭 실패 시)
  return "seoul";
}

/**
 * 제목과 설명에서 경력 수준을 추론하는 함수
 * 
 * @param title - 채용 공고 제목
 * @param description - 채용 공고 설명
 * @returns 경력 수준 ("entry", "junior", "mid", "senior")
 * 
 * @description
 * 제목과 설명에서 키워드를 찾아 경력 수준을 추론합니다.
 * 우선순위: senior > mid > junior > entry
 * 키워드가 없으면 제목에 "senior"가 있으면 senior, 아니면 mid를 기본값으로 사용합니다.
 */
function inferExperience(title: string, description: string): string {
  // 제목과 설명을 합쳐서 소문자로 변환 (검색 용이)
  const text = `${title} ${description}`.toLowerCase();

  // Senior 레벨 키워드 검색
  if (text.includes("senior") || text.includes("시니어") || 
      text.includes("5년") || text.includes("5+")) {
    return "senior";
  }
  // Mid 레벨 키워드 검색
  if (text.includes("mid") || text.includes("미들") || 
      text.includes("3-5년")) {
    return "mid";
  }
  // Junior 레벨 키워드 검색
  if (text.includes("junior") || text.includes("주니어") || 
      text.includes("1-3년")) {
    return "junior";
  }
  // Entry 레벨 키워드 검색
  if (text.includes("entry") || text.includes("신입") || 
      text.includes("new grad")) {
    return "entry";
  }

  // 기본값 (키워드가 없을 때)
  // 제목에 "senior"가 있으면 senior, 아니면 mid
  return title.toLowerCase().includes("senior") ? "senior" : "mid";
}

/**
 * 설명에서 HTML 태그를 제거하고 요약을 추출하는 함수
 * 
 * @param description - 원본 설명 (HTML 포함 가능)
 * @returns 정제된 요약 설명 (최대 200자)
 * 
 * @description
 * - HTML 태그를 모두 제거합니다
 * - 연속된 공백을 하나로 합칩니다
 * - 200자를 초과하면 잘라내고 "..."을 추가합니다
 * - 빈 문자열이면 빈 문자열을 반환합니다
 */
function extractDescription(description: string): string {
  if (!description) return "";

  // HTML 태그 제거 (정규식 사용)
  let text = description.replace(/<[^>]*>/g, " ");
  // 여러 공백을 하나로 통합
  text = text.replace(/\s+/g, " ").trim();
  // 첫 200자만 사용 (초과 시 "..." 추가)
  if (text.length > 200) {
    text = text.substring(0, 200) + "...";
  }
  return text;
}

