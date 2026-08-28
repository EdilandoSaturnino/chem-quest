import asyncio

import httpx

from app.main import app


def request(method: str, path: str, headers: dict[str, str] | None = None) -> httpx.Response:
    async def send_request() -> httpx.Response:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            return await client.request(method, path, headers=headers)

    return asyncio.run(send_request())


def test_openapi_metadata_is_available() -> None:
    response = request("GET", "/openapi.json")

    assert response.status_code == 200
    assert response.json()["info"] == {
        "title": "Chem Quest Server",
        "version": "0.1.0",
    }


def test_docs_are_available() -> None:
    response = request("GET", "/docs")

    assert response.status_code == 200


def test_cors_allows_the_vite_development_origin_without_credentials() -> None:
    response = request(
        "OPTIONS",
        "/docs",
        {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "access-control-allow-credentials" not in response.headers
