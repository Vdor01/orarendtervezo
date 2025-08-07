import React, { useState } from 'react';
import {
    SubjectAdder,
    ServerQuery,
    ImportExport,
    Settings,
    Help,
    Button
} from './components';

/**
 * Menu component serves as the main navigation menu for the application.
 * It allows users to switch between different modes such as adding subjects, querying the server,
 * importing/exporting data, adjusting settings, and accessing help.
 * 
 * @param {function} exportTimetable - Function to export the timetable as PNG.
 * @return {JSX.Element} A div containing the current mode's content and a set of buttons to switch modes.
 */
const Menu = ({ exportTimetable }) => {
    const [mode, setMode] = useState('Hozzáadás');

    const modeSwitch = (param) => {
        switch (param) {
            case 'Hozzáadás':
                return <SubjectAdder />;
            case 'Lekérés':
                return <ServerQuery />;
            case 'Import / Export':
                return <ImportExport exportTimetable={exportTimetable} />;
            case 'Beállítások':
                return <Settings />;
            case 'Súgó':
                return <Help />;
            default:
                return <SubjectAdder />;
        }
    };

    return (
        <div className='flex content-between'>
            {modeSwitch(mode)}
            <div className="divider divider-horizontal"></div>
            <div className='flex flex-col justify-between w-64 gap-3 buttons'>
                <Button text={'Hozzáadás'} icon={'plus'} mode={mode} set={setMode} />
                <Button text={'Lekérés'} icon={'server'} mode={mode} set={setMode} />
                <Button text={'Import / Export'} icon={'file-import'} mode={mode} set={setMode} />
                <Button text={'Beállítások'} icon={'cog'} mode={mode} set={setMode} />
                <Button text={'Súgó'} icon={'question-circle'} mode={mode} set={setMode} />
            </div>
        </div>
    );
};

export default Menu;