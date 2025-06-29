/**
 * Footer component that displays the footer of the application.
 * 
 * @returns {JSX.Element} The footer element containing information and links.
 */
function Footer() {
    return (
        <footer className="items-center p-4 footer sm:footer-horizontal bg-neutral text-neutral-content">
            <aside className="items-center grid-flow-col">
                <p>Készült <i className="pi pi-heart-fill"></i>-el.</p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <a href="https://github.com/Vdor01/orarendtervezo" target="_blank">
                    <i className='text-2xl pi pi-github'></i>
                </a>
            </nav>
        </footer>
    )
}

export default Footer