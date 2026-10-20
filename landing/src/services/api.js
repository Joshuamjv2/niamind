import { apiRequest } from "../utils/api";

export function joinWaitlist(payload) {
    return apiRequest("/api/waitlist/", {
        method: "POST",
        body: payload,
    });
}
