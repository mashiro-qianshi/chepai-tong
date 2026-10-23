# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont

BLUE = (29, 78, 216, 255)
DARK = (13, 42, 120, 255)

def make(size, path):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = size // 5
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BLUE)
    margin = int(size * 0.14)
    plate = [margin, int(size * 0.30), size - margin, int(size * 0.70)]
    d.rounded_rectangle(plate, radius=int(size * 0.06), fill=(255, 255, 255, 255),
                        outline=DARK, width=max(2, size // 120))
    font_paths = [
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    font = None
    for fp in font_paths:
        try:
            font = ImageFont.truetype(fp, int(size * 0.20))
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()
    text = "京A"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (plate[1] + plate[3]) / 2 - th / 2 - bbox[1]
    d.text((x, y), text, font=font, fill=DARK)
    img.save(path)

make(192, "icon-192.png")
make(512, "icon-512.png")
print("icons done")
