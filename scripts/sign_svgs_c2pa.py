"""Embeds and verifies C2PA-structured SVG <metadata> manifests (ECDSA P-256 + SHA-256)."""

from __future__ import annotations

import base64
import hashlib
import json
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec

ROOT = Path(__file__).resolve().parent.parent
KEY_PATH = ROOT / ".internal_archive" / "keys" / "c2pa_ec_p256.pem"
ARCHIVE_SVG_DIR = ROOT / ".internal_archive" / "svgs"

SVG_TARGETS = [
    "logo-svg.svg",
    "frontend/public/logo-svg.svg",
    "frontend/public/projects/geopetak/assets/geopetak-logo.svg",
    "frontend/public/projects/geopetak/assets/geopetak-footer-logo.svg",
    "frontend/public/projects/geopetak/assets/geopetak-icon.svg",
    "projects/geopetak/assets/geopetak-logo.svg",
    "projects/geopetak/assets/geopetak-footer-logo.svg",
    "projects/geopetak/assets/geopetak-icon.svg",
]

METADATA_RE = re.compile(r"<metadata\b[^>]*>.*?</metadata>", re.DOTALL | re.IGNORECASE)
C2PA_TAG_RE = re.compile(r'<c2pa:manifest\b[^>]*>([A-Za-z0-9+/=\s]+)</c2pa:manifest>', re.IGNORECASE)


def _load_or_create_private_key() -> ec.EllipticCurvePrivateKey:
    if KEY_PATH.exists():
        loaded = serialization.load_pem_private_key(KEY_PATH.read_bytes(), password=None)
        if not isinstance(loaded, ec.EllipticCurvePrivateKey):
            raise TypeError("Expected EC private key")
        return loaded
    KEY_PATH.parent.mkdir(parents=True, exist_ok=True)
    key = ec.generate_private_key(ec.SECP256R1())
    KEY_PATH.write_bytes(
        key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        )
    )
    return key


def _canonical_svg_without_metadata(svg_text: str) -> str:
    return METADATA_RE.sub("", svg_text).strip()


def sign_svg(path: Path, private_key: ec.EllipticCurvePrivateKey) -> None:
    rel_name = path.relative_to(ROOT).as_posix()
    backup = ARCHIVE_SVG_DIR / rel_name
    backup.parent.mkdir(parents=True, exist_ok=True)
    raw_text = path.read_text(encoding="utf-8")
    if not backup.exists():
        backup.write_text(raw_text, encoding="utf-8")

    clean_svg = _canonical_svg_without_metadata(raw_text)
    body_sha256 = hashlib.sha256(clean_svg.encode("utf-8")).hexdigest()
    pub_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("ascii")

    claims = {
        "spec": "C2PA-SVG-Provenance-v1",
        "claim_generator": "antporto-c2pa-signer/1.0",
        "title": path.name,
        "dc:creator": "Rifa'i Aryo Ananta",
        "dc:source": "https://antporto.co.id",
        "asset_hash_sha256": body_sha256,
        "assertions": [
            {"label": "c2pa.actions", "data": {"actions": [{"action": "c2pa.created"}]}},
            {"label": "cawg.training-mining", "data": {"entries": {"cawg.ai_training": {"use": "notAllowed"}, "cawg.ai_generative_training": {"use": "notAllowed"}}}},
        ],
    }
    claims_bytes = json.dumps(claims, separators=(",", ":"), sort_keys=True).encode("utf-8")
    sig_der = private_key.sign(claims_bytes, ec.ECDSA(hashes.SHA256()))

    envelope = {
        "claims": claims,
        "signature": {
            "alg": "ES256",
            "self_signed": True,
            "value_b64": base64.b64encode(sig_der).decode("ascii"),
            "public_key_pem": pub_pem,
        },
    }
    manifest_b64 = base64.b64encode(json.dumps(envelope, separators=(",", ":")).encode("utf-8")).decode("ascii")

    metadata_xml = (
        '<metadata>'
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/">'
        '<rdf:Description rdf:about="">'
        "<dc:creator>Rifa'i Aryo Ananta</dc:creator>"
        "<dc:rights>Copyright 2026 Rifa'i Aryo Ananta (antporto.co.id)</dc:rights>"
        '</rdf:Description>'
        '</rdf:RDF>'
        f'<c2pa:manifest xmlns:c2pa="http://c2pa.org/manifest" alg="ES256">{manifest_b64}</c2pa:manifest>'
        '</metadata>'
    )

    m_open = re.search(r"<svg\b[^>]*>", clean_svg, re.IGNORECASE)
    if not m_open:
        raise ValueError(f"Missing <svg> opening tag in {path}")
    insert_at = m_open.end()
    signed_svg = clean_svg[:insert_at] + metadata_xml + clean_svg[insert_at:]

    # Validate XML structure before writing
    ET.fromstring(signed_svg)
    path.write_text(signed_svg, encoding="utf-8")


def verify_svg(path: Path) -> dict:
    txt = path.read_text(encoding="utf-8")
    ET.fromstring(txt)
    m = C2PA_TAG_RE.search(txt)
    if not m:
        return {"path": path.relative_to(ROOT).as_posix(), "valid": False, "reason": "missing manifest"}
    envelope = json.loads(base64.b64decode(m.group(1).strip()).decode("utf-8"))
    claims = envelope["claims"]
    sig = envelope["signature"]
    clean_svg = _canonical_svg_without_metadata(txt)
    actual_sha = hashlib.sha256(clean_svg.encode("utf-8")).hexdigest()
    if actual_sha != claims.get("asset_hash_sha256"):
        return {"path": path.relative_to(ROOT).as_posix(), "valid": False, "reason": "body hash mismatch"}

    pub = serialization.load_pem_public_key(sig["public_key_pem"].encode("ascii"))
    if not isinstance(pub, ec.EllipticCurvePublicKey):
        return {"path": path.relative_to(ROOT).as_posix(), "valid": False, "reason": "invalid public key"}
    claims_bytes = json.dumps(claims, separators=(",", ":"), sort_keys=True).encode("utf-8")
    pub.verify(base64.b64decode(sig["value_b64"]), claims_bytes, ec.ECDSA(hashes.SHA256()))
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "valid": True,
        "creator": claims.get("dc:creator"),
        "hash": actual_sha[:16],
    }


def main() -> None:
    cmd = sys.argv[1] if len(sys.argv) > 1 else "sign"
    if cmd == "sign":
        pk = _load_or_create_private_key()
        for rel in SVG_TARGETS:
            sign_svg(ROOT / rel, pk)
        print(f"Signed {len(SVG_TARGETS)} SVGs with ECDSA P-256 C2PA-structured manifests.")
    elif cmd == "verify":
        results = []
        failed = []
        for rel in SVG_TARGETS:
            res = verify_svg(ROOT / rel)
            results.append(res)
            if not res.get("valid"):
                failed.append(res)
        print(json.dumps({"total_svgs": len(results), "failed": failed, "results": results}))
        if failed:
            sys.exit(1)
    else:
        raise SystemExit(f"Unknown command: {cmd}")


if __name__ == "__main__":
    main()

