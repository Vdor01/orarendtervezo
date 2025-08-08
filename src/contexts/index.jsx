import React from "react";
import { TimetableProvider } from "./TimetableContext";
import { StateProvider } from "./StateContext";

export const AppProviders = ({ children }) => {
    return (
        <StateProvider>
            <TimetableProvider>{children}</TimetableProvider>
        </StateProvider>
    );
};

// Re-export hooks for convenience
export { useTimetable } from "./TimetableContext";
export { useAppState } from "./StateContext";
// Backward compatibility
export { useAppState as useSettings } from "./StateContext";
