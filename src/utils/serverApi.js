/**
 * Server API utilities for communicating with the ELTE Tanrend database.
 * Contains functions for fetching and parsing course data from the server.
 */

/**
 * Parses the course data from the HTML response and extracts relevant information.
 *
 * @param {string} data - The HTML response containing course data.
 * @param {Array} subjectsAccumulator - An array to accumulate unique subjects found in the response.
 * @returns {Array} An array of course objects with parsed details.
 */
export function parseCourseData(data, subjectsAccumulator) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, "text/html");

    if (!htmlDoc || !htmlDoc.getElementById("resulttable")) {
        console.error("No result table found in response");
        return [];
    }

    const rows = htmlDoc.querySelectorAll("#resulttable tbody tr");
    const courses = [];

    rows.forEach((row, index) => {
        const timeInfo = row.querySelector(
            '[data-label="Időpont"]',
        ).textContent;
        const codeInfo = row.querySelector(
            '[data-label="Tárgykód-kurzuskód (típus)"]',
        ).textContent;
        const courseName = row.querySelector(
            '[data-label="Tárgynév"]',
        ).textContent;
        const location = row.querySelector(
            '[data-label="Helyszín"]',
        ).textContent;
        const instructor = row
            .querySelector('[data-label="Oktató / Megjegyzés"]')
            .textContent.trim();

        // Extract Hungarian day names (including common misspelling "Hétfo")
        const dayMatch = timeInfo.match(
            /(Hétfő|Hétfo|Kedd|Szerda|Csütörtök|Péntek|Szombat|Vasárnap)/,
        );
        // Extract time range in HH:MM-HH:MM format (e.g., "14:00-15:30")
        const timeMatch = timeInfo.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);

        if (dayMatch && timeMatch) {
            const day = dayMatch[1];
            const startHour = parseInt(timeMatch[1]);
            const startMin = parseInt(timeMatch[2]);
            const endHour = parseInt(timeMatch[3]);
            const endMin = parseInt(timeMatch[4]);

            // Parse course code format: "SUBJECT-NUMBER (TYPE)" e.g., "IP-18AN1G-1 (gyakorlat)"
            const codeMatch = codeInfo.match(/(.*?)\s+\((.*?)\)/); // Extract code and type in parentheses
            let code = codeMatch ? codeMatch[1] : codeInfo;

            // Extract subject code from full code (e.g., "IP-18AN1G-1" -> "IP-18AN1G")
            const subjectMatch = code.match(/^(.*?)\s*-\s*\d+$/); // Pattern: letters/words followed by dash and numbers
            let subject = subjectMatch ? subjectMatch[1] : code;

            // If subject has spaces, take only the first part (handles multi-word subjects)
            if (subject.includes(" ")) {
                subject = subject.split(" ")[0];
            }

            const type = codeMatch ? codeMatch[2] : ""; // Course type (gyakorlat, előadás, etc.)

            // Extract just the course number from the full code (e.g., "IP-18AN1G-1" -> "1")
            const numberMatch = code.match(/-(\d+)$/);
            code = numberMatch ? numberMatch[1] : code;

            const courseCodeExists = subjectsAccumulator.some(
                (s) => s.code === subject,
            );
            if (!courseCodeExists) {
                subjectsAccumulator.push({
                    id: subjectsAccumulator.length,
                    code: subject,
                    name: courseName,
                });
            }

            const course = {
                id: index,
                subject: subject,
                name: courseName,
                course: code,
                // Capitalize first letter, lowercase the rest (e.g., "gyakorlat" -> "Gyakorlat")
                type:
                    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
                instructor: instructor,
                location: location,
                day: day === "Hétfo" ? "Hétfő" : day, // Fix common misspelling
                // Ensure times are formatted as HH:MM (pad single digits with 0)
                startTime: `${startHour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")}`,
                endTime: `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`,
                notes: "",
                show: true,
            };

            courses.push(course);
        }
    });

    return courses;
}

/**
 * Generates a list of semesters based on the current date.
 * Hungarian university system:
 * - Semester 1: September-January (fall)
 * - Semester 2: February-June (spring)
 *
 * @returns {Array} An array of semester strings in the format "YYYY-YYYY-X", where X is the semester number.
 */
export function getSemesters() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-indexed: 0=January, 5=June, 6=July, etc.
    const semesters = [];

    // July onwards (month >= 6): Fall semester is upcoming/current
    if (currentMonth >= 6) {
        semesters.push(`${currentYear}-${currentYear + 1}-1`); // Current fall semester
        semesters.push(`${currentYear - 1}-${currentYear}-2`); // Previous spring semester
        semesters.push(`${currentYear - 1}-${currentYear}-1`); // Previous fall semester
    }
    // January-June (month < 6): Spring semester is current
    else {
        semesters.push(`${currentYear - 1}-${currentYear}-2`); // Current spring semester
        semesters.push(`${currentYear - 1}-${currentYear}-1`); // Previous fall semester
        semesters.push(`${currentYear - 2}-${currentYear - 1}-2`); // Previous spring semester
    }

    return semesters;
}

/**
 * Gets the current semester based on the current date.
 *
 * @returns {string} The current semester in the format "YYYY-YYYY-X".
 */
export function getCurrentSemester() {
    return getSemesters()[0];
}

/**
 * Fetches course data for a specific subject from the ELTE Tanrend database.
 *
 * @param {string} subjectCode - The code of the subject to fetch courses for.
 * @param {string} semester - The semester to fetch data for (optional, defaults to current semester).
 * @returns {Promise<{courses: Array, subjects: Array}>} Promise that resolves to an object containing courses and subjects arrays.
 */
export async function fetchSubjectCourses(subjectCode, semester = null) {
    if (!semester) {
        semester = getCurrentSemester();
    }

    const API_BASE =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
            ? "/tanrendnavigation.php"
            : "/api/tanrend";

    function getApiUrl(mode) {
        const API_URL = `${API_BASE}?m=${mode}&f=${semester}&k=${encodeURIComponent(subjectCode)}`;
        return API_URL;
    }

    const subjectsAccumulator = [];

    try {
        // Fetch courses by code only
        const response = await fetch(getApiUrl("keres_kod_azon"));
        const data = await response.text();
        const courses = parseCourseData(data, subjectsAccumulator);

        // Filter courses for this specific subject (should already be filtered, but just to be safe)
        const subjectCourses = courses.filter(
            (course) => course.subject === subjectCode,
        );

        return {
            courses: subjectCourses,
            subjects: subjectsAccumulator,
        };
    } catch (error) {
        console.error("Error fetching subject courses:", error);
        throw error;
    }
}

/**
 * Searches for courses by subject name/code using both code and name search modes.
 * This is used for the search functionality in ServerQuery component.
 *
 * @param {string} searchTerm - The search term (subject name or code).
 * @param {string} semester - The semester to fetch data for (optional, defaults to current semester).
 * @returns {Promise<{courses: Array, subjects: Array}>} Promise that resolves to an object containing courses and subjects arrays.
 */
export async function searchCoursesBySubject(searchTerm, semester = null) {
    if (!semester) {
        semester = getCurrentSemester();
    }

    const API_BASE =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
            ? "/tanrendnavigation.php"
            : "/api/tanrend";

    function getApiUrl(mode) {
        const API_URL = `${API_BASE}?m=${mode}&f=${semester}&k=${encodeURIComponent(searchTerm)}`;
        return API_URL;
    }

    const subjectsAccumulator = [];

    try {
        // Fetch courses by code
        const response1 = await fetch(getApiUrl("keres_kod_azon"));
        const data1 = await response1.text();
        const firstCourses = parseCourseData(data1, subjectsAccumulator);

        // Fetch courses by name
        const response2 = await fetch(getApiUrl("keresnevre"));
        const data2 = await response2.text();
        const secondCourses = parseCourseData(data2, subjectsAccumulator);

        // Combine and deduplicate courses
        const allCourses = [...firstCourses, ...secondCourses];
        const uniqueCourses = allCourses.filter((course, index, self) => {
            return (
                index ===
                self.findIndex(
                    (c) =>
                        c.subject === course.subject &&
                        c.course === course.course &&
                        c.type === course.type &&
                        c.day === course.day &&
                        c.startTime === course.startTime &&
                        c.endTime === course.endTime &&
                        c.instructor === course.instructor &&
                        c.location === course.location,
                )
            );
        });

        return {
            courses: uniqueCourses.map((course, index) => ({
                ...course,
                id: index,
            })),
            subjects: subjectsAccumulator,
        };
    } catch (error) {
        console.error("Error searching courses:", error);
        throw error;
    }
}

/**
 * Searches for courses that match both subject and instructor criteria.
 * Fetches both subject and instructor results separately, then returns the intersection.
 *
 * @param {string} subjectTerm - The search term for subject (name or code).
 * @param {string} instructorName - The name of the instructor.
 * @param {string} semester - The semester to fetch data for (optional, defaults to current semester).
 * @returns {Promise<{courses: Array, subjects: Array}>} Promise that resolves to an object containing courses and subjects arrays.
 */
export async function searchCoursesBySubjectAndInstructor(
    subjectTerm,
    instructorName,
    semester = null,
) {
    if (!semester) {
        semester = getCurrentSemester();
    }

    try {
        // Fetch courses by subject
        const { courses: subjectCourses, subjects: subjectSubjects } =
            await searchCoursesBySubject(subjectTerm, semester);

        // Fetch courses by instructor
        const { courses: instructorCourses } = await searchCoursesByInstructor(
            instructorName,
            semester,
        );

        // Find intersection: courses that appear in both results
        const intersectionCourses = subjectCourses.filter((subjectCourse) => {
            return instructorCourses.some(
                (instructorCourse) =>
                    subjectCourse.subject === instructorCourse.subject &&
                    subjectCourse.course === instructorCourse.course &&
                    subjectCourse.type === instructorCourse.type &&
                    subjectCourse.day === instructorCourse.day &&
                    subjectCourse.startTime === instructorCourse.startTime &&
                    subjectCourse.endTime === instructorCourse.endTime &&
                    subjectCourse.instructor === instructorCourse.instructor &&
                    subjectCourse.location === instructorCourse.location,
            );
        });

        // Filter subjects to only include those that have matching courses
        const relevantSubjects = subjectSubjects.filter((subject) =>
            intersectionCourses.some(
                (course) => course.subject === subject.code,
            ),
        );

        return {
            courses: intersectionCourses.map((course, index) => ({
                ...course,
                id: index,
            })),
            subjects: relevantSubjects,
        };
    } catch (error) {
        console.error(
            "Error searching courses by subject and instructor:",
            error,
        );
        throw error;
    }
}

/**
 * Searches for courses by instructor name.
 *
 * @param {string} instructorName - The name of the instructor to search for.
 * @param {string} semester - The semester to fetch data for (optional, defaults to current semester).
 * @returns {Promise<{courses: Array, subjects: Array}>} Promise that resolves to an object containing courses and subjects arrays.
 */
export async function searchCoursesByInstructor(
    instructorName,
    semester = null,
) {
    if (!semester) {
        semester = getCurrentSemester();
    }

    const API_BASE =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
            ? "/tanrendnavigation.php"
            : "/api/tanrend";

    function getApiUrl(mode) {
        const API_URL = `${API_BASE}?m=${mode}&f=${semester}&k=${encodeURIComponent(instructorName)}`;
        return API_URL;
    }

    const subjectsAccumulator = [];

    try {
        // Fetch courses by instructor
        const response = await fetch(getApiUrl("keres_okt"));
        const data = await response.text();
        const courses = parseCourseData(data, subjectsAccumulator);

        return {
            courses: courses,
            subjects: subjectsAccumulator,
        };
    } catch (error) {
        console.error("Error searching courses by instructor:", error);
        throw error;
    }
}
