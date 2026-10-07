# Generates a lightweight inline-SVG Korea map (province outlines) -> src/data/korea-map.json
# Source: southkorea/southkorea-maps (KOSTAT 2013, simplified)
import json, math
src = json.load(open('scripts/skorea_provinces_geo_simple.json'))
LON0, LAT1 = 124.55, 38.65  # top-left
K = math.cos(math.radians(36))
S = 100  # px per degree latitude
W = (131.0 - LON0) * K * S
H = (LAT1 - 33.05) * S
def proj(lon, lat):
    return ((lon - LON0) * K * S, (LAT1 - lat) * S)
def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1,y1),(x2,y2) = pts[0], pts[-1]
    dmax, idx = 0, 0
    L = math.hypot(x2-x1, y2-y1) or 1e-9
    for i in range(1, len(pts)-1):
        x0,y0 = pts[i]
        d = abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1) / L
        if d > dmax: dmax, idx = d, i
    if dmax > eps:
        return dp(pts[:idx+1], eps)[:-1] + dp(pts[idx:], eps)
    return [pts[0], pts[-1]]
paths = []
for f in src['features']:
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    d = []
    for poly in polys:
        ring = [proj(*c) for c in poly[0]]
        # drop tiny islands
        xs=[p[0] for p in ring]; ys=[p[1] for p in ring]
        if (max(xs)-min(xs))*(max(ys)-min(ys)) < 1.2: continue
        m = len(ring)//2
        r = dp(ring[:m+1], 0.7)[:-1] + dp(ring[m:], 0.7)
        if len(r) < 4: continue
        d.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x,y in r) + 'Z')
    if d: paths.append({'name': f['properties']['name'], 'd': ''.join(d)})
out = {'viewBox': f'0 0 {W:.0f} {H:.0f}', 'lon0': LON0, 'lat1': LAT1, 'k': K, 's': S, 'paths': paths}
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{out["viewBox"]}"><g fill="#e3efed" stroke="#9cc3bd" stroke-width="1" stroke-linejoin="round">' + ''.join(f'<path d="{p["d"]}"/>' for p in paths) + '</g></svg>'
open('public/img/korea.svg','w').write(svg)
meta = {k:v for k,v in out.items() if k!='paths'}; meta['w']=round(W); meta['h']=round(H)
json.dump(meta, open('src/data/korea-map.json','w'))
print(out['viewBox'], len(svg), 'bytes svg')
