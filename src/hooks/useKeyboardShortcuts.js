import { useEffect } from "react";
import { useSettings } from "../contexts";

/**
 * Custom hook for handling keyboard shortcuts throughout the application.
 * Currently handles:
 * - Ctrl + K: Toggle subject view between 'list' and 'timetable'
 */
export const useKeyboardShortcuts = () => {
    const { settings, updateSettings } = useSettings();

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ctrl + K: Toggle subject view
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();

                const newSubjectView =
                    settings.subjectView === "list" ? "timetable" : "list";
                updateSettings("misc", "subjectView", newSubjectView);

                // Optional: Show a brief notification to the user
                console.log(`Subject view switched to: ${newSubjectView}`);
            }
        };

        // Add event listener to document
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [settings.subjectView, updateSettings]);
};
