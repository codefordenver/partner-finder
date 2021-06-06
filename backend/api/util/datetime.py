from pytz import utc
from datetime import datetime


def to_utc(dt):
    return utc.localize(dt)


def utcnow():
    return to_utc(datetime.now())


def utc_iso_8601(dt):
    localized = utc.localize(dt)
    return localized.isoformat()


def from_iso_8601(s):
    dt = datetime.fromisoformat(s)
    return dt.replace(tzinfo=utc)
