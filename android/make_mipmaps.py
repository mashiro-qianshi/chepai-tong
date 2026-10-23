# -*- coding: utf-8 -*-
"""用 512 图标生成各密度的启动图标"""
import os
from PIL import Image

src = Image.open(os.path.join('..', 'icon-512.png')).convert('RGBA')
sizes = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
for name, sz in sizes.items():
    d = os.path.join('res', 'mipmap-' + name)
    os.makedirs(d, exist_ok=True)
    src.resize((sz, sz), Image.LANCZOS).save(os.path.join(d, 'ic_launcher.png'))
    print('made', os.path.join(d, 'ic_launcher.png'))
print('mipmaps done')
