"use client";

import { useState, useMemo } from "react";
import type { Dictionary } from "@/types/dictionary";
import type { Locale } from "@/i18n-config";
import type { Job } from "@/lib/jobs-api";
import styles from "./page.module.css";

type CareersClientProps = {
  jobs: Job[];
  dictionary: Dictionary["careers"];
  locale: Locale;
};

export default function CareersClient({ jobs, dictionary, locale }: CareersClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  
  // 접힘/펼침 상태
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["department", "worktype", "company", "location"]));
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  // 실제 데이터에서 사용 가능한 필터 옵션 추출
  const availableDepartments = useMemo(() => {
    const deptMap = new Map<string, string[]>(); // 부서명 -> 팀 목록
    jobs.forEach((job) => {
      const dept = job.originalDepartment || job.department;
      if (!deptMap.has(dept)) {
        deptMap.set(dept, []);
      }
      if (job.team) {
        const teams = deptMap.get(dept)!;
        if (!teams.includes(job.team)) {
          teams.push(job.team);
        }
      }
    });
    return Array.from(deptMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [jobs]);

  const availableWorkTypes = useMemo(() => {
    const typeSet = new Set<string>();
    jobs.forEach((job) => {
      if (job.type) {
        typeSet.add(job.type);
      }
    });
    return Array.from(typeSet).sort();
  }, [jobs]);

  const availableLocations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((job) => {
      const loc = job.originalLocation || job.location;
      if (loc) {
        locSet.add(loc);
      }
    });
    return Array.from(locSet).sort();
  }, [jobs]);
  
  // Company 옵션 (항상 두 옵션 제공)
  const availableCompanies = ["company", "company China"];

  // 주요 채용 공고 (최신 5개)
  const featuredJobs = useMemo(() => {
    return jobs
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }, [jobs]);

  // 필터링된 채용 공고
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = `${job.title} ${job.description} ${job.team || ""}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // 부서 필터 (다중 선택)
      if (selectedDepartments.size > 0) {
        const jobDept = job.originalDepartment || job.department;
        if (!selectedDepartments.has(jobDept)) {
          return false;
        }
      }

      // 근무 형태 필터 (다중 선택)
      if (selectedWorkTypes.size > 0) {
        if (!selectedWorkTypes.has(job.type)) {
          return false;
        }
      }

      // 지역 필터 (다중 선택)
      if (selectedLocations.size > 0) {
        const jobLoc = job.originalLocation || job.location;
        if (!selectedLocations.has(jobLoc)) {
          return false;
        }
      }

      // 회사 필터 (다중 선택)
      if (selectedCompanies.size > 0) {
        const jobLoc = (job.originalLocation || job.location).toLowerCase();
        const isShanghai = jobLoc.includes("shanghai") || jobLoc.includes("상하이") || jobLoc.includes("shanghai, china");
        const jobCompany = isShanghai ? "company China" : "company";
        if (!selectedCompanies.has(jobCompany)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchQuery, selectedDepartments, selectedWorkTypes, selectedLocations, selectedCompanies]);

  // 부서별로 그룹화
  const jobsByDepartment = useMemo(() => {
    const grouped: Record<string, Job[]> = {};
    filteredJobs.forEach((job) => {
      const dept = job.originalDepartment || job.department;
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
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
