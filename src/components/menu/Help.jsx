/**
 * Help component provides information about the website's purpose and how to use it.
 * It explains the functionality of the site, how to select courses, and the types of subjects available.
 * 
 * @returns {JSX.Element} A card containing help information with headings and paragraphs.
 */
const Help = () => {
    return (
        <div className="w-full shadow-xl card bg-base-300 card-compact">
            <div className="card-body">
                <h2 className="card-title">Súgó</h2>
                <div className='flex flex-row pt-3'>
                    <div className='grid w-1/4 gap-3 text-sm place-content-start'>
                        <h3 className='mb-5 font-bold'>Az oldal</h3>
                        <p>A weboldal célja, hogy a felhasználó egyszerre láthassa az összes lehetséges óráját és így dönthessen azok felvételéről.</p>
                        <p>Ezt egyszerűen, a kívánt kurzusra való kattintással megteheti.</p>
                        <p>Minden alkalommal, amikor kiválaszt egy kurzust, a többi eltűnik, beállítástól függően.</p>
                        <p>Bővebb információk megtalálhatók a <a href="https://github.com/Vdor01/orarendtervezo/wiki" className='btn-link' target="_blank" rel="noopener noreferrer">wiki oldalon</a>.</p>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className='w-1/4 text-sm'>
                        <h3 className='mb-5 font-bold'>A gombok</h3>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-eye' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Elrejtés</p>
                        </div>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-sync' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Tárgy frissítése</p>
                        </div>
                        <p className='ml-8'>Megpróbálja frissíteni a tárgyat adatbázisból.</p>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-pen-to-square' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Szerkesztés</p>
                        </div>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-trash' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Törlés</p>
                        </div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className='w-1/4 text-sm'>
                        <h3 className='mb-5 font-bold'>A színek</h3>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <span className="w-6 h-6 px-3 btn-circle bg-base-200"></span>
                            <p className='text-lg'>Nincs kiválasztva kurzus</p>
                        </div>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <span className="w-6 h-6 px-3 btn-circle bg-error"></span>
                            <p className='text-lg'>Nincs kurzus</p>
                        </div>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <span className="w-6 h-6 px-3 btn-circle bg-info"></span>
                            <p className='text-lg'>Egy kurzus már ki van választva</p>
                        </div>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <span className="w-6 h-6 px-3 btn-circle bg-success"></span>
                            <p className='text-lg'>Nincs vele több munka</p>
                        </div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className='text-sm'>
                        <h3 className='font-bold '>Tárgyak típusai</h3>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-check-circle' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Egy kurzus</p>
                        </div>
                        <p className='ml-8'>A tárgyból csak egy kurzust választhatunk, típusától (pl. Gyakorlat) függetlenül.</p>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-list' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Típusunként egy kurzus</p>
                        </div>
                        <p className='ml-8'>A tárgyból típusonként egy-egy kurzust választhatunk.</p>
                        <div className='flex flex-row items-center gap-5 mt-5 mb-2'>
                            <i className='pi pi-lock' style={{ fontSize: '1.5rem' }}></i>
                            <p className='text-lg'>Minden kurzus ki van választva</p>
                        </div>
                        <p className='ml-8'>A tárgyból automatikusan minden kurzus ki van választva.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
