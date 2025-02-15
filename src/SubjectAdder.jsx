import React, { useEffect, useState } from 'react'

const Modal = (props) => {
    if (props.mode !== 'import') { return null }

    return (
        <dialog id="import_modal" className="modal">
            <div className="w-11/12 max-w-7xl modal-box">
                <h3 className="text-lg font-bold">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <p className="py-4">{props.firstText}</p>
                <p className="py-4">{props.secondText}</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

function SubjectAdder({ mode, adder }) {

    let title = 'Tárgy hozzáadása'
    let buttonText = 'Hozzáadás'
    let firstInput = 'Tárgy neve'
    let secondInput = 'Tárgy kódja'

    if (mode === 'import') {
        title = 'Tárgy importálása ELTE TO szerverről'
        buttonText = 'Keresés'
        firstInput = 'Tárgy neve / kódja'
        secondInput = 'Oktató neve'
    }

    const [firstText, setFirst] = useState('')
    const [secondText, setSecond] = useState('')

    useEffect(() => { }, [firstText, secondText])

    const onClick = (e) => {
        e.preventDefault()
        if (mode === 'import') {
            document.getElementById('import_modal').showModal()
        } else {
            let code = secondText
            let name = firstText
            if (name === '') { name = code }
            if (code === '') { code = name }
            adder(code, name)
        }
        console.log(firstText, secondText)
    }

    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">{firstInput}</span>
                    </div>
                    <input type="text" placeholder={firstInput} value={firstText} onChange={(e) => setFirst(e.target.value)} className="w-full input input-bordered" />
                </label>
                <label className="w-full form-control">
                    <div className="label">
                        <span className="label-text">{secondInput}</span>
                    </div>
                    <input type="text" placeholder={secondInput} value={secondText} onChange={(e) => setSecond(e.target.value)} className="w-full input input-bordered" />
                </label>
                <div className="justify-center mt-5 card-actions">
                    <button className="btn btn-primary" onClick={(e) => onClick(e)}>{buttonText}</button>
                </div>
            </div>

            <Modal mode={mode} firstText={firstText} secondText={secondText} />
        </div>
    )
}

export default SubjectAdder