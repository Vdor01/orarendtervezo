import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts';

/**
 * Settings component allows users to customize the display settings of the schedule.
 * It includes options to show/hide course code, time, type, instructor, location, and notes,
 * as well as settings for the calendar display such as showing Saturday and setting the time interval.
 * 
 * @return {JSX.Element} A card containing checkboxes and input fields for various settings.
 */
const Settings = () => {
    const { settings, updateSettings } = useSettings();

    const { show, saturday, slot } = settings;
    const { name, code, time, type, instructor, location, notes } = show;

    // Helyi state az időintervallum mező számára
    const [slotInputValue, setSlotInputValue] = useState(slot.toString());

    // Frissítjük a helyi state-et, ha a globális slot érték változik
    useEffect(() => {
        setSlotInputValue(slot.toString());
    }, [slot]);

    const MIN_SLOT = 10;
    const MAX_SLOT = 60;
    const DEFAULT_SLOT = 20;
    const SLOT_STEP = 5;

    /**
     * Sets the visibility of a specific setting based on user interaction.
     * 
     * @param {string} event - The name of the setting to update (e.g., 'code', 'time').
     * @param {boolean} value - The new value for the setting (true to show, false to hide).
     */
    function setShowSettings(event, value) {
        updateSettings('show', event, value);
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Beállítások</h2>
                <div className='flex flex-row gap-8 pt-3'>
                    <div className='grid w-1/4 grid-cols-2 gap-2 form-control'>
                        <h3 className='col-span-2 mb-5 font-bold'>Megjelenő információk</h3>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={name}
                                onChange={() => setShowSettings('name', !name)}
                                className="checkbox"
                            />
                            <span className="label-text">Név</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={code}
                                onChange={() => setShowSettings('code', !code)}
                                className="checkbox"
                            />
                            <span className="label-text">Kurzus</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={time}
                                onChange={() => setShowSettings('time', !time)}
                                className="checkbox"
                            />
                            <span className="label-text">Idő</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={type}
                                onChange={() => setShowSettings('type', !type)}
                                className="checkbox"
                            />
                            <span className="label-text">Típus</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={instructor}
                                onChange={() => setShowSettings('instructor', !instructor)}
                                className="checkbox"
                            />
                            <span className="label-text">Oktató</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={location}
                                onChange={() => setShowSettings('location', !location)}
                                className="checkbox"
                            />
                            <span className="label-text">Helyszín</span>
                        </label>
                        <label className="justify-start gap-3 cursor-pointer label">
                            <input
                                type="checkbox"
                                checked={notes}
                                onChange={() => setShowSettings('notes', !notes)}
                                className="checkbox"
                            />
                            <span className="label-text">Megjegyzés</span>
                        </label>
                    </div>
                    <div className='flex w-1/4 gap-2 form-control'>
                        <h3 className='mb-5 font-bold'>Naptár</h3>
                        <label className="cursor-pointer label">
                            <span className="label-text">Szombat</span>
                            <input
                                type="checkbox"
                                checked={saturday}
                                onChange={() => updateSettings('misc', 'saturday', !saturday)}
                                className="checkbox"
                            />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Időintervallum (perc)</span>
                            <input
                                type="number"
                                step={SLOT_STEP}
                                min={MIN_SLOT}
                                max={MAX_SLOT}
                                value={slotInputValue}
                                onChange={(e) => {
                                    setSlotInputValue(e.target.value);
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= MIN_SLOT && value <= MAX_SLOT) {
                                        updateSettings('misc', 'slot', value);
                                    }
                                }}
                                onBlur={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value) || value < MIN_SLOT) {
                                        setSlotInputValue(DEFAULT_SLOT.toString());
                                        updateSettings('misc', 'slot', DEFAULT_SLOT);
                                    } else if (value > MAX_SLOT) {
                                        setSlotInputValue(MAX_SLOT.toString());
                                        updateSettings('misc', 'slot', MAX_SLOT);
                                    }
                                }}
                                className="w-16 input input-sm"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
