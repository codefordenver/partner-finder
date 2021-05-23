def test_healthcheck(check_get_request):
    check_get_request('/healthcheck')