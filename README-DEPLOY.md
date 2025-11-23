# 배포 가이드

이 문서는 웹서버에 Next.js 애플리케이션을 배포하는 방법을 설명합니다.

## 배포 방법 선택

배포 방법은 서버 환경에 따라 다릅니다:

1. **Node.js 서버 배포** (권장) - Node.js가 설치된 서버
2. **정적 호스팅** - HTML 파일만 제공하는 서버 (Nginx, Apache 등)
3. **클라우드 플랫폼** - Vercel, Netlify 등

---

## 방법 1: Node.js 서버 배포 (권장)

Node.js가 설치된 서버에 배포하는 방법입니다.

### 필요한 파일

서버에 다음 파일과 폴더를 업로드해야 합니다:

```
프로젝트 루트/
├── .next/              # ⭐ 필수: 빌드 결과물
├── public/             # ⭐ 필수: 정적 파일 (이미지, 아이콘 등)
├── node_modules/       # ⭐ 필수: 의존성 패키지
├── package.json        # ⭐ 필수: 프로젝트 설정
├── package-lock.json   # ⭐ 필수: 의존성 버전 고정
├── next.config.ts      # ⭐ 필수: Next.js 설정
├── tsconfig.json       # ⭐ 필수: TypeScript 설정
├── src/                # ⭐ 필수: 소스 코드
│   ├── app/
│   ├── components/
│   ├── dictionaries/
│   ├── lib/
│   └── ...
├── scripts/            # 선택: 빌드 스크립트
└── .env.production     # 선택: 프로덕션 환경 변수
```

### 배포 절차

#### 1. 로컬에서 빌드

```bash
# 프로덕션 빌드
npm run build
```

#### 2. 서버에 파일 업로드

**방법 A: 전체 프로젝트 업로드 (권장)**
- Git을 사용하여 서버에서 클론하거나
- FTP/SFTP로 전체 프로젝트 업로드

**방법 B: 필수 파일만 업로드**
- `.next` 폴더
- `public` 폴더
- `node_modules` 폴더
- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`
- `src` 폴더

#### 3. 서버에서 의존성 설치

```bash
# 서버에 접속 후
npm install --production
```

#### 4. 환경 변수 설정

서버에 `.env.production` 파일 생성:

```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

#### 5. 서버 실행

```bash
# 프로덕션 서버 시작
npm start

# 또는 PM2를 사용하여 백그라운드 실행 (권장)
npm install -g pm2
pm2 start npm --name "company-website" -- start
pm2 save
pm2 startup
```

### 서버 요구사항

- **Node.js**: 18.x 이상
- **포트**: 3000 (또는 환경 변수 `PORT`로 설정)
- **메모리**: 최소 512MB (권장: 1GB 이상)

### Nginx 리버스 프록시 설정 (선택)

Nginx를 앞단에 두고 Next.js 서버를 프록시하는 경우:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 방법 2: 정적 호스팅 (Static Export)

정적 HTML 파일만 제공하는 서버(Nginx, Apache 등)에 배포하는 방법입니다.

### 제한사항

⚠️ **주의**: 정적 export는 다음 기능을 사용할 수 없습니다:
- API 라우트 (`/api/*`)
- 서버 사이드 렌더링 (SSR)
- 동적 라우팅 (일부 제한)
- 이미지 최적화 API

현재 프로젝트는 동적 라우팅(`[lang]`)을 사용하므로, `generateStaticParams`를 통해 모든 경로를 미리 생성해야 합니다.

### 설정 변경

#### 1. `next.config.ts` 수정

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 정적 HTML export 활성화
  images: {
    unoptimized: true,  // 이미지 최적화 비활성화 (정적 호스팅용)
  },
};

export default nextConfig;
```

#### 2. 빌드

```bash
npm run build
```

빌드 후 `out` 폴더가 생성됩니다.

### 필요한 파일

서버에 `out` 폴더의 **모든 내용**을 업로드합니다:

```
out/
├── _next/              # JavaScript, CSS 파일
├── ko/                 # 한국어 페이지
├── en/                 # 영어 페이지
├── sitemap.xml
├── robots.txt
└── ...                 # 기타 정적 파일
```

### 배포 절차

1. 로컬에서 `npm run build` 실행
2. 생성된 `out` 폴더의 모든 내용을 서버의 웹 루트 디렉토리에 업로드
3. 완료!

### Nginx 설정 예시

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

---

## 방법 3: 클라우드 플랫폼 배포

### Vercel (가장 쉬운 방법)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 자동으로 빌드 및 배포됨

**필요한 작업**: 없음 (자동)

### Netlify

1. [Netlify](https://netlify.com)에 가입
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next` (또는 `out` - 정적 export인 경우)

### AWS, Google Cloud, Azure

각 플랫폼의 Next.js 배포 가이드를 참조하세요. 일반적으로:
- Docker 컨테이너로 배포
- 또는 방법 1 (Node.js 서버 배포)과 동일

---

## 배포 전 체크리스트

### 필수 확인 사항

- [ ] `npm run build` 성공 확인
- [ ] 환경 변수 설정 확인 (`.env.production`)
- [ ] `public/og-image.jpg` 파일 존재 확인
- [ ] `public/logo.png` 파일 존재 확인
- [ ] 모든 언어별 페이지 접근 가능 확인
- [ ] sitemap.xml 및 robots.txt 접근 가능 확인

### 성능 확인

- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 최적화 확인
- [ ] 모바일 반응형 확인

### SEO 확인

- [ ] 메타데이터 확인
- [ ] Open Graph 태그 확인
- [ ] 구조화된 데이터 (JSON-LD) 확인

---

## 파일 크기 최적화

배포 시 불필요한 파일을 제외하여 용량을 줄일 수 있습니다:

### 제외할 파일/폴더

- `.git/` - Git 저장소
- `node_modules/.cache/` - 캐시 파일
- `.next/cache/` - 빌드 캐시
- `*.log` - 로그 파일
- `.env.local`, `.env.development` - 개발 환경 변수

### 포함할 파일/폴더

- `.next/` - 빌드 결과물 (필수)
- `public/` - 정적 파일 (필수)
- `node_modules/` - 의존성 (필수)
- `package.json`, `package-lock.json` - 프로젝트 설정 (필수)
- `src/` - 소스 코드 (필수)

---

## 문제 해결

### 빌드 실패

```bash
# 캐시 삭제 후 재빌드
rm -rf .next node_modules
npm install
npm run build
```

### 서버에서 실행 안 됨

1. Node.js 버전 확인: `node --version` (18.x 이상 필요)
2. 포트 충돌 확인: 다른 프로세스가 3000 포트를 사용 중인지 확인
3. 환경 변수 확인: `.env.production` 파일 존재 및 내용 확인

### 정적 파일이 보이지 않음

1. `public` 폴더가 서버에 업로드되었는지 확인
2. 파일 경로가 올바른지 확인 (루트 경로 기준)
3. 서버 설정에서 정적 파일 제공이 활성화되어 있는지 확인

---

## 추가 리소스

- [Next.js 배포 문서](https://nextjs.org/docs/deployment)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [PM2 문서](https://pm2.keymetrics.io/docs/usage/quick-start/)

