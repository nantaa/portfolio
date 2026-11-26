"""Offline DWT-DCT + Cox Spread-Spectrum image watermarker and 3D GLB KHR_mesh_quantization signer."""

from __future__ import annotations

import hashlib
import json
import math
import shutil
import struct
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_IMG_DIR = ROOT / ".internal_archive" / "images" / "pre_dwt"
ARCHIVE_MODEL_DIR = ROOT / ".internal_archive" / "models"
REGISTRY_PATH = ROOT / ".internal_archive" / "provenance_registry.json"

AUTHOR_SEED = b"Rifa'i Aryo Ananta::antporto.co.id::v1"
COPYRIGHT_TEXT = "Rifa'i Aryo Ananta - antporto.co.id"

SIG_BYTES = hashlib.sha256(AUTHOR_SEED).digest()[:8]
SIG_BITS = np.unpackbits(np.frombuffer(SIG_BYTES, dtype=np.uint8)).astype(np.int8)  # 64 bits

# Mid-band (u, v) pairs inside an 8x8 DCT block (balanced robustness vs imperceptibility)
MID_COORDS = [(2, 1), (1, 2), (2, 2), (3, 1), (1, 3), (3, 2), (2, 3), (4, 1)]

IMAGE_TARGETS = [
    "frontend/public/images/makna_works_branding_moodboard.webp",
    "frontend/public/images/moriku-cover.webp",
    "frontend/public/images/maknaworks-cover.webp",
    "frontend/public/images/docket-cover.webp",
    "frontend/public/images/3d-cover.webp",
    "frontend/public/images/aryo.png",
    "frontend/public/images/projects/bekasi_saturated.jpg",
    "frontend/public/images/projects/bekasi_mesh.jpg",
    "frontend/public/images/projects/bekasi_xray.jpg",
]

IMAGE_MIRRORS = {
    "frontend/public/images/makna_works_branding_moodboard.webp": [
        "images/makna_works_branding_moodboard.webp",
    ],
    "frontend/public/images/projects/bekasi_saturated.jpg": [
        "frontend/public/projects/geopetak/assets/bekasi_saturated.jpg",
        "projects/geopetak/assets/bekasi_saturated.jpg",
    ],
    "frontend/public/images/projects/bekasi_mesh.jpg": [
        "frontend/public/projects/geopetak/assets/bekasi_mesh.jpg",
        "projects/geopetak/assets/bekasi_mesh.jpg",
    ],
    "frontend/public/images/projects/bekasi_xray.jpg": [
        "frontend/public/projects/geopetak/assets/bekasi_xray.jpg",
        "projects/geopetak/assets/bekasi_xray.jpg",
    ],
}

MODEL_TARGETS = [
    "frontend/public/projects/tata/models/tas1a-compressed.glb",
    "frontend/public/projects/tata/models/tas1b-compressed.glb",
    "frontend/public/projects/tata/models/tas2a-compressed.glb",
    "frontend/public/projects/tata/models/tas2b-compressed.glb",
    "frontend/public/projects/tata/models/tas3a-compressed.glb",
    "frontend/public/projects/tata/models/tas3b-compressed.glb",
    "frontend/public/projects/tata/models/tas4a-compressed.glb",
    "frontend/public/projects/tata/models/tas4b-compressed.glb",
    "frontend/public/models/tas1a.glb",
    "frontend/public/models/tas2a.glb",
    "frontend/public/models/tas3a.glb",
]

MODEL_MIRRORS = {
    "frontend/public/projects/tata/models/tas1a-compressed.glb": ["projects/tata/models/tas1a-compressed.glb"],
    "frontend/public/projects/tata/models/tas1b-compressed.glb": ["projects/tata/models/tas1b-compressed.glb"],
    "frontend/public/projects/tata/models/tas2a-compressed.glb": ["projects/tata/models/tas2a-compressed.glb"],
    "frontend/public/projects/tata/models/tas2b-compressed.glb": ["projects/tata/models/tas2b-compressed.glb"],
    "frontend/public/projects/tata/models/tas3a-compressed.glb": ["projects/tata/models/tas3a-compressed.glb"],
    "frontend/public/projects/tata/models/tas3b-compressed.glb": ["projects/tata/models/tas3b-compressed.glb"],
    "frontend/public/projects/tata/models/tas4a-compressed.glb": ["projects/tata/models/tas4a-compressed.glb"],
    "frontend/public/projects/tata/models/tas4b-compressed.glb": ["projects/tata/models/tas4b-compressed.glb"],
}


def _dct_matrix(n: int = 8) -> np.ndarray:
    c = np.zeros((n, n), dtype=np.float64)
    for k in range(n):
        alpha = math.sqrt(1.0 / n) if k == 0 else math.sqrt(2.0 / n)
        for i in range(n):
            c[k, i] = alpha * math.cos(math.pi * (2 * i + 1) * k / (2 * n))
    return c


DCT8 = _dct_matrix(8)


def _prn_matrix() -> np.ndarray:
    pn = np.zeros((64, len(MID_COORDS)), dtype=np.float64)
    for bit_idx in range(64):
        digest = hashlib.sha256(AUTHOR_SEED + f":pn:{bit_idx}".encode("ascii")).digest()
        raw = np.array([1.0 if ((digest[i // 8] >> (i % 8)) & 1) else -1.0 for i in range(len(MID_COORDS))])
        # Enforce exact zero mean across mid-band coefficients
        half = len(MID_COORDS) // 2
        order = np.argsort([hashlib.blake2b(digest + bytes([j]), digest_size=2).digest() for j in range(len(MID_COORDS))])
        balanced = np.ones(len(MID_COORDS), dtype=np.float64)
        balanced[order[:half]] = -1.0
        pn[bit_idx] = balanced
    return pn


PN_TABLE = _prn_matrix()
MID_ROWS = np.array([r for r, _ in MID_COORDS])
MID_COLS = np.array([c for _, c in MID_COORDS])


def _dwt2_haar(img: np.ndarray):
    h, w = (img.shape[0] // 2) * 2, (img.shape[1] // 2) * 2
    s = img[:h, :w]
    a, b, c, d = s[0::2, 0::2], s[0::2, 1::2], s[1::2, 0::2], s[1::2, 1::2]
    ll = (a + b + c + d) * 0.5
    lh = (a + b - c - d) * 0.5
    hl = (a - b + c - d) * 0.5
    hh = (a - b - c + d) * 0.5
    return ll, lh, hl, hh


def _idwt2_haar(ll: np.ndarray, lh: np.ndarray, hl: np.ndarray, hh: np.ndarray) -> np.ndarray:
    h, w = ll.shape
    out = np.zeros((h * 2, w * 2), dtype=np.float64)
    out[0::2, 0::2] = (ll + lh + hl + hh) * 0.5
    out[0::2, 1::2] = (ll + lh - hl - hh) * 0.5
    out[1::2, 0::2] = (ll - lh + hl - hh) * 0.5
    out[1::2, 1::2] = (ll - lh - hl + hh) * 0.5
    return out


def embed_image_watermark(src_path: Path, dst_path: Path) -> None:
    with Image.open(src_path) as im:
        has_alpha = "A" in im.getbands()
        alpha_band = im.getchannel("A") if has_alpha else None
        rgb_img = im.convert("RGB")
        ycbcr = rgb_img.convert("YCbCr")
        arr = np.array(ycbcr, dtype=np.float64)

    y = arr[:, :, 0].copy()
    h2, w2 = (y.shape[0] // 16) * 16, (y.shape[1] // 16) * 16
    region = y[:h2, :w2]
    ll, lh, hl, hh = _dwt2_haar(region)

    sub_h, sub_w = ll.shape
    bh, bw = sub_h // 8, sub_w // 8
    block_idx = 0
    for band in (hl, lh):
        for r in range(bh):
            for c in range(bw):
                bit_pos = block_idx % 64
                sign = 1.0 if SIG_BITS[bit_pos] == 1 else -1.0
                blk = band[r * 8 : (r + 1) * 8, c * 8 : (c + 1) * 8]
                coeff = DCT8 @ blk @ DCT8.T
                amp = max(4.5, min(7.8, 0.04 * float(np.std(blk)) + 4.0))
                coeff[MID_ROWS, MID_COLS] += amp * sign * PN_TABLE[bit_pos]
                band[r * 8 : (r + 1) * 8, c * 8 : (c + 1) * 8] = DCT8.T @ coeff @ DCT8
                block_idx += 1

    y[:h2, :w2] = np.clip(_idwt2_haar(ll, lh, hl, hh), 0.0, 255.0)
    arr[:, :, 0] = y
    out_ycbcr = Image.fromarray(np.round(arr).astype(np.uint8), mode="YCbCr").convert("RGB")
    if has_alpha and alpha_band is not None:
        out_img = out_ycbcr.convert("RGBA")
        out_img.putalpha(alpha_band)
    else:
        out_img = out_ycbcr

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    ext = dst_path.suffix.lower()
    if ext == ".webp":
        out_img.save(dst_path, "WEBP", quality=92, method=6)
    elif ext in (".jpg", ".jpeg"):
        out_img.convert("RGB").save(dst_path, "JPEG", quality=96, subsampling=0, optimize=True)
    else:
        out_img.save(dst_path, "PNG", optimize=True)


def extract_image_bit_accuracy(img_path: Path) -> float:
    with Image.open(img_path) as im:
        y = np.array(im.convert("RGB").convert("YCbCr"), dtype=np.float64)[:, :, 0]
    h2, w2 = (y.shape[0] // 16) * 16, (y.shape[1] // 16) * 16
    _, lh, hl, _ = _dwt2_haar(y[:h2, :w2])
    sub_h, sub_w = lh.shape
    bh, bw = sub_h // 8, sub_w // 8
    sums = np.zeros(64, dtype=np.float64)
    counts = np.zeros(64, dtype=np.int64)
    block_idx = 0
    for band in (hl, lh):
        for r in range(bh):
            for c in range(bw):
                bit_pos = block_idx % 64
                blk = band[r * 8 : (r + 1) * 8, c * 8 : (c + 1) * 8]
                coeff = DCT8 @ blk @ DCT8.T
                sums[bit_pos] += float(np.dot(coeff[MID_ROWS, MID_COLS], PN_TABLE[bit_pos]))
                counts[bit_pos] += 1
                block_idx += 1
    recovered = np.where(sums >= 0.0, 1, 0).astype(np.int8)
    return float(np.mean(recovered == SIG_BITS))


def compute_psnr(orig_path: Path, signed_path: Path) -> float:
    with Image.open(orig_path) as a, Image.open(signed_path) as b:
        arr_a = np.array(a.convert("RGB"), dtype=np.float64)
        arr_b = np.array(b.convert("RGB"), dtype=np.float64)
    mse = float(np.mean((arr_a - arr_b) ** 2))
    if mse <= 1e-12:
        return 99.0
    return 10.0 * math.log10((255.0 ** 2) / mse)


# ─── 3D GLB (KHR_mesh_quantization) Signer & Extractor ───────────────────────

def _parse_glb(raw: bytes):
    magic, version, total_len = struct.unpack("<3I", raw[:12])
    if magic != 0x46546C67 or version != 2:
        raise ValueError("Invalid GLB v2 header")
    c0_len, c0_type = struct.unpack("<2I", raw[12:20])
    if c0_type != 0x4E4F534A:
        raise ValueError("Missing GLB JSON chunk")
    json_end = 20 + c0_len
    gltf = json.loads(raw[20:json_end].decode("utf-8"))
    c1_len, c1_type = struct.unpack("<2I", raw[json_end : json_end + 8])
    if c1_type != 0x004E4942:
        raise ValueError("Missing GLB BIN chunk")
    bin_bytes = bytearray(raw[json_end + 8 : json_end + 8 + c1_len])
    return gltf, bin_bytes


def _position_view_slice(gltf: dict):
    pos_acc_idx = gltf["meshes"][0]["primitives"][0]["attributes"]["POSITION"]
    acc = gltf["accessors"][pos_acc_idx]
    if acc["componentType"] != 5122:
        raise ValueError(f"Unsupported POSITION componentType: {acc['componentType']}")
    bv = gltf["bufferViews"][acc["bufferView"]]
    stride = bv.get("byteStride", 6)
    base_off = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    return acc["count"], base_off, stride


def _select_interior_xy_slots(count: int, bin_bytes: bytearray, base_off: int, stride: int):
    coords = []
    xy_groups = defaultdict(list)
    min_z = 32767
    max_z = -32768
    for idx in range(count):
        off = base_off + idx * stride
        x, y, z = struct.unpack_from("<3h", bin_bytes, off)
        coords.append((x, y, z))
        xy_groups[(x, y)].append(idx)
        if z < min_z:
            min_z = z
        if z > max_z:
            max_z = z

    candidates = []
    for (x, y), indices in xy_groups.items():
        # Pick unique or uniformly welded interior (x, y) coordinates away from z boundaries
        z_vals = {coords[i][2] for i in indices}
        if len(z_vals) != 1:
            continue
        z0 = next(iter(z_vals))
        if z0 <= min_z + 2 or z0 >= max_z - 2 or abs(z0) >= 32764:
            continue
        h = hashlib.blake2b(AUTHOR_SEED + struct.pack("<2h", x, y), digest_size=8).digest()
        candidates.append((h, x, y, indices))

    candidates.sort(key=lambda t: t[0])
    return candidates[:64], coords


def sign_glb(src_path: Path, dst_path: Path) -> str:
    raw = src_path.read_bytes()
    gltf, bin_bytes = _parse_glb(raw)
    count, base_off, stride = _position_view_slice(gltf)
    slots, _ = _select_interior_xy_slots(count, bin_bytes, base_off, stride)
    if len(slots) < 64:
        raise RuntimeError(f"Insufficient interior vertices in {src_path}")

    for bit_idx, (_, _, _, indices) in enumerate(slots):
        target_bit = int(SIG_BITS[bit_idx])
        for v_idx in indices:
            off = base_off + v_idx * stride + 4  # z offset inside int16 xyz
            z_cur = struct.unpack_from("<h", bin_bytes, off)[0]
            if (z_cur & 1) != target_bit:
                z_next = z_cur + 1 if z_cur < 32764 else z_cur - 1
                struct.pack_into("<h", bin_bytes, off, z_next)

    gltf.setdefault("asset", {})["copyright"] = COPYRIGHT_TEXT
    json_raw = json.dumps(gltf, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    while len(json_raw) % 4 != 0:
        json_raw += b" "
    while len(bin_bytes) % 4 != 0:
        bin_bytes.append(0)

    total_len = 12 + 8 + len(json_raw) + 8 + len(bin_bytes)
    out_bytes = (
        struct.pack("<3I", 0x46546C67, 2, total_len)
        + struct.pack("<2I", len(json_raw), 0x4E4F534A)
        + json_raw
        + struct.pack("<2I", len(bin_bytes), 0x004E4942)
        + bytes(bin_bytes)
    )
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    dst_path.write_bytes(out_bytes)

    # Zero-watermark invariant hash based on untouched (x, y) sorted geometry + byte count
    topo_h = hashlib.sha256()
    topo_h.update(struct.pack("<I", count))
    for _, x, y, _ in slots:
        topo_h.update(struct.pack("<2h", x, y))
    return topo_h.hexdigest()


def verify_glb(model_path: Path) -> dict:
    raw = model_path.read_bytes()
    magic, version, total_len = struct.unpack("<3I", raw[:12])
    c0_len, _ = struct.unpack("<2I", raw[12:20])
    c1_off = 20 + c0_len
    c1_len, _ = struct.unpack("<2I", raw[c1_off : c1_off + 8])
    aligned = (
        magic == 0x46546C67
        and version == 2
        and total_len == len(raw)
        and c0_len % 4 == 0
        and c1_len % 4 == 0
    )
    gltf, bin_bytes = _parse_glb(raw)
    count, base_off, stride = _position_view_slice(gltf)
    slots, coords = _select_interior_xy_slots(count, bin_bytes, base_off, stride)
    extracted = np.array([coords[indices[0]][2] & 1 for _, _, _, indices in slots], dtype=np.int8)
    bit_acc = float(np.mean(extracted == SIG_BITS)) if len(extracted) == 64 else 0.0
    return {
        "path": model_path.relative_to(ROOT).as_posix(),
        "aligned": aligned,
        "copyright": gltf.get("asset", {}).get("copyright", ""),
        "bit_accuracy": round(bit_acc, 4),
    }


def cmd_sign() -> None:
    ARCHIVE_IMG_DIR.mkdir(parents=True, exist_ok=True)
    ARCHIVE_MODEL_DIR.mkdir(parents=True, exist_ok=True)

    for rel in IMAGE_TARGETS:
        target = ROOT / rel
        rel_sub = Path(rel).relative_to("frontend/public/images")
        backup = ARCHIVE_IMG_DIR / rel_sub
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(target, backup)
        embed_image_watermark(backup, target)
        for mirror_rel in IMAGE_MIRRORS.get(rel, []):
            mirror = ROOT / mirror_rel
            if mirror.parent.exists():
                shutil.copy2(target, mirror)

    registry = {"author": COPYRIGHT_TEXT, "models": {}}
    for rel in MODEL_TARGETS:
        target = ROOT / rel
        rel_sub = Path(rel).relative_to("frontend/public")
        backup = ARCHIVE_MODEL_DIR / rel_sub
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(target, backup)
        topo_hash = sign_glb(backup, target)
        registry["models"][rel] = {"zero_watermark_sha256": topo_hash}
        for mirror_rel in MODEL_MIRRORS.get(rel, []):
            mirror = ROOT / mirror_rel
            if mirror.parent.exists():
                shutil.copy2(target, mirror)

    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_PATH.write_text(json.dumps(registry, indent=2), encoding="utf-8")
    print(f"Signed {len(IMAGE_TARGETS)} images and {len(MODEL_TARGETS)} GLB models cleanly.")


def cmd_verify_images() -> None:
    results = []
    failed = []
    for rel in IMAGE_TARGETS:
        target = ROOT / rel
        backup = ARCHIVE_IMG_DIR / Path(rel).relative_to("frontend/public/images")
        bit_acc = round(extract_image_bit_accuracy(target), 4)
        psnr = round(compute_psnr(backup, target), 2) if backup.exists() else 0.0
        item = {
            "path": rel,
            "bit_accuracy": bit_acc,
            "psnr": psnr,
            "backup_exists": backup.exists(),
        }
        results.append(item)
        if bit_acc < 0.90 or psnr < 38.0 or not backup.exists():
            failed.append(item)
    print(json.dumps({"total_images": len(results), "failed_images": failed, "results": results}))
    if failed:
        sys.exit(1)


def cmd_verify_models() -> None:
    results = []
    failed = []
    all_glbs = MODEL_TARGETS + [m for ms in MODEL_MIRRORS.values() for m in ms]
    for rel in all_glbs:
        target = ROOT / rel
        info = verify_glb(target)
        rel_key = rel if rel.startswith("frontend/public/") else f"frontend/public/{rel}"
        backup = ARCHIVE_MODEL_DIR / Path(rel_key).relative_to("frontend/public")
        info["backup_exists"] = backup.exists()
        results.append(info)
        if info["bit_accuracy"] < 1.0 or not info["aligned"] or "Aryo Ananta" not in info["copyright"] or not backup.exists():
            failed.append(info)
    print(json.dumps({"total_models": len(results), "failed_models": failed, "results": results}))
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sign"
    if cmd == "sign":
        cmd_sign()
    elif cmd == "verify-images":
        cmd_verify_images()
    elif cmd == "verify-models":
        cmd_verify_models()
    else:
        raise SystemExit(f"Unknown command: {cmd}")

