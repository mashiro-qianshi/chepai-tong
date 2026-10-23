# -*- coding: utf-8 -*-
"""探测 Android SDK 组件 zip 的正确下载 URL"""
import urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
BASE = 'https://dl.google.com/android/repository/'

candidates = [
    # build-tools
    'build-tools_r34-windows.zip',
    'build-tools_r34.0.0-windows.zip',
    'build-tools_r33.0.2-windows.zip',
    'build-tools_r33.0.1-windows.zip',
    'build-tools_r30.0.3-windows.zip',
    # platform
    'platform-34_r02.zip',
    'platform-33_r02.zip',
    'platform-30_r03.zip',
    # command line tools
    'commandlinetools-win-11076708_latest.zip',
    'commandlinetools-win-10406996_latest.zip',
    'commandlinetools-win-9477386_latest.zip',
    # repository xml (新名猜测)
    'repository2-1.xml',
    'repository2-3.xml',
]

def probe(url):
    req = urllib.request.Request(url, headers={**UA, 'Range': 'bytes=0-0'})
    try:
        r = urllib.request.urlopen(req, timeout=30)
        cl = r.headers.get('Content-Length')
        r.read(1)
        return '200 len=%s' % (cl or '?')
    except urllib.error.HTTPError as e:
        return 'HTTP %s' % e.code
    except Exception as e:
        return 'ERR %s' % str(e).split('\n')[0]

for c in candidates:
    print('%-45s %s' % (c, probe(BASE + c)), flush=True)
