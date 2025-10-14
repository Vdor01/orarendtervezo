import React from 'react';
import { exportTimetableWithCanvas } from './utils/CanvasExport';
import Subjects from './Subjects';
import Menu from './Menu';
import { Timetable, Footer } from './components';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppProviders, useTimetable } from './contexts';
import { useKeyboardShortcuts } from './hooks';

/**
 * The main timetable component that handles calendar display and event interaction.
 * 
 * @returns {JSX.Element} The calendar and related UI components.
 */
function TimetableApp() {
    const { timetableRef } = useTimetable();

    // Enable keyboard shortcuts
    useKeyboardShortcuts();

    /**
     * Exports the timetable as a PNG image using different export methods.
     */
    async function exportTimetableAsPNGHandler() {
        try {
            console.log("Export handler called");

            const calendarElement = timetableRef.current?.elRef?.current?.querySelector('.fc') ||
                timetableRef.current?.el?.querySelector('.fc') ||
                timetableRef.current?.querySelector?.('.fc') ||
                document.querySelector('.fc');

            if (calendarElement) {
                console.log("Exporting with Canvas...");
                await exportTimetableWithCanvas(calendarElement);
                console.log("Canvas export completed");
            } else {
                console.error("Calendar element not found for Canvas export");
                console.log("Available elements with fc class:", document.querySelectorAll('.fc'));
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    }

    return (
        <>
            <div className="justify-center px-5 shadow-sm navbar bg-info">
                <p>Az oldal jelenleg aktív fejlesztés alatt van, türelmeteket kérem. Bármilyen észrevétel és javaslat a fejlesztéshez fontos számomra!</p>
            </div>
            <div className='flex flex-col gap-5 m-8 w-fit'>
                <Menu exportTimetable={exportTimetableAsPNGHandler} />
                <div className='w-full'>
                    <Subjects />
                </div>
                <div className='h-0 divider'></div>
                <Timetable />
            </div>
            <Footer />
            <Analytics />
            <SpeedInsights />
        </>
    );
}

/**
 * The main application component that provides context to all child components.
 * 
 * @returns {JSX.Element} The main application wrapped with context providers.
 */
function App() {
    return (
        <AppProviders>
            <TimetableApp />
        </AppProviders>
    );
}

export default App
