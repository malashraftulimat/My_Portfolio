"""
Cinematic aesthetic pass for the portfolio portrait.

Keeps the subject's identity intact while adding depth:
 - gentle tone/contrast stretch (no more "flat")
 - warm-highlight / cool-shadow split tone (matches the site palette)
 - soft bloom around highlights for a lit, dimensional feel
 - clarity (unsharp mask) so the subject reads crisp
 - subtle vignette + fine film grain
"""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = "MY-PHOTO-original.webp"
DST = "MY-PHOTO.webp"


def srgb_to_linear(x):
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(x):
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.clip(x, 0, None) ** (1 / 2.4) - 0.055)


def main():
    img = Image.open(SRC).convert("RGB")
    arr = np.asarray(img).astype(np.float32) / 255.0

    # --- 1. Soft tone stretch (percentile based, protects highlights) ---
    lo = np.percentile(arr, 1.0)
    hi = np.percentile(arr, 99.0)
    arr = np.clip((arr - lo) / (hi - lo + 1e-6), 0, 1)
    arr = arr ** 0.97  # tiny midtone lift

    # --- 2. Base colour + contrast lift ---
    base = Image.fromarray((arr * 255).astype(np.uint8))
    base = ImageEnhance.Color(base).enhance(1.06)
    base = ImageEnhance.Contrast(base).enhance(1.05)
    base = base.filter(ImageFilter.UnsharpMask(radius=4, percent=90, threshold=4))

    arr = np.asarray(base).astype(np.float32) / 255.0

    # --- 3. Split toning: cool shadows, warm highlights ---
    lum = arr @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    shadow_w = np.clip(1.0 - lum * 1.9, 0, 1)[..., None]
    high_w = np.clip((lum - 0.55) * 2.0, 0, 1)[..., None]

    shadow_tint = np.array([0.22, 0.40, 0.58], dtype=np.float32)   # teal-blue
    high_tint = np.array([1.00, 0.80, 0.58], dtype=np.float32)     # soft amber

    arr = arr + (shadow_tint - arr) * shadow_w * 0.12
    arr = arr + (high_tint - arr) * high_w * 0.10
    arr = np.clip(arr, 0, 1)

    # --- 4. Bloom / glow around bright areas (screen blend) ---
    lin = srgb_to_linear(arr)
    bright = np.clip((lin - 0.78) / 0.22, 0, 1)
    glow_l = np.asarray(
        Image.fromarray((bright * 255).astype(np.uint8)).convert("L").filter(
            ImageFilter.GaussianBlur(22)
        )
    ).astype(np.float32) / 255.0
    lin = 1 - (1 - lin) * (1 - glow_l[..., None] * 0.22)
    arr = np.clip(linear_to_srgb(lin), 0, 1)

    # --- 5. Vignette ---
    h, w = arr.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w]
    cx, cy = w / 2, h / 2
    r = np.sqrt(((xs - cx) / cx) ** 2 + ((ys - cy) / cy) ** 2)
    vig = np.clip(1.0 - (r - 0.68) * 0.48, 0.6, 1.0)[..., None]
    arr = arr * vig

    # --- 6. Fine film grain (midtones only) ---
    rng = np.random.default_rng(7)
    grain = (rng.random(arr.shape[:2]) - 0.5)[..., None] * (1 / 255) * 7
    grain = grain * (1 - np.abs(arr - 0.5) * 1.4).clip(0.15, 1.0)
    arr = np.clip(arr + grain, 0, 1)

    # --- 7. Finish ---
    out = Image.fromarray((arr * 255).astype(np.uint8))
    out = ImageEnhance.Sharpness(out).enhance(1.08)
    out.save(DST, "WEBP", quality=90, method=6)
    print("saved", DST, out.size)


if __name__ == "__main__":
    main()
