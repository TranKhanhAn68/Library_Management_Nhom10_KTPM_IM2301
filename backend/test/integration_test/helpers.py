
def assert_active_filter(api_client, url, model, factory_data):
    for data in factory_data:
        model.objects.create(**data)

    response = api_client.get(url)

    assert response.status_code == 200
    return response


def generate_permissions_matrix(base_url):
    detail_url = f"{base_url}1/"

    return [
        # method, url, user_fixture, expected
        ("get", base_url, "auth_admin", 200),
        ("get", base_url, "auth_staff", 200),
        ("get", base_url, "auth_client", 200),

        ("post", base_url, "auth_admin", 201),
        ("post", base_url, "auth_staff", 403),
        ("post", base_url, "auth_client", 403),

        ("get", detail_url, "auth_admin", 200),
        ("get", detail_url, "auth_staff", 200),
        ("get", detail_url, "auth_client", 200),

        ("put", detail_url, "auth_admin", 200),
        ("put", detail_url, "auth_staff", 403),
        ("put", detail_url, "auth_client", 403),

        ("patch", detail_url, "auth_admin", 200),
        ("patch", detail_url, "auth_staff", 403),
        ("patch", detail_url, "auth_client", 403),

        ("delete", detail_url, "auth_admin", 200),
        ("delete", detail_url, "auth_staff", 403),
        ("delete", detail_url, "auth_client", 403),
    ]