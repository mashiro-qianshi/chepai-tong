# -*- coding: utf-8 -*-
"""生成更美观的应用图标：蓝渐变圆角底 + 白色车牌 + 「牌」字 + 绿色点亮徽标"""
from PIL import Image, ImageDraw, ImageFont
import numpy as np, os

S = 512


def grad(w, h, c1, c2):
    t = np.linspace(0, 1, h)[:, None, None]
    top = np.array(c1, float); bot = np.array(c2, float)
    g = top[None, None, :] * (1 - t) + bot[None, None, :] * t
    return np.repeat(g, w, axis=1).astype(np.uint8)


def load_font(size):
    for p in [r'C:\Windows\Fonts\msyhbd.ttc', r'C:\Windows\Fonts\simhei.ttf', r'C:\Windows\Fonts\msyh.ttc']:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


bg = grad(S, S, (63, 131, 248), (23, 80, 200))
img = Image.fromarray(bg, 'RGB').convert('RGBA')
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=112, fill=255)
img.putalpha(mask)

draw = ImageDraw.Draw(img)

# 白色车牌
px, py, pw, ph = int(S * 0.14), int(S * 0.28), int(S * 0.72), int(S * 0.44)
draw.rounded_rectangle([px, py, px + pw, py + ph], radius=40, fill=(255, 255, 255, 255),
                       outline=(214, 228, 255, 255), width=6)
draw.rounded_rectangle([px + 10, py + 10, px + pw - 10, py + ph - 10], radius=32,
                       outline=(120, 160, 240, 255), width=3)

# 「牌」字
font = load_font(170)
text = '牌'
bbox = draw.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
tx = px + (pw - tw) / 2 - bbox[0]
ty = py + (ph - th) / 2 - bbox[1]
draw.text((tx, ty), text, font=font, fill=(29, 78, 216, 255))

# 绿色点亮徽标（右下角）
cx, cy, cr = int(S * 0.80), int(S * 0.68), 54
draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(22, 163, 74, 255), outline=(255, 255, 255, 255), width=6)
draw.line([(cx - cr * 0.45, cy), (cx - cr * 0.12, cy + cr * 0.36)], fill='white', width=14)
draw.line([(cx - cr * 0.12, cy + cr * 0.36), (cx + cr * 0.5, cy - cr * 0.32)], fill='white', width=14)

root = os.path.dirname(os.path.abspath(__file__))
big = os.path.join(root, 'icon-512.png')
img.save(big)
img.resize((192, 192), Image.LANCZOS).save(os.path.join(root, 'icon-192.png'))
print('saved', big, os.path.getsize(big), 'bytes')
