"""Generate manifest screenshots for both tsuchiyatakahiro.com and tsuchiyalab.com.

Run from repo root with: python3 scripts/generate-screenshots.py
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

TT = "C:/Users/Windows/Projects/tsuchiyatakahiro.com"
TL = "C:/Users/Windows/Projects/tsuchiyalab"


def open_rgba(path):
    return Image.open(path).convert("RGBA")


def fit_cover(src, target_w, target_h):
    sw, sh = src.size
    scale = max(target_w / sw, target_h / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = src.resize((nw, nh), Image.LANCZOS)
    left = (nw - target_w) // 2
    top = (nh - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def overlay_color(img, rgba):
    overlay = Image.new("RGBA", img.size, rgba)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def find_japanese_font(size):
    candidates = [
        "C:/Windows/Fonts/YuGothM.ttc",
        "C:/Windows/Fonts/YuGothR.ttc",
        "C:/Windows/Fonts/meiryo.ttc",
        "C:/Windows/Fonts/msgothic.ttc",
        "C:/Windows/Fonts/Arial.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()


def find_serif_font(size):
    candidates = [
        "C:/Windows/Fonts/times.ttf",
        "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/YuMin.ttc",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                continue
    return ImageFont.load_default()


def text_anchor(draw, xy, text, font, fill, anchor="mm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)


def tt_desktop():
    W, H = 1280, 720
    bg = fit_cover(open_rgba(f"{TT}/public/images/architecture.jpg"), W, H)
    bg = overlay_color(bg, (255, 255, 255, 215))
    gray = bg.convert("L").convert("RGBA")
    bg = Image.blend(bg, gray, 0.6)
    canvas = bg.copy()
    draw = ImageDraw.Draw(canvas)
    logo = open_rgba(f"{TT}/public/images/logo-full.png")
    lw = 480
    lh = int(logo.size[1] * (lw / logo.size[0]))
    logo_r = logo.resize((lw, lh), Image.LANCZOS)
    canvas.paste(logo_r, ((W - lw) // 2, 240), logo_r)
    f_aff = find_japanese_font(13)
    text_anchor(draw, (W // 2, 240 + lh + 38),
                "KYOTO UNIVERSITY OF FOREIGN STUDIES",
                f_aff, (50, 50, 50, 255))
    text_anchor(draw, (W // 2, 240 + lh + 60),
                "INSTITUTE FOR LIBERAL ARTS & SCIENCES",
                f_aff, (50, 50, 50, 255))
    cx = W // 2
    draw.line([(cx - 30, 240 + lh + 100), (cx + 30, 240 + lh + 100)],
              fill=(50, 50, 50, 255), width=1)
    f_tag = find_serif_font(22)
    text_anchor(draw, (W // 2, 240 + lh + 145),
                "Decoding the complexities of global society",
                f_tag, (40, 40, 40, 255))
    text_anchor(draw, (W // 2, 240 + lh + 175),
                "through the lens of Intelligence.",
                f_tag, (40, 40, 40, 255))
    canvas.convert("RGB").save(f"{TT}/public/screenshots/desktop-1280x720.png", optimize=True)
    print(f"  TT desktop saved: {W}x{H}")


def tt_mobile():
    W, H = 750, 1334
    bg = fit_cover(open_rgba(f"{TT}/public/images/zen-garden.png"), W, H)
    bg = overlay_color(bg, (255, 255, 255, 215))
    gray = bg.convert("L").convert("RGBA")
    bg = Image.blend(bg, gray, 0.6)
    canvas = bg.copy()
    draw = ImageDraw.Draw(canvas)
    logo = open_rgba(f"{TT}/public/images/logo-full.png")
    lw = 480
    lh = int(logo.size[1] * (lw / logo.size[0]))
    logo_r = logo.resize((lw, lh), Image.LANCZOS)
    canvas.paste(logo_r, ((W - lw) // 2, 480), logo_r)
    f_aff = find_japanese_font(13)
    text_anchor(draw, (W // 2, 480 + lh + 30),
                "Kyoto University of Foreign Studies",
                f_aff, (50, 50, 50, 255))
    text_anchor(draw, (W // 2, 480 + lh + 56),
                "Institute for Liberal Arts and Sciences",
                f_aff, (50, 50, 50, 255))
    cx = W // 2
    draw.line([(cx - 30, 480 + lh + 96), (cx + 30, 480 + lh + 96)],
              fill=(50, 50, 50, 255), width=1)
    f_tag = find_serif_font(18)
    text_anchor(draw, (W // 2, 480 + lh + 134),
                "Decoding the complexities",
                f_tag, (40, 40, 40, 255))
    text_anchor(draw, (W // 2, 480 + lh + 160),
                "of global society through",
                f_tag, (40, 40, 40, 255))
    text_anchor(draw, (W // 2, 480 + lh + 186),
                "the lens of Intelligence.",
                f_tag, (40, 40, 40, 255))
    canvas.convert("RGB").save(f"{TT}/public/screenshots/mobile-750x1334.png", optimize=True)
    print(f"  TT mobile saved:  {W}x{H}")


def tl_desktop():
    W, H = 1280, 720
    canvas = Image.new("RGBA", (W, H), (10, 10, 10, 255))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(0, 600, 20):
        alpha = max(0, 30 - i // 25)
        od.ellipse([(W // 2 - i * 2, H // 2 - i),
                    (W // 2 + i * 2, H // 2 + i)],
                   fill=(255, 255, 255, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=80))
    canvas = Image.alpha_composite(canvas, overlay)
    draw = ImageDraw.Draw(canvas)
    logo = open_rgba(f"{TL}/public/logo_tsuchiyalab.png")
    lw = 600
    lh = int(logo.size[1] * (lw / logo.size[0]))
    logo_r = logo.resize((lw, lh), Image.LANCZOS)
    canvas.paste(logo_r, ((W - lw) // 2, (H - lh) // 2 - 40), logo_r)
    f_tag = find_japanese_font(18)
    text_anchor(draw, (W // 2, (H + lh) // 2 + 30),
                "SaaS / Consulting / IP Studio",
                f_tag, (200, 200, 200, 255))
    canvas.convert("RGB").save(f"{TL}/public/screenshots/desktop-1280x720.png", optimize=True)
    print(f"  TL desktop saved: {W}x{H}")


def tl_mobile():
    W, H = 750, 1334
    canvas = Image.new("RGBA", (W, H), (10, 10, 10, 255))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(0, 700, 20):
        alpha = max(0, 30 - i // 30)
        od.ellipse([(W // 2 - i, H // 2 - i),
                    (W // 2 + i, H // 2 + i)],
                   fill=(255, 255, 255, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=80))
    canvas = Image.alpha_composite(canvas, overlay)
    draw = ImageDraw.Draw(canvas)
    logo = open_rgba(f"{TL}/public/logo_tsuchiyalab.png")
    lw = 540
    lh = int(logo.size[1] * (lw / logo.size[0]))
    logo_r = logo.resize((lw, lh), Image.LANCZOS)
    canvas.paste(logo_r, ((W - lw) // 2, (H - lh) // 2 - 60), logo_r)
    f_tag = find_japanese_font(15)
    text_anchor(draw, (W // 2, (H + lh) // 2 + 20),
                "SaaS / Consulting", f_tag, (200, 200, 200, 255))
    text_anchor(draw, (W // 2, (H + lh) // 2 + 50),
                "IP Studio", f_tag, (200, 200, 200, 255))
    canvas.convert("RGB").save(f"{TL}/public/screenshots/mobile-750x1334.png", optimize=True)
    print(f"  TL mobile saved:  {W}x{H}")


if __name__ == "__main__":
    print("=== tsuchiyatakahiro.com screenshots ===")
    tt_desktop()
    tt_mobile()
    print("\n=== tsuchiyalab.com screenshots ===")
    tl_desktop()
    tl_mobile()
    print("\nAll screenshots generated.")
