const KEY = (import.meta.env.SECRET_KEY || "niamind")

export function isUnlocked() {
    return sessionStorage.getItem(KEY) === "1";
}

export function unlock() {
    sessionStorage.setItem(KEY, "1");
}

export function lock() {
    sessionStorage.removeItem(KEY);
}

// TEMP: until auth exists on the API, the code is the same as the key.
export function isValidCode(code) {
    return typeof code === "string" && code.trim() === KEY;
}
