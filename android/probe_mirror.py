# -*- coding: utf-8 -*-
"""从国内镜像探测可用的 Android SDK 仓库清单"""
import urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

xml_candidates = [
    'https://mirrors.cloud.tencent.com/AndroidSDK/repository2-1.xml',
    'https://mirrors.cloud.tencent.com/AndroidSDK/repository2-3.xml',
    'https://mirrors.tuna.tsinghua.edu.cn/android/repository/repository2-1.xml',
    'https://mirrors.tuna.tsinghua.edu.cn/android/repository/repository2-3.xml',
    'https://mirror.nju.edu.cn/android/repository/repository2-1.xml',
    'https://mirrors.ustc.edu.cn/android/repository/repository2-1.xml',
    'https://dl.google.com/android/repository/repository2-1.xml',
]

def try_get(url):
    req = urllib.request.Request(url, headers=UA)
    try:
        r = urllib.request.urlopen(req, timeout=30)
        data = r.read(400)
        return r.status, len(data)
    except urllib.error.HTTPError as e:
        return e.code, 0
    except Exception as e:
        return 'ERR', str(e).split('\n')[0][:60]

for u in xml_candidates:
    st, n = try_get(u)
    print('%-75s -> %s (head=%d bytes)' % (u, st, n), flush=True)
