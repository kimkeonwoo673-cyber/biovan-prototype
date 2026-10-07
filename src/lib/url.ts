// 사이트 내부 경로에 base(예: GitHub Pages의 /biovan-prototype)를 붙여주는 헬퍼.
// 기본(카페24 루트) 빌드에서는 BASE_URL이 '/' 이므로 경로가 그대로 유지됩니다.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const u = (p: string) => (p.startsWith('/') ? base + p : p);
