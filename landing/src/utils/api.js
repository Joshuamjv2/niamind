const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export async function apiRequest(endpoint, { method = "GET", headers = {}, body, ...options } = {}) {
    const url = `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`;

    const response = await fetch(url, {
        ...options,
        method,
        credentials: "include",
        headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    // 204 No Content (and 205 Reset Content) never have a body.
    if (response.status === 204 || response.status === 205) {
        if (!response.ok) {
            const error = new Error(`Request failed (${response.status})`);
            error.status = response.status;
            throw error;
        }
        return null;
    }

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            typeof data === "object" && data !== null
                ? typeof data.detail === "string"
                    ? data.detail
                    : `Request failed (${response.status})`
                : data || `Request failed (${response.status})`;

        const error = new Error(message);
        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}
