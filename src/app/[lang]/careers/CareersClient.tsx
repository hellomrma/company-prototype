/**
 * 채용 페이지 클라이언트 컴포넌트
 * 
 * 채용 공고 목록을 표시하고 필터링 기능을 제공합니다.
 * - 검색 기능
 * - 부서별 필터
 * - 근무 형태 필터
 * - 지역 필터
 * - 회사 필터
 * - 주요 채용 공고 섹션
 * - 부서별 그룹화된 채용 공고 목록
 * 
 * 클라이언트 컴포넌트로, 사용자 인터랙션과 필터링 상태 관리를 위해 필요합니다.
 */

"use client";

import { useState, useMemo } from "react";
import type { Dictionary } from "@/types/dictionary";
import type { Locale } from "@/i18n-config";
import type { Job } from "@/lib/jobs-api";
import styles from "./page.module.scss";

/**
 * CareersClient 컴포넌트 Props 타입
 */
type CareersClientProps = {
  jobs: Job[]; // 채용 공고 배열
  dictionary: Dictionary["careers"]; // 채용 관련 다국어 딕셔너리
  locale: Locale; // 현재 언어 코드
};

/**
 * 채용 페이지 클라이언트 컴포넌트
 * 
 * @param jobs - 채용 공고 배열
 * @param dictionary - 채용 관련 다국어 딕셔너리
 * @param locale - 현재 언어 코드
 * @returns 채용 페이지 JSX
 * 
 * @description
 * - 서버에서 받은 채용 공고를 필터링하여 표시
 * - 다양한 필터 옵션 제공 (검색, 부서, 근무 형태, 지역, 회사)
 * - 주요 채용 공고 섹션 (최신 5개)
 * - 부서별로 그룹화된 채용 공고 목록
 */
export default function CareersClient({ jobs, dictionary, locale }: CareersClientProps) {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>("");
  // 선택된 부서들 (다중 선택)
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  // 선택된 근무 형태들 (다중 선택)
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<Set<string>>(new Set());
  // 선택된 지역들 (다중 선택)
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  // 선택된 회사들 (다중 선택)
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  
  // 필터 섹션 접힘/펼침 상태
  // 기본적으로 모든 섹션이 펼쳐진 상태
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["department", "worktype", "company", "location"]));
  // 부서별 팀 목록 접힘/펼침 상태
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  // 실제 데이터에서 사용 가능한 필터 옵션 추출 (메모이제이션)
  
  /**
   * 사용 가능한 부서 목록 추출
   * 
   * 채용 공고에서 부서와 팀 정보를 추출하여 구조화합니다.
   * 부서별로 팀 목록을 그룹화합니다.
   */
  const availableDepartments = useMemo(() => {
    const deptMap = new Map<string, string[]>(); // 부서명 -> 팀 목록 맵
    jobs.forEach((job) => {
      // 원본 부서명 사용 (없으면 정규화된 부서명)
      const dept = job.originalDepartment || job.department;
      // 부서가 맵에 없으면 추가
      if (!deptMap.has(dept)) {
        deptMap.set(dept, []);
      }
      // 팀 정보가 있으면 부서의 팀 목록에 추가
      if (job.team) {
        const teams = deptMap.get(dept)!;
        if (!teams.includes(job.team)) {
          teams.push(job.team);
        }
      }
    });
    // 부서명으로 정렬하여 반환
    return Array.from(deptMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [jobs]);

  /**
   * 사용 가능한 근무 형태 목록 추출
   */
  const availableWorkTypes = useMemo(() => {
    const typeSet = new Set<string>();
    jobs.forEach((job) => {
      if (job.type) {
        typeSet.add(job.type);
      }
    });
    return Array.from(typeSet).sort();
  }, [jobs]);

  /**
   * 사용 가능한 지역 목록 추출
   */
  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((job) => {
      // 원본 지역명 사용 (없으면 정규화된 지역명)
      const loc = job.originalLocation || job.location;
      if (loc) {
        locSet.add(loc);
      }
    });
    return Array.from(locSet).sort();
  }, [jobs]);
  
  /**
   * 사용 가능한 회사 옵션
   * 항상 두 옵션을 제공합니다 (company, company China)
   */
  const availableCompanies = ["company", "company China"];

  /**
   * 주요 채용 공고 (최신 5개)
   * 
   * 게시일 기준으로 정렬하여 최신 공고 5개를 반환합니다.
   */
  const featuredJobs = useMemo(() => {
    return jobs
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) // 최신순 정렬
      .slice(0, 5); // 상위 5개만
  }, [jobs]);

  /**
   * 필터링된 채용 공고
   * 
   * 모든 필터 조건을 만족하는 채용 공고만 반환합니다.
   * 메모이제이션을 사용하여 필터 조건이 변경될 때만 재계산합니다.
   */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 검색 필터: 제목, 설명, 팀명에서 검색어 포함 여부 확인
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = `${job.title} ${job.description} ${job.team || ""}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false; // 검색어가 없으면 제외
        }
      }

      // 부서 필터 (다중 선택)
      // 선택된 부서가 있으면 해당 부서의 공고만 표시
      if (selectedDepartments.size > 0) {
        const jobDept = job.originalDepartment || job.department;
        if (!selectedDepartments.has(jobDept)) {
          return false; // 선택된 부서에 없으면 제외
        }
      }

      // 근무 형태 필터 (다중 선택)
      if (selectedWorkTypes.size > 0) {
        if (!selectedWorkTypes.has(job.type)) {
          return false; // 선택된 근무 형태에 없으면 제외
        }
      }

      // 지역 필터 (다중 선택)
      if (selectedLocations.size > 0) {
        const jobLoc = job.originalLocation || job.location;
        if (!selectedLocations.has(jobLoc)) {
          return false; // 선택된 지역에 없으면 제외
        }
      }

      // 회사 필터 (다중 선택)
      // 지역명을 기반으로 회사를 판단 (상하이면 company China, 아니면 company)
      if (selectedCompanies.size > 0) {
        const jobLoc = (job.originalLocation || job.location).toLowerCase();
        const isShanghai = jobLoc.includes("shanghai") || jobLoc.includes("상하이") || jobLoc.includes("shanghai, china");
        const jobCompany = isShanghai ? "company China" : "company";
        if (!selectedCompanies.has(jobCompany)) {
          return false; // 선택된 회사에 없으면 제외
        }
      }

      // 모든 필터 조건을 통과하면 포함
      return true;
    });
  }, [jobs, searchQuery, selectedDepartments, selectedWorkTypes, selectedLocations, selectedCompanies]);

  /**
   * 부서별로 그룹화된 채용 공고
   * 
   * 필터링된 채용 공고를 부서별로 그룹화합니다.
   * UI에서 부서별 섹션으로 표시하기 위해 사용됩니다.
   */
  const jobsByDepartment = useMemo(() => {
    const grouped: Record<string, Job[]> = {};
    filteredJobs.forEach((job) => {
      const dept = job.originalDepartment || job.department;
      // 부서가 그룹에 없으면 추가
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      // 부서 그룹에 공고 추가
      grouped[dept].push(job);
    });
    return grouped;
  }, [filteredJobs]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDepartments(new Set());
    setSelectedWorkTypes(new Set());
    setSelectedLocations(new Set());
    setSelectedCompanies(new Set());
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleDepartment = (dept: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(dept)) {
      newExpanded.delete(dept);
    } else {
      newExpanded.add(dept);
    }
    setExpandedDepartments(newExpanded);
  };

  const toggleDepartmentFilter = (dept: string) => {
    const newSelected = new Set(selectedDepartments);
    if (newSelected.has(dept)) {
      newSelected.delete(dept);
    } else {
      newSelected.add(dept);
    }
    setSelectedDepartments(newSelected);
  };

  const toggleWorkTypeFilter = (type: string) => {
    const newSelected = new Set(selectedWorkTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedWorkTypes(newSelected);
  };

  const toggleLocationFilter = (loc: string) => {
    const newSelected = new Set(selectedLocations);
    if (newSelected.has(loc)) {
      newSelected.delete(loc);
    } else {
      newSelected.add(loc);
    }
    setSelectedLocations(newSelected);
  };

  const toggleCompanyFilter = (company: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(company)) {
      newSelected.delete(company);
    } else {
      newSelected.add(company);
    }
    setSelectedCompanies(newSelected);
  };

  const getDepartmentLabel = (key: string) => {
    const deptMap: Record<string, keyof typeof dictionary.departments> = {
      engineering: "engineering",
      ai: "ai",
      product: "product",
      design: "design",
      business: "business",
      operations: "operations",
    };
    
    const mapped = deptMap[key.toLowerCase()];
    if (mapped) {
      return dictionary.departments[mapped];
    }
    
    return key;
  };

  const getLocationLabel = (key: string) => {
    // 원본 지역명이면 그대로 반환
    if (key.includes(",") || key.length > 10) {
      return key;
    }
    
    const locMap: Record<string, keyof typeof dictionary.locations> = {
      seoul: "seoul",
      busan: "busan",
      remote: "remote",
      hybrid: "hybrid",
    };
    return dictionary.locations[locMap[key] || "seoul"];
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, keyof typeof dictionary.jobList> = {
      fullTime: "fullTime",
      contract: "contract",
      intern: "intern",
    };
    return dictionary.jobList[typeMap[type] || "fullTime"];
  };

  return (
    <>
      {/* 주요 채용 공고 섹션 */}
      {featuredJobs.length > 0 && (
        <section className={styles.featuredSection}>
          <h2 className={styles.featuredTitle}>{dictionary.featuredJobs.title}</h2>
          <div className={styles.featuredList}>
            {featuredJobs.map((job) => (
              <a
                key={job.id}
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.featuredJob}
              >
                <span className={styles.featuredJobTitle}>{job.title}</span>
                <span className={styles.featuredJobLocation}>
                  {job.originalLocation || getLocationLabel(job.location)}
                </span>
                <span className={styles.featuredJobArrow}>→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 전체 채용 공고 섹션 */}
      <section className={styles.allJobsSection}>
        <h2 className={styles.allJobsTitle}>{dictionary.jobList.title}</h2>
        
        <div className={styles.careersWrapper}>
          {/* Filters Sidebar */}
          <aside className={styles.filtersSidebar}>
            {/* Search Filter */}
            <div className={styles.filterGroup}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  placeholder={dictionary.filters.searchPlaceholder}
                  aria-label={dictionary.filters.search}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>
            </div>

            {/* Department Filter - Accordion */}
            <div className={styles.filterAccordion}>
              <button
                className={styles.filterAccordionHeader}
                onClick={() => toggleSection("department")}
                {...(expandedSections.has("department") ? { "aria-expanded": true } : { "aria-expanded": false })}
              >
                <span>{dictionary.filters.department}</span>
                <span className={styles.accordionIcon}>
                  {expandedSections.has("department") ? "▲" : "▼"}
                </span>
              </button>
              {expandedSections.has("department") && (
                <div className={styles.filterAccordionContent}>
                  {availableDepartments.map(([dept, teams]) => (
                    <div key={dept} className={styles.departmentItem}>
                      <button
                        className={styles.departmentHeader}
                        onClick={() => teams.length > 0 && toggleDepartment(dept)}
                        disabled={teams.length === 0}
                      >
                        <span className={styles.departmentName}>{dept}</span>
                        {teams.length > 0 && (
                          <span className={styles.accordionIcon}>
                            {expandedDepartments.has(dept) ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                      {teams.length > 0 && expandedDepartments.has(dept) && (
                        <div className={styles.teamList}>
                          {teams.map((team) => (
                            <div key={team} className={styles.filterCheckbox}>
                              <input
                                type="checkbox"
                                id={`team-${team}`}
                                checked={selectedDepartments.has(team)}
                                onChange={() => toggleDepartmentFilter(team)}
                              />
                              <label htmlFor={`team-${team}`}>{team}</label>
                            </div>
                          ))}
                          {/* 부서 전체 선택 옵션 (팀이 있는 경우에만) */}
                          <div className={styles.filterCheckbox}>
                            <input
                              type="checkbox"
                              id={`dept-${dept}`}
                              checked={selectedDepartments.has(dept)}
                              onChange={() => toggleDepartmentFilter(dept)}
                            />
                            <label htmlFor={`dept-${dept}`}>{dept}</label>
                          </div>
                        </div>
                      )}
                      {/* 팀이 없는 경우에만 부서명 체크박스 표시 */}
                      {teams.length === 0 && (
                        <div className={styles.filterCheckbox}>
                          <input
                            type="checkbox"
                            id={`dept-${dept}`}
                            checked={selectedDepartments.has(dept)}
                            onChange={() => toggleDepartmentFilter(dept)}
                          />
                          <label htmlFor={`dept-${dept}`}>{dept}</label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Worktype Filter - Accordion */}
            <div className={styles.filterAccordion}>
              <button
                className={styles.filterAccordionHeader}
                onClick={() => toggleSection("worktype")}
                {...(expandedSections.has("worktype") ? { "aria-expanded": true } : { "aria-expanded": false })}
              >
                <span>Worktype</span>
                <span className={styles.accordionIcon}>
                  {expandedSections.has("worktype") ? "▲" : "▼"}
                </span>
              </button>
              {expandedSections.has("worktype") && (
                <div className={styles.filterAccordionContent}>
                  {availableWorkTypes.map((type) => (
                    <div key={type} className={styles.filterCheckbox}>
                      <input
                        type="checkbox"
                        id={`worktype-${type}`}
                        checked={selectedWorkTypes.has(type)}
                        onChange={() => toggleWorkTypeFilter(type)}
                      />
                      <label htmlFor={`worktype-${type}`}>{getTypeLabel(type)}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Company Filter - Accordion */}
            <div className={styles.filterAccordion}>
              <button
                className={styles.filterAccordionHeader}
                onClick={() => toggleSection("company")}
                {...(expandedSections.has("company") ? { "aria-expanded": true } : { "aria-expanded": false })}
              >
                <span>Company</span>
                <span className={styles.accordionIcon}>
                  {expandedSections.has("company") ? "▲" : "▼"}
                </span>
              </button>
              {expandedSections.has("company") && (
                <div className={styles.filterAccordionContent}>
                  {availableCompanies.map((company) => (
                    <div key={company} className={styles.filterCheckbox}>
                      <input
                        type="checkbox"
                        id={`company-${company}`}
                        checked={selectedCompanies.has(company)}
                        onChange={() => toggleCompanyFilter(company)}
                      />
                      <label htmlFor={`company-${company}`}>{company}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter - Accordion */}
            <div className={styles.filterAccordion}>
              <button
                className={styles.filterAccordionHeader}
                onClick={() => toggleSection("location")}
                {...(expandedSections.has("location") ? { "aria-expanded": true } : { "aria-expanded": false })}
              >
                <span>{dictionary.filters.location}</span>
                <span className={styles.accordionIcon}>
                  {expandedSections.has("location") ? "▲" : "▼"}
                </span>
              </button>
              {expandedSections.has("location") && (
                <div className={styles.filterAccordionContent}>
                  {availableLocations.map((loc) => (
                    <div key={loc} className={styles.filterCheckbox}>
                      <input
                        type="checkbox"
                        id={`location-${loc}`}
                        checked={selectedLocations.has(loc)}
                        onChange={() => toggleLocationFilter(loc)}
                      />
                      <label htmlFor={`location-${loc}`}>{loc}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Job List - 부서별 그룹화 */}
          <div className={styles.jobListSection}>
            {Object.keys(jobsByDepartment).length === 0 ? (
              <div className={styles.noResults}>
                <p>{dictionary.jobList.noResults}</p>
              </div>
            ) : (
              Object.entries(jobsByDepartment).map(([department, departmentJobs]) => (
                <div key={department} className={styles.departmentGroup}>
                  <h3 className={styles.departmentTitle}>{department}</h3>
                  <div className={styles.jobList} role="list">
                    {departmentJobs.map((job) => (
                      <a
                        key={job.id}
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.jobCard}
                        role="listitem"
                      >
                        <div className={styles.jobHeader}>
                          <h4 className={styles.jobTitle}>{job.title}</h4>
                          <div className={styles.jobBadges}>
                            <span className={styles.jobBadge}>{getTypeLabel(job.type)}</span>
                          </div>
                        </div>
                        <div className={styles.jobFooter}>
                          <span className={styles.jobLocation}>
                            {job.originalLocation || getLocationLabel(job.location)}
                          </span>
                          <span className={styles.jobArrow}>→</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
