from pytz import utc
from datetime import datetime


def utc_iso_8601(dt):
    localized = utc.localize(dt)
    return localized.isoformat()


def from_iso_8601(s):
    return datetime.fromisoformat(s)
