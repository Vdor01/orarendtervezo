import { useState } from 'react';
import { useTimetable, useSettings } from '../../contexts';

/**
 * SubjectAdder component allows users to add a new subject by providing its name and code.
 * 
 * @returns {JSX.Element} A form for adding a subject with input fields for name and code.
 */
const SubjectAdder = () => {
    const { addSubject } = useTimetable();
    const { settings } = useSettings();

    const [subjectName, setName] = useState('');
    const [subjectCode, setCode] = useState('');
    const [isError, setIsError] = useState(false);

    /**
     * Handles the click event for adding a subject.
     * It prevents the default form submission, checks if the name or code is empty,
     * and calls the adder function with the provided name and code.
     * 
     * @param {Event} e - The click event object.
     */
    const onClick = (e) => {
        e.preventDefault();

        let code = subjectCode;
        let name = subjectName;
        if (code === '' && name === '') {
            setIsError(true);
            return;
        }
        setIsError(false);
        if (name === '') { name = code; }
        if (code === '') { code = name.replace(/\s+/g, '_').toLowerCase(); }

        console.log(`Adding subject: ${name} (${code})`);
        addSubject(code, name);
    };

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <form className="card-body" id='subject_adder_form'>
                <h2 className="card-title">Tárgy hozzáadása</h2>
                <div className='flex flex-row grow'>
                    <div className='flex flex-col w-full gap-2'>
                        <label className="w-full form-control">
                            <div className="label">
                                <span className="label-text">Tárgy neve</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Tárgy neve"
                                value={subjectName}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full input input-bordered"
                            />
                        </label>
                        <label className="w-full form-control">
                            <div className="label">
                                <span className="label-text">Tárgy kódja</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Tárgy kódja"
                                value={subjectCode}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full input input-bordered"
                            />
                        </label>
                        <div className="justify-center mt-5 card-actions">
                            <button className="btn btn-primary" onClick={(e) => onClick(e)}>
                                Hozzáadás
                            </button>
                        </div>
                        {isError &&
                            <p className="mt-3 text-center text-error">
                                Tárgy hozzáadásához legalább a név vagy a kód megadása szükséges!
                            </p>
                        }
                    </div>
                    {(settings.tips ?? true) && (
                        <>
                            <div className="divider divider-horizontal"></div>
                            <div className="grid w-1/4 gap-3 text-sm place-content-start">
                                <p>A tárgy hozzáadásához add meg a tárgy nevét és/vagy kódját.</p>
                                <p>Ha csak az egyik mezőt töltöd ki, a másik automatikusan generálódik.</p>
                                <p>Mindkét mező kitöltése esetén a megadott értékek kerülnek használatra.</p>
                                <p>Ügyelj arra, hogy a kód egyedi legyen az ütközések elkerülése érdekében.</p>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SubjectAdder;
