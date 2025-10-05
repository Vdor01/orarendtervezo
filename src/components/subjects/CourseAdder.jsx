import React from 'react'
import { useSettings, useTimetable } from '../../contexts';

const CourseAdder = ({ subject }) => {

    const { addCourse } = useTimetable();
    const { settings } = useSettings();

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
                input.setCustomValidity("Ennek a mezőnek a kitöltése kötelező!");
                input.reportValidity();
                emptyFields = true;
            } else {
                input.setCustomValidity("");
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
            const endTimeInput = document.querySelector(`#course_form_${subject.id} input[name='endTime']`);
            endTimeInput.setCustomValidity("A végidőpontnak nagyobbnak kell lennie, mint a kezdőidőpont!");
            endTimeInput.reportValidity();
        } else {
            codeInput.setCustomValidity("");
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
            <div className='grid grid-cols-12 gap-4'>
                <fieldset className="col-span-1 fieldset">
                    <legend className="fieldset-legend">Kurzus</legend>
                    <input type="text" name='code' className="input input-sm input-bordered" placeholder="#" />
                    <p className="text-sm label text-error">Kötelező</p>
                </fieldset>
                <fieldset className="col-span-1 fieldset">
                    <legend className="fieldset-legend">Típus</legend>
                    <select name='type' className="w-full select select-sm select-bordered">
                        <option>Gyakorlat</option>
                        <option>Előadás</option>
                    </select>
                </fieldset>
                <fieldset className="col-span-2 fieldset">
                    <legend className="fieldset-legend">Oktató</legend>
                    <input type="text" name='instructor' className="input input-sm input-bordered" placeholder="Példa Béla" />
                    <p className="text-sm label text-error">Kötelező</p>
                </fieldset>
                <fieldset className="col-span-2 fieldset">
                    <legend className="fieldset-legend">Helyszín</legend>
                    <input type="text" name='location' className="input input-sm input-bordered" placeholder="Északi Tömb 7.15 (PC11)" />
                    <p className="text-sm label text-error">Kötelező</p>
                </fieldset>
                <fieldset className="col-span-1 fieldset">
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
                <fieldset className="col-span-2 fieldset">
                    <legend className="fieldset-legend">Időpont</legend>
                    <div className='flex gap-1'>
                        <input
                            type="time"
                            name='startTime'
                            className="input input-bordered input-sm invalid:border-error"
                        />
                        -
                        <input
                            type="time"
                            name='endTime'
                            className="input input-bordered input-sm invalid:border-error"
                        />
                    </div>
                    <p className="text-sm label text-error">Kötelező</p>
                </fieldset>
                <fieldset className="col-span-2 fieldset">
                    <legend className="fieldset-legend">Megjegyzés</legend>
                    <input type="text" name='notes' className="input input-sm input-bordered" placeholder="Megjegyzés" />
                </fieldset>
                <div className='flex justify-center col-span-1 my-auto'>
                    <button className="mb-1 btn btn-circle btn-success" onClick={handleSubmit} title="Kurzus hozzáadása">
                        <i className="pi pi-plus" style={{ fontSize: '1.5rem' }}></i>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CourseAdder