import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToHash() {
    const location = useLocation();

    useEffect(() => {
        // Check if there's a hash in the URL
        if (location.hash) {
            // Remove the # from the hash
            const id = location.hash.substring(1);
            // Wait a tiny bit for the page to render
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }, [location]);
}
