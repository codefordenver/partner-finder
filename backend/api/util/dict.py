from functools import wraps


def exclude_keys(keys):
    def _decorator(f):
        @wraps(f)
        def _inner(*args, **kwargs):
            result = f(*args, **kwargs)
            if not isinstance(result, dict):
                return result
            return {k: v for (k, v) in result.items() if k not in keys}

        return _inner

    return _decorator
