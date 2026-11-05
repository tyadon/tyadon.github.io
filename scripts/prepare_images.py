"""Resize source images for the web and strip all metadata (EXIF, GPS).

Usage: python3 scripts/prepare_images.py <assets-src-dir> <pour-memory-images-dir> <icons-dir...>
Writes into assets/img/. Safe to re-run.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"


def save(src, dest, max_side, fmt="JPEG"):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im.thumbnail((max_side, max_side))
        if fmt == "JPEG":
            im.convert("RGB").save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        else:
            im.save(dest, fmt, optimize=True)
    print(dest.relative_to(ROOT))


def main(src_dir, pm_dir, wgi_icon, pm_icon):
    src = Path(src_dir)
    for f in sorted((src / "darkroom").glob("*.jpg")):
        save(f, OUT / "darkroom" / f.name, 1600)
        save(f, OUT / "darkroom" / f"{f.stem}-t.jpg", 480)
    for f in sorted((src / "wgi").glob("0*.jpg")):
        save(f, OUT / "projects" / f"whosgotit-{f.stem}.jpg", 1000)
    for name in ["home", "cellar", "journal", "friends", "sommelier"]:
        save(Path(pm_dir) / f"app-store-slide-{name}.jpg", OUT / "projects" / f"pourmemory-{name}.jpg", 1000)
    save(Path(wgi_icon), OUT / "icons" / "whosgotit.png", 256, "PNG")
    save(Path(pm_icon), OUT / "icons" / "pourmemory.png", 256, "PNG")
    save(src / "newton" / "IMG_1798.jpeg", OUT / "newton" / "newton.jpg", 1400)


if __name__ == "__main__":
    main(*sys.argv[1:5])
