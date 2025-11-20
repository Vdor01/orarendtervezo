import { useState } from 'react'
import { useSettings, useTimetable } from '../../contexts';

const CourseAdder = ({ subject }) => {

    const { addCourse } = useTimetable();
    const { settings } = useSettings();

    const [errors, setErrors] = useState({
        code: false,
        instructor: false,
        location: false,
        startTime: false,
        endTime: false,
        invalidTime: false
    });

    /**
     * Handles the submission of the course form.
     * It collects the form data, validates the course code, and calls the addCourse function.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    function handleSubmit(e) {
        e.preventDefault();
        const form = document.getElementById("course_form_" + subject.id);
        const formData = new FormData(form);

        let emptyFields = false;

        const dataNames = ['code', 'instructor', 'location', 'startTime', 'endTime'];
        dataNames.forEach(name => {
            const input = form.querySelector(`#course_form_${subject.id} input[name='${name}']`);
            if (!input.value) {
                setErrors(prev => ({ ...prev, [name]: true }));
                emptyFields = true;
            } else {
                setErrors(prev => ({ ...prev, [name]: false }));
            }
        });

        const codeInput = document.querySelector(`#course_form_${subject.id} input[name='code']`);
        const codeInputValue = codeInput.value;
        const codeError = codeInputValue === "0" || codeInputValue === "-1";

        if (codeError) {
            codeInput.setCustomValidity("A kód nem lehet 0 vagy -1!");
            codeInput.reportValidity();
        } else if (emptyFields) {
            // Do nothing, as the individual fields have already reported their validity
        } else if (formData.get('startTime') >= formData.get('endTime')) {
            setErrors(prev => ({ ...prev, invalidTime: true }));
            const endTimeInput = document.querySelector(`#course_form_${subject.id} input[name='endTime']`);
            endTimeInput.reportValidity();
        } else {
            codeInput.setCustomValidity("");
            setErrors(prev => ({ ...prev, invalidTime: false }));
            addCourse(
                subject.id,
                formData.get('code'),
                formData.get('type'),
                formData.get('instructor'),
                formData.get('location'),
                formData.get('day'),
                formData.get('startTime'),
                formData.get('endTime'),
                formData.get('notes')
            );
        }
    }

    return (
        <form className='w-full' id={"course_form_" + subject.id} onSubmit={(e) => e.preventDefault()}>
            <div className='flex flex-wrap justify-between w-full gap-2 p-2 h-28'>
                <fieldset className="max-w-16 fieldset">
                    <legend className="fieldset-legend">Kurzus</legend>
                    <input type="text" name='code' className={`input input-sm input-bordered ${errors.code ? "border-error" : ""}`} placeholder="#" />
                    {errors.code && <p className="text-sm label text-error">Kötelező</p>}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Típus</legend>
                    <select name='type' className="w-full select select-sm select-bordered">
                        <option>Gyakorlat</option>
                        <option>Előadás</option>
                    </select>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Oktató</legend>
                    <input type="text" name='instructor' className={`input input-sm input-bordered ${errors.instructor ? "border-error" : ""}`} placeholder="Példa Béla" />
                    {errors.instructor && <p className="text-sm label text-error">Kötelező</p>}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Helyszín</legend>
                    <input type="text" name='location' className={`input input-sm input-bordered ${errors.location ? "border-error" : ""}`} placeholder="Északi Tömb 7.15 (PC11)" />
                    {errors.location && <p className="text-sm label text-error">Kötelező</p>}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Nap</legend>
                    <select name='day' className="w-full select select-sm select-bordered">
                        <option>Hétfő</option>
                        <option>Kedd</option>
                        <option>Szerda</option>
                        <option>Csütörtök</option>
                        <option>Péntek</option>
                        {settings.saturday && <option>Szombat</option>}
                    </select>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Időpont</legend>
                    <div className='flex gap-1'>
                        <input
                            type="time"
                            name='startTime'
                            className={`input input-bordered input-sm ${errors.startTime ? "border-error" : ""}`}
                        />
                        -
                        <input
                            type="time"
                            name='endTime'
                            className={`input input-bordered input-sm ${errors.endTime ? "border-error" : ""}`}
                        />
                    </div>
                    {(errors.endTime || errors.startTime) && <p className="text-sm label text-error">Kötelező</p>}
                    {(errors.invalidTime && !errors.endTime && !errors.startTime) && <p className="text-sm label text-error">Hibás időintervallum! <i className='pl-4 pi pi-question-circle' title='A befejezési időnek később kell lennie, mint a kezdésnek!' style={{ fontSize: '1rem' }}></i></p>}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Megjegyzés</legend>
                    <input type="text" name='notes' className="input input-sm input-bordered" placeholder="Megjegyzés" />
                </fieldset>
                <div className='flex justify-center my-auto'>
                    <button className="mb-1 btn btn-circle btn-success" onClick={handleSubmit} title="Kurzus hozzáadása">
                        <i className="pi pi-plus" style={{ fontSize: '1.5rem' }}></i>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CourseAdder