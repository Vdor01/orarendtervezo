import React, { createContext, useContext, useState, useMemo } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        "show": {
            "code": false,
            "time": true,
            "type": false,
            "instructor": true,
            "location": true,
            "notes": false
        },
        "saturday": false,
        "slot": 20
    });

    // Initialize from localStorage
    useMemo(() => {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Save to localStorage whenever settings change
    useMemo(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    /**
     * Updates the settings state based on the type and event.
     * If type is 'show', it updates the show settings for the specified event.
     * Otherwise, it updates the general settings for the specified event.
     * 
     * @param {string} type - The type of settings to update ('show' or general).
     * @param {string} event - The specific setting to update (e.g., 'code', 'time').
     * @param {boolean} value - The new value for the specified setting.
     */
    function updateSettings(type, event, value) {
        if (type === 'show') {
            setSettings(prevSettings => ({
                ...prevSettings,
                "show": {
                    ...prevSettings.show,
                    [event]: value
                },
            }));
        } else {
            setSettings(prevSettings => ({
                ...prevSettings,
                [event]: value
            }));
        }
    }

    const value = {
        settings,
        updateSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
