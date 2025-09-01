import os
import cv2
import math
import tempfile
import numpy as np
from PIL import Image, ExifTags


class AmbienceEmotionClassifactionService:
    MD2_LUX_HASH = "67b2177e9e29e113246fed14c6915448"
    MD2_ISO_HASH = "ba07c6ca57ada953ce1dbaa4e98cb8e5"
    MD2_BRIGHTNESS_HASH = "e67d288bc38db3a940c17b8c8a2c1acf"

    @classmethod
    def _extract_exif(cls, image_path):
        img = Image.open(image_path)
        exif = img._getexif()

        if not exif:
            return None

        exif_data = {}

        for tag, value in exif.items():
            tag_name = ExifTags.TAGS.get(tag, tag)
            exif_data[tag_name] = value

        return {
            "aperture": exif_data.get("FNumber"),
            "shutter": exif_data.get("ExposureTime"),
            "iso": exif_data.get("ISOSpeedRatings"),
        }

    @classmethod
    def _compute_lux(cls, aperture, shutter_speed, iso=100, k=2.5):
        if (not aperture) or (not shutter_speed):
            return -1

        N, t = aperture, shutter_speed
        ev = math.log2((N**2) / t)

        ev100 = ev - math.log2(iso / 100)

        return k * (2**ev100)

    @classmethod
    def _compute_mean_brightness(cls, image_path):
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return np.mean(gray) * 0.45

    @classmethod
    def process_uploaded_image(cls, file):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(file.read())
            tmp_path = tmp.name

        meta = cls._extract_exif(tmp_path)

        lux = (
            cls._compute_lux(meta["aperture"], meta["shutter"], meta["iso"])
            if meta
            else -1
        )
        brightness = cls._compute_mean_brightness(tmp_path)

        return {
            cls.MD2_LUX_HASH: lux,
            cls.MD2_BRIGHTNESS_HASH: brightness,
            cls.MD2_ISO_HASH: meta["iso"] if meta["iso"] else -1,
        }
