# Next.js 빌드 및 파일 구조 설명

## 빌드 결과물 위치

### 1. `.next` 폴더
- Next.js가 빌드 시 생성하는 **모든 빌드 결과물**이 저장됩니다
- 이 폴더는 `.gitignore`에 포함되어 있어 Git에 커밋하지 않습니다
- 빌드된 HTML, JavaScript, CSS 파일들이 여기에 저장됩니다
- 프로덕션 빌드 후 이 폴더의 내용을 서버에 배포합니다
- **빌드된 HTML, JS 파일은 이 폴더에 있습니다** (public 폴더가 아닙니다)

### 2. `public` 폴더
- **수동으로 추가하는 정적 파일**을 저장하는 곳입니다
- 빌드 시 `public` 폴더의 모든 파일이 그대로 복사되어 루트 경로에서 접근 가능합니다
- 예: `public/logo.png` → `https://yoursite.com/logo.png`
- 이미지, 아이콘, 기타 정적 자산을 여기에 배치합니다
- **빌드된 HTML, JS 파일은 여기에 생성되지 않습니다**

### 3. 자동 생성되는 파일들

#### `sitemap.ts` → `/sitemap.xml`
- `src/app/sitemap.ts` 파일이 있으면 빌드 시 자동으로 `/sitemap.xml` 생성
- `.next` 폴더 내부에 생성되며, 런타임에 동적으로 제공됩니다
- `public` 폴더에 생성되지 않습니다
- SEO를 위한 사이트맵을 자동으로 생성합니다

#### `robots.ts` → `/robots.txt`
- `src/app/robots.ts` 파일이 있으면 빌드 시 자동으로 `/robots.txt` 생성
- `.next` 폴더 내부에 생성되며, 런타임에 동적으로 제공됩니다
- `public` 폴더에 생성되지 않습니다
- 검색 엔진 크롤러를 위한 robots.txt를 자동으로 생성합니다

## 빌드 프로세스

### 개발 모드 (`npm run dev`)
- 개발 서버가 실행되며 핫 리로드가 지원됩니다
- `.next` 폴더가 생성되지만 최적화되지 않은 상태입니다
- TypeScript 타입 체크가 실행됩니다

### 프로덕션 빌드 (`npm run build`)
1. TypeScript 컴파일
2. 페이지 및 컴포넌트 최적화
3. 정적 페이지 생성 (가능한 경우)
4. 번들 최적화 및 코드 스플리팅
5. `.next` 폴더에 최적화된 빌드 결과물 생성
6. `postbuild` 스크립트 실행 (빌드 정보 파일 생성)

### 프로덕션 서버 (`npm start`)
- 빌드된 `.next` 폴더의 내용을 서버로 실행합니다
- 프로덕션 환경에서 사용합니다

## 빌드 후 확인 방법

빌드가 성공하면:
1. `.next` 폴더가 생성/업데이트됩니다
2. 개발 서버 실행 시 `http://localhost:3000/sitemap.xml` 접근 가능
3. 개발 서버 실행 시 `http://localhost:3000/robots.txt` 접근 가능
4. 각 언어별 페이지가 생성됩니다:
   - `/ko` - 한국어 홈페이지
   - `/en` - 영어 홈페이지
   - `/ko/about`, `/en/about` - 회사 소개
   - `/ko/services`, `/en/services` - 서비스
   - `/ko/careers`, `/en/careers` - 채용 정보
   - `/ko/location`, `/en/location` - 지점 정보

## 빌드된 파일 위치

### HTML, JavaScript, CSS 파일
- **위치**: `.next` 폴더
- **구조**:
  - `.next/static/chunks/` - JavaScript 번들 파일
  - `.next/static/chunks/*.css` - CSS 파일
  - `.next/server/app/` - 서버 사이드 렌더링 파일
- **접근**: Next.js 서버를 통해 제공됩니다 (`npm start`)

### 정적 HTML Export (선택사항)
정적 HTML 파일로 export하려면 `next.config.ts`에 다음 설정을 추가하세요:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // 주의: 이 설정은 서버 사이드 기능을 사용할 수 없게 만듭니다
  // API 라우트, 동적 라우팅 등이 제한될 수 있습니다
};
```

이렇게 설정하면 빌드 후 `out` 폴더에 정적 HTML 파일이 생성됩니다.

## `public` 폴더에 추가해야 할 파일들

현재 프로젝트에서 메타데이터에 언급된 파일들:
- `/og-image.jpg` - Open Graph 이미지 (1200x630 권장)
  - 소셜 미디어 공유 시 표시되는 이미지
  - Facebook, Twitter, LinkedIn 등에서 사용
- `/logo.png` - 로고 이미지
  - 메타데이터 및 구조화된 데이터에서 사용
  - Schema.org Organization 마크업에 포함

이 파일들을 수동으로 `public` 폴더에 추가해야 합니다.

## 빌드 최적화

### 자동 최적화 기능
- **이미지 최적화**: `next/image` 컴포넌트 사용 시 자동 최적화
- **폰트 최적화**: `next/font`를 통한 폰트 최적화
- **코드 스플리팅**: 페이지별 자동 코드 분할
- **정적 생성**: 가능한 페이지는 빌드 시 정적으로 생성

### 성능 최적화
- CSS Modules를 사용한 스타일 최적화
- 불필요한 JavaScript 번들 제거
- 트리 쉐이킹을 통한 번들 크기 최소화

## 배포 전 체크리스트

- [ ] `.env.local` 파일에 `NEXT_PUBLIC_BASE_URL` 설정 확인
- [ ] `public/og-image.jpg` 파일 추가 확인
- [ ] `public/logo.png` 파일 추가 확인
- [ ] `npm run build` 성공 확인
- [ ] `npm start`로 프로덕션 서버 정상 작동 확인
- [ ] 모든 언어별 페이지 접근 가능 확인
- [ ] sitemap.xml 및 robots.txt 접근 가능 확인
- [ ] 메타데이터 및 Open Graph 태그 확인

## 문제 해결

### 빌드 실패 시
1. `node_modules` 삭제 후 `npm install` 재실행
2. `.next` 폴더 삭제 후 재빌드
3. TypeScript 오류 확인 (`npm run lint`)
4. 환경 변수 설정 확인

### 정적 파일이 보이지 않을 때
- 파일이 `public` 폴더에 있는지 확인
- 파일 경로가 올바른지 확인 (루트 경로 기준)
- 브라우저 캐시 삭제 후 재시도

### 빌드된 HTML, JS 파일을 찾을 때
- `.next` 폴더를 확인하세요
- `public` 폴더가 아닙니다
- 정적 HTML export를 원하면 `next.config.ts`에 `output: 'export'` 설정 필요
