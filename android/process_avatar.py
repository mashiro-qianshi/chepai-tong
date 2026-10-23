# -*- coding: utf-8 -*-
"""把用户的「驾照少女」图片转成应用图标（512/192）与头像（256）"""
from PIL import Image
import os

parent = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # chepai-app/
src = os.path.join(parent, '驾照少女的蓝色车牌物语.png')
img = Image.open(src).convert('RGBA')
print('source:', img.size, img.mode)

img.resize((512, 512), Image.LANCZOS).save(os.path.join(parent, 'icon-512.png'))
img.resize((192, 192), Image.LANCZOS).save(os.path.join(parent, 'icon-192.png'))
img.resize((256, 256), Image.LANCZOS).save(os.path.join(parent, 'avatar.png'))
print('done -> icon-512.png / icon-192.png / avatar.png')
