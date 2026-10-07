#!/usr/bin/env bash
# 조사 자료를 페이지 데이터 폴더로 복사 (키워드 데이터는 /workspace/biovan/kw/build_insights.py 가 생성)
set -e
R=/workspace/biovan/research; D=src/content/insights
mkdir -p $D/research
cp $R/budgets.json $R/forecasts.json $R/nextgen_tech.json $D/research/
for f in videos.json video_channels.json; do
  if [ -f "$R/$f" ]; then mkdir -p $D/video; cp "$R/$f" $D/video/; echo "video: $f 복사"; fi
done
echo "완료. 이후: npm run build && DEPLOY_TARGET=gh-pages npx astro build --outDir ./dist-gh"
