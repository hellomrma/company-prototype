# Company Prototype

Company 회사 프로토타입 웹사이트입니다. Next.js 16과 React 19를 기반으로 구축된 다국어 지원 웹사이트입니다.

## 기술 스택

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **다국어 지원**: 한국어(ko), 영어(en)
- **스타일링**: CSS Modules
- **슬라이더**: Swiper 12.0.3

## 주요 기능

- 🌐 다국어 지원 (한국어/영어)
- 📱 반응형 디자인
- 🔍 SEO 최적화 (sitemap.xml, robots.txt, 메타데이터)
- 🎨 모던한 UI/UX
- 📍 지점별 위치 정보 (서울, 상하이)
- 💼 채용 정보 페이지
- 🛡️ 보안 헤더 설정

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── [lang]/            # 다국어 라우팅
│   │   ├── about/         # 회사 소개
│   │   ├── careers/       # 채용 정보
│   │   ├── contact/       # 문의하기
│   │   ├── location/      # 지점 정보
│   │   ├── services/      # 서비스 소개
│   │   └── page.tsx       # 홈페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── robots.ts          # robots.txt 생성
│   └── sitemap.ts         # sitemap.xml 생성
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   └── layout/           # 레이아웃 컴포넌트 (Header, Footer)
├── dictionaries/         # 다국어 번역 파일
│   ├── ko.json          # 한국어
│   └── en.json          # 영어
├── lib/                  # 유틸리티 함수
│   ├── metadata.ts      # 메타데이터 생성
│   └── jobs-api.ts      # 채용 정보 API
├── types/               # TypeScript 타입 정의
├── i18n-config.ts       # 다국어 설정
└── middleware.ts        # 미들웨어 (다국어 라우팅, 보안 헤더)
```

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm, yarn, pnpm 또는 bun

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 린트

```bash
npm run lint
```

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_BASE_URL=https://company.ai
```

## 다국어 지원

- 기본 언어: 한국어 (ko)
- 지원 언어: 한국어 (ko), 영어 (en)
- URL 구조: `/{lang}/...` (예: `/ko/about`, `/en/about`)
- 언어 자동 감지: 브라우저 설정 기반

## 정적 파일

다음 파일들을 `public` 폴더에 추가해야 합니다:

- `/og-image.jpg` - Open Graph 이미지 (1200x630 권장)
- `/logo.png` - 로고 이미지

## 배포

### Vercel 배포

가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new)을 사용하는 것입니다:

1. GitHub 저장소를 Vercel에 연결
2. 자동으로 빌드 및 배포됩니다

### 다른 플랫폼

```bash
# 빌드
npm run build

# 빌드 결과물은 .next 폴더에 생성됩니다
```

## 추가 정보

빌드 및 파일 구조에 대한 자세한 내용은 [README-BUILD.md](./README-BUILD.md)를 참조하세요.

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
