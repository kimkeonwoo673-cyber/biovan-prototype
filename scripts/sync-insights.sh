#!/usr/bin/env bash
# 조사 자료를 페이지 데이터 폴더로 복사 (키워드 데이터는 /workspace/biovan/kw/build_insights.py 가 생성)
set -e
R=/workspace/biovan/research; D=src/content/insights
mkdir -p $D/research
cp $R/budgets.json $R/forecasts.json $R/nextgen_tech.json $D/research/
[ -f $R/algae_competitors.json ] && cp $R/algae_competitors.json $D/research/
python3 /workspace/biovan/kw/build_budget_yearly.py >/dev/null && echo "budget_yearly.json 생성"
# 영상 자료는 WITH_VIDEO=1 일 때만 복사(영상 탭 작업은 별도 담당)
if [ "${WITH_VIDEO:-0}" = 1 ]; then
  for f in videos.json video_channels.json; do
    if [ -f "$R/$f" ]; then mkdir -p $D/video; cp "$R/$f" $D/video/; echo "video: $f 복사"; fi
  done
fi
echo "완료. 이후: npm run build && DEPLOY_TARGET=gh-pages npx astro build --outDir ./dist-gh"
