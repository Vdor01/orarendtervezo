import React from 'react';

/**
 * Button component renders a button with an icon and text.
 * It applies different styles based on the current mode and whether the button is disabled.
 * @param {string} text - The text to display on the button.
 * @param {string} icon - The icon class to display on the button.
 * @param {string} mode - The current mode to determine the button's style.
 * @param {function} set - Function to set the current mode when the button is clicked.
 * @param {boolean} isDisabled - Indicates whether the button should be disabled.
 * @returns {JSX.Element} A button element with the specified text, icon, and styles.
 */
const Button = ({ text, icon, mode, set, isDisabled }) => {
    const isActive = mode === text;
    const buttonClass = `2xl:btn-lg justify-start w-full btn btn-md hover:border-primary flex-1 ${isActive
            ? "bg-primary text-base-300 hover:bg-primary"
            : "hover:bg-base-100"
        }`;

    return (
        <button
            className={buttonClass}
            onClick={() => set(text)}
            disabled={isDisabled}
        >
            <i className={`pi pi-${icon}`}></i>
            {text}
        </button>
    );
};

export default Button;
