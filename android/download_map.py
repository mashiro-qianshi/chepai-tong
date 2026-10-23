# -*- coding: utf-8 -*-
"""下载 ECharts 与 中国地图 GeoJSON（多源回退 + SSL 回退）"""
import urllib.request, os, json, ssl

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
JSDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js')
os.makedirs(JSDIR, exist_ok=True)


def get(url, timeout=180):
    req = urllib.request.Request(url, headers=UA)
    for verify in (True, False):
        try:
            ctx = ssl.create_default_context()
            if not verify:
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
            return urllib.request.urlopen(req, timeout=timeout, context=ctx)
        except Exception as e:
            if verify:
                print('  (ssl 回退重试) %s' % e, flush=True)
                continue
            raise


def dl(url, dest):
    print('downloading', url, flush=True)
    tmp = dest + '.part'
    with get(url) as r, open(tmp, 'wb') as f:
        while True:
            c = r.read(1 << 20)
            if not c:
                break
            f.write(c)
    os.replace(tmp, dest)
    print('saved', dest, os.path.getsize(dest), 'bytes', flush=True)


# 1) ECharts（多源回退）
echarts_srcs = [
    'https://registry.npmmirror.com/echarts/5.5.0/files/dist/echarts.min.js',
    'https://unpkg.com/echarts@5.5.0/dist/echarts.min.js',
    'https://cdn.staticfile.org/echarts/5.5.0/echarts.min.js',
]
echarts_dst = os.path.join(JSDIR, 'echarts.min.js')
if not os.path.exists(echarts_dst) or os.path.getsize(echarts_dst) < 100000:
    for u in echarts_srcs:
        try:
            dl(u, echarts_dst)
            break
        except Exception as e:
            print('  fail %s: %s' % (u, e), flush=True)

# 2) 中国地图 GeoJSON -> js
geo_url = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
china_js = os.path.join(JSDIR, 'china.js')
if not os.path.exists(china_js):
    raw = get(geo_url).read().decode('utf-8')
    data = json.loads(raw)
    names = [f.get('properties', {}).get('name', '?') for f in data.get('features', [])]
    print('geojson 省份数:', len(names), flush=True)
    print('省份名:', names, flush=True)
    with open(china_js, 'w', encoding='utf-8') as f:
        f.write('window.CHINA_GEO = ' + raw + ';\n')
    print('saved', china_js, os.path.getsize(china_js), 'bytes', flush=True)

print('DONE', flush=True)
