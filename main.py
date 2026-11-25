"""Entry for make.fun's "Sum up 24 November's world news in one image" bounty.

The grader runs `python3 -P -s /bot/main.py` with no network, this repository
mounted read-only at /bot and an empty, writable output directory.

The picture was designed and rendered ahead of time: src/build.mjs lays it out
in HTML and screenshots it with headless Chromium, which the grader does not
have, and the result is committed as assets/entry.png. This program checks
that file against the bounty's limits and writes it, byte for byte, to
$MAKEFUN_OUTPUT_DIR/entry.png. It uses only the standard library, and every
run writes the same bytes.
"""

import hashlib
import os
import struct
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, "assets", "entry.png")
OUTPUT_NAME = "entry.png"

MAX_SIDE = 1024  # pixels, for each side
MAX_BYTES = 1024 * 1024  # 1 MiB
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def read_png(path):
    """Return (bytes, width, height) of a PNG file, after checking the CRC of every chunk."""
    with open(path, "rb") as f:
        data = f.read()
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError(f"{path} is not a PNG file")

    pos = len(PNG_SIGNATURE)
    width = height = None
    while True:
        if pos + 12 > len(data):
            raise ValueError("PNG ends before its IEND chunk")
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        end = pos + 12 + length
        if end > len(data):
            raise ValueError(f"PNG chunk at byte {pos} runs past the end of the file")
        body = data[pos + 8:end - 4]
        (crc,) = struct.unpack(">I", data[end - 4:end])
        if zlib.crc32(kind + body) != crc:
            raise ValueError(f"PNG chunk {kind.decode('latin-1')} at byte {pos} is damaged")
        if width is None:
            if kind != b"IHDR":
                raise ValueError("PNG does not start with an IHDR chunk")
            width, height = struct.unpack(">II", body[:8])
        pos = end
        if kind == b"IEND":
            return data, width, height


def main():
    data, width, height = read_png(SOURCE)
    if width > MAX_SIDE or height > MAX_SIDE:
        raise ValueError(f"image is {width}x{height}, over the {MAX_SIDE}x{MAX_SIDE} limit")
    if len(data) > MAX_BYTES:
        raise ValueError(f"image is {len(data)} bytes, over the {MAX_BYTES}-byte limit")

    out_dir = os.environ.get("MAKEFUN_OUTPUT_DIR") or "/output"
    os.makedirs(out_dir, exist_ok=True)
    target = os.path.join(out_dir, OUTPUT_NAME)
    with open(target, "wb") as f:
        f.write(data)

    digest = hashlib.sha256(data).hexdigest()
    print(f"wrote {target}: {width}x{height} PNG, {len(data)} bytes, sha256 {digest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
