/**
 * Gets the date of the next occurrence of a specific day of the week (e.g., 'Hétfő', 'Kedd').
 *
 * @param {string} dayName - The name of the day of the week.
 * @returns {Date} The date of the next occurrence of the specified day.
 */
export function getDateOfThisWeeksDay(dayName) {
    const daysOfWeek = {
        Hétfő: 1,
        Kedd: 2,
        Szerda: 3,
        Csütörtök: 4,
        Péntek: 5,
        Szombat: 6,
        Vasárnap: 0,
    };

    const today = new Date();
    const dayIndex = daysOfWeek[dayName];
    const currentDayIndex = today.getDay() === 0 ? 7 : today.getDay(); // Adjust for Sunday being 0
    const diff = dayIndex - currentDayIndex;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate;
}

/**
 * Checks if a course should be displayed based on the subject's status and the course's properties.
 *
 * @param {Object} subject - The subject object containing the status and courses.
 * @param {Object} course - The course object to check for display conditions.
 * @returns {boolean} True if the course should be displayed, false otherwise.
 */
export function isDisplayed(subject, course) {
    if (typeof subject.status.choosen === "object") {
        if (subject.status.choosen[course.type] === 0 && course.show !== false)
            return true;
        if (
            subject.status.choosen[course.type] === course.course &&
            course.show !== false
        )
            return true;
    }
    if (subject.status.choosen === -1) return true;
    if (
        (subject.status.choosen === course.course ||
            subject.status.choosen === 0) &&
        course.show !== false
    )
        return true;
    return false;
}

/**
 * Checks if a course is chosen based on the subject's status and the course's properties.
 *
 * @param {Object} subject - The subject object containing the status and courses.
 * @param {Object} course - The course object to check for chosen status.
 * @returns {boolean} True if the course is chosen, false otherwise.
 */
export function isChoosen(subject, course) {
    if (typeof subject.status.choosen === "object") {
        if (subject.status.choosen[course.type] === course.course) return true;
        if (subject.status.choosen[course.type] !== course.course) return false;
        return false;
    }

    if (subject.status.choosen === course.course) return true;
    if (subject.status.choosen === -1) return true;
    return false;
}

/**
 * Checks if a color is dark based on its hex value.
 * It calculates the perceived brightness using the relative luminance formula and returns true if the color is dark.
 *
 * @param {string} hexColor - The hex color code (e.g., '#RRGGBB').
 * @returns {boolean} True if the color is dark, false otherwise.
 */
export function isColorDark(hexColor) {
    hexColor = hexColor.replace("#", "");

    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    return brightness < 128;
}
