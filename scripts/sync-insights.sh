#!/usr/bin/env bash
# 조사 자료를 페이지 데이터 폴더로 복사 (키워드 데이터는 /workspace/biovan/kw/build_insights.py 가 생성)
set -e
R=/workspace/biovan/research; D=src/content/insights
mkdir -p $D/research
cp $R/budgets.json $R/forecasts.json $R/nextgen_tech.json $D/research/
[ -f $R/algae_competitors.json ] && cp $R/algae_competitors.json $D/research/
python3 /workspace/biovan/kw/build_budget_yearly.py >/dev/null && echo "budget_yearly.json 생성"
# 영상 탭: 원자료(6,545건)는 넣지 않고 경량 요약(video_tab.json, ~40KB)만 생성
[ -f $R/video/analysis.json ] && python3 /workspace/biovan/kw/build_video_tab.py >/dev/null && echo "video_tab.json 생성"
# 표시용 USD 정규화(view.json): 환율표·예산·전망·업체 매출 등
python3 /workspace/biovan/kw/build_view.py >/dev/null && echo "view.json 생성"
echo "완료. 이후: npm run build && DEPLOY_TARGET=gh-pages npx astro build --outDir ./dist-gh"
