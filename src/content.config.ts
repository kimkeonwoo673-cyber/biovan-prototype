import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 포트폴리오: src/content/projects/*.md 한 파일 = 현장 1건
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    no: z.number(),                       // 기존 게시판 번호(정렬용)
    title: z.string(),
    posted: z.string(),                   // 게시일 YYYY-MM-DD
    period: z.string(),                   // 사업기간(원문 표기)
    location: z.string(),
    region: z.enum(['인천', '경기', '충청', '부산', '해외']),
    fields: z.array(z.string()),          // 녹조 / 악취 / 하천 / 호수·저수지 / 토양 / 축산 / 해외·협력
    lat: z.number().optional(),
    lon: z.number().optional(),
    country: z.string().optional(),
    source: z.string().optional(),        // 기존 사이트 원문 주소
    featured: z.boolean().optional(),
    youtube: z.string().optional(),
    beforeAfter: z.array(z.string()).optional(),
    thumb: z.string().optional(),         // (선택) /img/... 대표 사진 1장
  }),
});

export const collections = { projects };
