import React from "react";
import { TimetableProvider } from "./TimetableContext";
import { SettingsProvider } from "./SettingsContext";

export const AppProviders = ({ children }) => {
    return (
        <SettingsProvider>
            <TimetableProvider>{children}</TimetableProvider>
        </SettingsProvider>
    );
};

// Re-export hooks for convenience
export { useTimetable } from "./TimetableContext";
export { useSettings } from "./SettingsContext";
