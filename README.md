# 바이오밴코리아 저용량 시안 (Astro 정적 사이트, WordPress 미사용)

## 실행
- 빌드: `npm run build` → `dist/` (순수 HTML/CSS/JS, 카페24 `/www`에 FTP 업로드 가능)
- 미리보기 서버(현재 실행 중): `python3 -m http.server 8787 --directory dist` → http://localhost:8787
- 스크린샷: `node scripts/shots.mjs` (screens/)

## 콘텐츠 수정 위치
| 무엇 | 파일 |
|---|---|
| 프로젝트(현장) 1건 = 파일 1개 | `src/content/projects/*.md` (frontmatter: 제목·기간·위치·지역·분야·좌표·youtube·beforeAfter·thumb) |
| 핵심 수치 카운터 | `src/data/stats.json` (`placeholder: true` = 수치 입력 필요) |
| 연혁 | `src/data/history.json` |
| 보도자료·공지 | `src/data/news.json` |
| 영상(YouTube ID) | `src/data/videos.json`, 미연결 목록 `videos_pending.json` |
| 회사 정보(주소·전화·메일) | `src/data/site.json` ← **TODO: 주소 확정** |
| 수질 차트(현재 예시 데이터) | `src/components/WQChart.astro` |
| 지도 | `scripts/make_map.py` → `public/img/korea.svg` (KOSTAT 2013 단순화 경계) |

## 출처 원칙
- 회사 사실은 기존 사이트 수집본(2026-10-07)에서만 가져옴. 확인 안 된 값은 노란 `.ph` 표시.
- 수질 차트는 **예시 데이터**(실제 측정값 아님).
- 이미지는 기존 사이트의 유효 이미지 중 BWAT-21 설치 사진 1장(WebP 37KB)만 사용. 나머지는 SVG/CSS.

## GitHub Pages 시안 배포
- `DEPLOY_TARGET=gh-pages npx astro build --outDir ./dist-gh` → base `/biovan-prototype` 로 빌드
- `dist-gh/` 내용을 `gh-pages` 브랜치에 푸시(.nojekyll 포함) → https://kimkeonwoo673-cyber.github.io/biovan-prototype/
- 내부 링크/이미지는 `src/lib/url.ts`의 `u()` 헬퍼로 base 경로를 붙임. 기본 `npm run build`는 루트(/) 기준(카페24용) 그대로.
