/**
 * 빌드 시 public 폴더에 파일을 생성하는 스크립트
 * 
 * 이 스크립트는 npm run build 후 실행되어
 * public 폴더에 빌드 정보 및 기타 필요한 파일을 생성합니다.
 * 
 * 참고: Next.js는 빌드 결과물(HTML, JS)을 .next 폴더에 생성합니다.
 * public 폴더는 정적 파일(이미지, 아이콘 등)을 저장하는 곳입니다.
 * 정적 HTML 파일로 export하려면 next.config.ts에 output: 'export' 설정이 필요합니다.
 */

const fs = require('fs');
const path = require('path');

// public 폴더 경로
const publicDir = path.join(process.cwd(), 'public');

// public 폴더가 없으면 생성
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 빌드 정보 생성
const buildInfo = {
  buildTime: new Date().toISOString(),
  buildTimestamp: Date.now(),
  version: process.env.npm_package_version || '0.1.0',
  nodeVersion: process.version,
  nextVersion: require('next/package.json').version,
};

// build-info.json 파일 생성
const buildInfoPath = path.join(publicDir, 'build-info.json');
fs.writeFileSync(
  buildInfoPath,
  JSON.stringify(buildInfo, null, 2),
  'utf-8'
);

console.log('✅ 빌드 정보 파일 생성 완료:', buildInfoPath);
console.log('   - 빌드 시간:', buildInfo.buildTime);
console.log('   - 버전:', buildInfo.version);

// 추가로 생성할 파일이 있다면 여기에 작성
// 예: 버전 정보 파일
const versionPath = path.join(publicDir, 'version.txt');
fs.writeFileSync(
  versionPath,
  `Version: ${buildInfo.version}\nBuild Time: ${buildInfo.buildTime}\n`,
  'utf-8'
);

console.log('✅ 버전 정보 파일 생성 완료:', versionPath);

// 빌드 결과물 위치 안내
console.log('\n📦 빌드 결과물 위치:');
console.log('   - HTML, JS, CSS 파일: .next 폴더');
console.log('   - 정적 파일 (이미지 등): public 폴더');
console.log('   - 정적 HTML export를 원하면 next.config.ts에 output: "export" 설정 필요');

