// Ashby API 응답 타입 정의
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

export type AshbyApiResponse = {
  jobs: AshbyJob[];
  apiVersion: string;
};

// 내부 Job 타입 (UI에서 사용)
export type Job = {
  id: string;
  title: string;
  department: string;
  originalDepartment?: string; // 원본 부서명 (필터용)
  experience: string; // 추론 또는 기본값
  location: string;
  originalLocation?: string; // 원본 지역명 (필터용)
  type: string;
  workType: string;
  description: string;
  jobUrl: string;
  applyUrl: string;
  team?: string;
  publishedAt: string;
};

/**
 * Ashby API에서 채용 공고를 가져옵니다.
 */
export async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch("https://api.ashbyhq.com/posting-api/job-board/company", {
      next: {
        revalidate: 3600, // 1시간마다 재검증
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const data: AshbyApiResponse = await response.json();

    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error("잘못된 API 응답 형식");
    }

    // isListed가 true인 공고만 필터링하고 변환
    return data.jobs
      .filter((job) => job.isListed)
      .map((job) => transformJob(job));
  } catch (error) {
    // 프로덕션 환경에서는 로깅 시스템으로 대체 권장
    if (process.env.NODE_ENV === "development") {
      console.error("채용 공고를 가져오는 중 오류 발생:", error);
    }
    return [];
  }
}

/**
 * Ashby API의 Job을 내부 Job 타입으로 변환합니다.
 */
function transformJob(ashbyJob: AshbyJob): Job {
  // Department 매핑 (대소문자 무시하고 매핑)
  const departmentUpper = ashbyJob.department.toUpperCase().trim();
  const departmentMap: Record<string, string> = {
    ENGINEERING: "engineering",
    "AI": "ai",
    "AI/ML": "ai",
    "AIML": "ai",
    PRODUCT: "product",
    DESIGN: "design",
    BUSINESS: "business",
    OPERATIONS: "operations",
    SALES: "business",
    MARKETING: "business",
  };

  // 정확한 매칭 시도
  let department = departmentMap[departmentUpper];
  
  // 매칭 실패 시 부분 매칭 시도
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
      department = "engineering"; // 기본값
    }
  }

  // Location 파싱 (원본도 저장)
  const location = parseLocation(ashbyJob.location, ashbyJob.isRemote);

  // Employment Type 변환
  const typeMap: Record<string, string> = {
    FullTime: "fullTime",
    Contract: "contract",
    Intern: "intern",
    PartTime: "contract",
  };
  const type = typeMap[ashbyJob.employmentType] || "fullTime";

  // Work Type 결정
  const workType = ashbyJob.isRemote ? "remote" : "hybrid";

  // Experience 추론 (제목이나 설명에서 추론하거나 기본값 사용)
  const experience = inferExperience(ashbyJob.title, ashbyJob.descriptionPlain);

  // Description (HTML 태그 제거하고 일부만 사용)
  const description = extractDescription(ashbyJob.descriptionPlain || ashbyJob.descriptionHtml);

  return {
    id: ashbyJob.id,
    title: ashbyJob.title,
    department,
    originalDepartment: ashbyJob.department, // 원본 부서명 저장
    experience,
    location,
    originalLocation: ashbyJob.location, // 원본 지역명 저장
    type,
    workType,
    description,
    jobUrl: ashbyJob.jobUrl,
    applyUrl: ashbyJob.applyUrl,
    team: ashbyJob.team,
    publishedAt: ashbyJob.publishedAt,
  };
}

/**
 * Location 문자열을 파싱하여 내부 location 키로 변환합니다.
 */
function parseLocation(location: string, isRemote: boolean): string {
  if (isRemote) {
    return "remote";
  }

  const locationLower = location.toLowerCase();

  if (locationLower.includes("seoul") || locationLower.includes("서울") || locationLower.includes("성남") || locationLower.includes("seongnam") || locationLower.includes("판교") || locationLower.includes("pangyo")) {
    return "seoul";
  }
  if (locationLower.includes("busan") || locationLower.includes("부산")) {
    return "busan";
  }
  if (locationLower.includes("hybrid")) {
    return "hybrid";
  }

  // 기본값
  return "seoul";
}

/**
 * 제목과 설명에서 경력을 추론합니다.
 */
function inferExperience(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("senior") || text.includes("시니어") || text.includes("5년") || text.includes("5+")) {
    return "senior";
  }
  if (text.includes("mid") || text.includes("미들") || text.includes("3-5년")) {
    return "mid";
  }
  if (text.includes("junior") || text.includes("주니어") || text.includes("1-3년")) {
    return "junior";
  }
  if (text.includes("entry") || text.includes("신입") || text.includes("new grad")) {
    return "entry";
  }

  // 기본값 (제목에 "senior"가 있으면 senior, 아니면 mid)
  return title.toLowerCase().includes("senior") ? "senior" : "mid";
}

/**
 * 설명에서 HTML 태그를 제거하고 요약을 추출합니다.
 */
function extractDescription(description: string): string {
  if (!description) return "";

  // HTML 태그 제거
  let text = description.replace(/<[^>]*>/g, " ");
  // 여러 공백을 하나로
  text = text.replace(/\s+/g, " ").trim();
  // 첫 200자만 사용
  if (text.length > 200) {
    text = text.substring(0, 200) + "...";
  }
  return text;
}

