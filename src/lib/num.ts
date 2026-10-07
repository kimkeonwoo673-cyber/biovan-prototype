// 숫자 표기 공통 규칙: 천 단위 구분, 금액은 USD만.
const ko = (v: number, d: number) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
/** 일반 수: 소수 d자리 */
export const n = (v: any, d = 0) => (v == null || v === '' || Number.isNaN(Number(v)) ? '—' : ko(Number(v), d));
/** 백만 USD 등 금액: 100 이상 정수, 1 이상 소수 1자리, 1 미만 소수 2자리 */
export const money = (v: any) => {
  if (v == null || v === '') return '—';
  if (typeof v === 'string') return v;
  const a = Math.abs(v);
  return ko(v, a >= 100 ? 0 : a >= 1 ? 1 : 2);
};
/** 백분율 변화 */
export const chg = (v: any) => (v == null ? '—' : `${v > 0 ? '+' : ''}${Math.round(v)}%`);
export const pctOf = (a: any, b: any) => (a == null || b == null || b === 0 ? null : (a / b - 1) * 100);
