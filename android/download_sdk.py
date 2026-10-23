# -*- coding: utf-8 -*-
"""从腾讯云镜像下载 Android SDK 的 build-tools 与 platform"""
import urllib.request, sys, os, zipfile
import xml.etree.ElementTree as ET

SDK_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sdk')
os.makedirs(SDK_DIR, exist_ok=True)
MIRROR = 'https://mirrors.cloud.tencent.com/AndroidSDK/'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}


def get(url, timeout=300):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=timeout)


def download(url, dest):
    print('downloading %s' % url, flush=True)
    tmp = dest + '.part'
    with get(url) as r, open(tmp, 'wb') as f:
        total = int(r.headers.get('Content-Length') or 0)
        done = 0
        last_pct = -1
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
            done += len(chunk)
            if total:
                pct = done * 100 // total
                if pct // 10 != last_pct // 10:
                    print('  %d%%  %d/%d MB' % (pct, done >> 20, total >> 20), flush=True)
                    last_pct = pct
    os.replace(tmp, dest)
    print('done: %s' % dest, flush=True)


def local(tag):
    return tag.split('}')[-1]


# 1. 仓库清单
xml_url = MIRROR + 'repository2-1.xml'
print('fetching %s' % xml_url, flush=True)
xml_text = get(xml_url).read().decode('utf-8', 'ignore')
print('xml size %d bytes' % len(xml_text), flush=True)
root = ET.fromstring(xml_text)

# 收集所有 remotePackage：path -> 首选(windows) url
pkgs = {}
for pkg in root.iter():
    if local(pkg.tag) != 'remotePackage':
        continue
    path = pkg.get('path')
    urls = [u.text for u in pkg.iter() if local(u.tag) == 'url' and u.text]
    win = [u for u in urls if 'windows' in u]
    pkgs[path] = (win[0] if win else (urls[0] if urls else None))


def pick_build_tools():
    best = None
    for path, url in pkgs.items():
        if path.startswith('build-tools;'):
            ver = path.split(';')[1]
            if not url:
                continue
            key = tuple(int(x) for x in ver.split('.') if x.isdigit())
            if best is None or key > best[0]:
                best = (key, path, url)
    return best


def pick_platform():
    for api in ['34', '33', '35', '30']:
        for path, url in pkgs.items():
            if path == 'platforms;android-' + api and url:
                return path, url
    return None, None


bt = pick_build_tools()
pl_path, pl_url = pick_platform()
print('build-tools: %s -> %s' % (bt[1], bt[2]), flush=True)
print('platform: %s -> %s' % (pl_path, pl_url), flush=True)
if not bt or not pl_url:
    sys.exit('FAIL: missing packages')

bt_zip = os.path.join(SDK_DIR, 'build-tools.zip')
pl_zip = os.path.join(SDK_DIR, 'platform.zip')
if not os.path.exists(bt_zip):
    download(MIRROR + bt[2], bt_zip)
if not os.path.exists(pl_zip):
    download(MIRROR + pl_url, pl_zip)

bt_dir = os.path.join(SDK_DIR, 'build-tools', bt[1].split(';')[1])
pl_dir = os.path.join(SDK_DIR, 'platforms', pl_path.split(';')[1].replace('android-', 'android-'))
os.makedirs(bt_dir, exist_ok=True)
os.makedirs(pl_dir, exist_ok=True)
with zipfile.ZipFile(bt_zip) as z:
    z.extractall(bt_dir)
with zipfile.ZipFile(pl_zip) as z:
    z.extractall(pl_dir)
print('extracted', flush=True)

import glob
for name in ['aapt2.exe', 'd8.bat', 'apksigner.bat', 'zipalign.exe']:
    hits = glob.glob(os.path.join(bt_dir, '**', name), recursive=True)
    print('build-tools/%s -> %s' % (name, hits[0] if hits else 'NOT FOUND'), flush=True)
jar = glob.glob(os.path.join(pl_dir, '**', 'android.jar'), recursive=True)
print('android.jar -> %s' % (jar[0] if jar else 'NOT FOUND'), flush=True)
print('OK', flush=True)
