import { useTimetable } from '../../contexts';

/**
 * SubjectModal component allows users to modify the details of a subject.
 * It includes fields for color, code, name, and course type.
 * Uses Context API to access timetable functions.
 * @param {Object} subject - The subject object containing details like code, name, and status.
 * @returns {JSX.Element} A dialog element containing the form for subject modification.
 */
const SubjectModal = ({ subject }) => {
    const { updateSubject } = useTimetable();

    const { color, code: initialCode, name: initialName } = {
        color: subject.status.color,
        code: subject.code,
        name: subject.name
    };

    let type = 'Típusunként egy kurzus';
    if (typeof subject.status.choosen !== 'object') {
        type = subject.status.choosen === -1 ? 'Minden kurzus ki van választva' : 'Egy kurzus';
    }

    /**
     * Handles the save action when the user submits the form.
     * It collects the form data, calls the updateSubject function, and closes the modal.
     * 
     * @param {Event} e - The event object from the form submission.
     */
    const handleSave = (e) => {
        e.preventDefault();
        const form = document.getElementById("subject_form_" + subject.code);
        const formData = new FormData(form);
        updateSubject(
            subject.id,
            formData.get('code'),
            formData.get('name'),
            formData.get('color'),
            formData.get('type')
        );
        document.getElementById("subject_modal_" + subject.code).close();
    };

    /**
     * Handles the cancel action when the user closes the modal without saving.
     * It resets all form fields to their original values and closes the modal.
     * 
     * @param {Event} e - The event object from the button click.
     */
    const handleCancel = (e) => {
        e.preventDefault();
        const form = document.getElementById("subject_form_" + subject.code);
        form.querySelector('input[name="color"]').value = color;
        form.querySelector('input[name="code"]').value = initialCode;
        form.querySelector('input[name="name"]').value = initialName;
        form.querySelector('select[name="type"]').value = type;
        document.getElementById("subject_modal_" + subject.code).close();
    };

    return (
        <dialog id={"subject_modal_" + subject.code} className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Tárgy módosítása</h3>
                <form id={"subject_form_" + subject.code} onSubmit={handleSave} className='flex flex-col items-center justify-between gap-3'>
                    <div className="flex w-full gap-3 mt-5">
                        <label className="w-1/12 form-control">
                            <div className="label">
                                <span className="label-text">Szín</span>
                            </div>
                            <input
                                name='color'
                                type="color"
                                defaultValue={color}
                                className="w-full p-0 input input-bordered"
                            />
                        </label>
                        <label className="w-3/12 form-control">
                            <div className="label">
                                <span className="label-text">Kód</span>
                            </div>
                            <input
                                name='code'
                                type="text"
                                placeholder="Kód"
                                defaultValue={initialCode}
                                className="w-full input input-bordered"
                            />
                        </label>
                        <label className="w-5/12 form-control">
                            <div className="label">
                                <span className="label-text">Név</span>
                            </div>
                            <input
                                name='name'
                                type="text"
                                placeholder="Név"
                                defaultValue={initialName}
                                className="w-full input input-bordered"
                            />
                        </label>
                        <label className="w-3/12 max-w-xs form-control">
                            <div className="label">
                                <span className="label-text">Kurzus típusa</span>
                            </div>
                            <select name='type' defaultValue={type} className="select select-bordered">
                                <option id='egy'>Egy kurzus</option>
                                <option id='tipusonkent'>Típusunként egy kurzus</option>
                                <option id='fix'>Minden kurzus ki van választva</option>
                            </select>
                        </label>
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-error" onClick={handleCancel}>Mégsem</button>
                        <button type="submit" className="btn btn-success">Mentés</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default SubjectModal;
