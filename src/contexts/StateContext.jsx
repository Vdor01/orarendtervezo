import React, { createContext, useContext, useState, useMemo } from 'react';

const StateContext = createContext();

export const useAppState = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useAppState must be used within a StateProvider');
    }
    return context;
};

export const StateProvider = ({ children }) => {
    const [state, setState] = useState({
        "settings": {
            "show": {
                "name": true,
                "code": false,
                "time": true,
                "type": false,
                "instructor": true,
                "location": true,
                "notes": false
            },
            "saturday": false,
            "slot": 20
        },
        "currentState": {
            "menu": "Hozzáadás",
            "settings": "show"
        }
    });

    // Initialize from localStorage
    useMemo(() => {
        const savedState = localStorage.getItem('state');
        if (savedState) {
            setState(JSON.parse(savedState));
        }
    }, []);

    // Save to localStorage whenever state changes
    useMemo(() => {
        localStorage.setItem('state', JSON.stringify(state));
    }, [state]);

    /**
     * Updates the state based on the type and event.
     * If type is 'show', it updates the show settings for the specified event.
     * If type is 'misc', it updates the general settings for the specified event.
     * If type is 'currentState', it updates the current state for the specified event.
     * 
     * @param {string} type - The type of state to update ('show', 'misc', or 'currentState').
     * @param {string} event - The specific setting to update (e.g., 'code', 'time').
     * @param {boolean|string|number} value - The new value for the specified setting.
     */
    function updateState(type, event, value) {
        if (type === 'show') {
            setState(prevState => ({
                ...prevState,
                "settings": {
                    ...prevState.settings,
                    "show": {
                        ...prevState.settings.show,
                        [event]: value
                    }
                }
            }));
        } else if (type === 'misc') {
            setState(prevState => ({
                ...prevState,
                "settings": {
                    ...prevState.settings,
                    [event]: value
                }
            }));
        } else if (type === 'currentState') {
            setState(prevState => ({
                ...prevState,
                "currentState": {
                    ...prevState.currentState,
                    [event]: value
                }
            }));
        }
    }

    const value = {
        state,
        updateState,
        // Backward compatibility helpers
        settings: state.settings,
        updateSettings: updateState,
    };

    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    );
};
