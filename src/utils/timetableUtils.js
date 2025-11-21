/**
 * Gets the date of the next occurrence of a specific day of the week (e.g., 'Hétfő', 'Kedd').
 *
 * @param {string} dayName - The name of the day of the week.
 * @returns {Date} The date of the next occurrence of the specified day.
 */
export function getDateOfThisWeeksDay(dayName) {
    // Hungarian day names mapped to ISO day numbers (1=Monday, 7=Sunday)
    const daysOfWeek = {
        Hétfő: 1,
        Kedd: 2,
        Szerda: 3,
        Csütörtök: 4,
        Péntek: 5,
        Szombat: 6,
        Vasárnap: 0, // Note: 0 for Sunday in JavaScript Date, but we convert below
    };

    // Create date at noon local time to avoid timezone issues
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Set to noon to avoid DST and midnight boundary issues

    const dayIndex = daysOfWeek[dayName];
    // Convert JavaScript's Sunday=0 system to ISO Monday=1 system
    // JavaScript: Sun=0, Mon=1, Tue=2, ..., Sat=6
    // ISO: Mon=1, Tue=2, ..., Sun=7
    const currentDayIndex = today.getDay() === 0 ? 7 : today.getDay();
    const diff = dayIndex - currentDayIndex; // Calculate days to add/subtract

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate;
}

/**
 * Checks if a course should be displayed based on the subject's status and the course's properties.
 * Complex logic handles different course selection modes:
 * 1. Type-based selection (object): Show if no course selected for type OR if this course is selected
 * 2. All-courses mode (-1): Always show all courses
 * 3. Single-course mode: Show if this course is selected OR no course selected yet
 *
 * @param {Object} subject - The subject object containing the status and courses.
 * @param {Object} course - The course object to check for display conditions.
 * @returns {boolean} True if the course should be displayed, false otherwise.
 */
export function isDisplayed(subject, course) {
    // Type-based selection mode (choosen is an object like {Gyakorlat: 0, Előadás: 2})
    if (typeof subject.status.choosen === "object") {
        // Show if no course selected for this type (0) and course is not hidden
        if (subject.status.choosen[course.type] === 0 && course.show !== false)
            return true;
        // Show if this specific course is selected for its type and not hidden
        if (
            subject.status.choosen[course.type] === course.course &&
            course.show !== false
        )
            return true;
    }

    // "All courses selected" mode (-1): Always display all courses
    if (subject.status.choosen === -1) return true;

    // Single course selection mode: Show if this course is selected OR no course selected (0)
    if (
        (subject.status.choosen === course.course || // This course is selected
            subject.status.choosen === 0) && // OR no course selected yet
        course.show !== false // AND course is not manually hidden
    )
        return true;

    // Default: don't display
    return false;
}

/**
 * Checks if a course is chosen/selected based on the subject's selection status.
 * This determines visual highlighting and selection state in the UI.
 *
 * @param {Object} subject - The subject object containing the status and courses.
 * @param {Object} course - The course object to check for chosen status.
 * @returns {boolean} True if the course is chosen, false otherwise.
 */
export function isChoosen(subject, course) {
    // Type-based selection mode (choosen is an object)
    if (typeof subject.status.choosen === "object") {
        // Course is chosen if its code matches the selected course for its type
        if (subject.status.choosen[course.type] === course.course) return true;
        // Explicitly not chosen if different course is selected for this type
        if (subject.status.choosen[course.type] !== course.course) return false;
        return false; // Redundant fallback
    }

    // Single course selection: exact match with selected course
    if (subject.status.choosen === course.course) return true;

    // "All courses selected" mode (-1): all courses are considered chosen
    if (subject.status.choosen === -1) return true;

    // Default: not chosen
    return false;
}

/**
 * Checks if a color is dark based on its hex value.
 * Uses the ITU-R BT.709 relative luminance formula to calculate perceived brightness.
 * This helps determine if white or black text should be used on the color background.
 *
 * @param {string} hexColor - The hex color code (e.g., '#RRGGBB').
 * @returns {boolean} True if the color is dark, false otherwise.
 */
export function isColorDark(hexColor) {
    // Remove the '#' prefix if present
    hexColor = hexColor.replace("#", "");

    // Extract RGB components from hex string (e.g., "FF0080" -> R=255, G=0, B=128)
    const r = parseInt(hexColor.substr(0, 2), 16); // First 2 chars: Red component
    const g = parseInt(hexColor.substr(2, 2), 16); // Middle 2 chars: Green component
    const b = parseInt(hexColor.substr(4, 2), 16); // Last 2 chars: Blue component

    // ITU-R BT.709 relative luminance coefficients for perceived brightness
    // These weights reflect human eye sensitivity: green (0.587) > red (0.299) > blue (0.114)
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Threshold of 128 (middle of 0-255 range) determines dark vs light
    // Colors below 128 are considered dark and need light text
    return brightness < 128;
}
