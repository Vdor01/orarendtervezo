/**
 * Modern Canvas-based export using direct element rendering
 * More reliable than SVG foreignObject approach
 */

export async function exportTimetableWithCanvas(calendarElement) {
    try {
        console.log("Starting canvas export with direct rendering...");

        // Create a high-resolution canvas for crisp export quality
        const rect = calendarElement.getBoundingClientRect();
        // Use device pixel ratio for sharp images on high-DPI displays (retina, etc.)
        // Fallback to 2x scaling if devicePixelRatio is not available
        const scale = window.devicePixelRatio || 2;

        const canvas = document.createElement("canvas");
        // Scale canvas dimensions by pixel ratio to maintain quality
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);

        // Set high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Fill background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Draw calendar grid and events directly
        await drawCalendarToCanvas(ctx, calendarElement);

        // Export the canvas
        canvas.toBlob(
            (blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = "orarend.png";
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                console.log("Canvas export completed successfully");
            },
            "image/png",
            1.0,
        );
    } catch (error) {
        console.error("Canvas export failed:", error);
        throw error;
    }
}

async function drawCalendarToCanvas(ctx, calendarElement) {
    // Set basic styles using system font stack for consistency
    ctx.font =
        "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"; // 12px base font size
    ctx.textBaseline = "top"; // Align text from the top for consistent positioning

    // Draw calendar background
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Find and draw time slots
    const timeSlots = calendarElement.querySelectorAll(".fc-timegrid-slot");
    timeSlots.forEach((slot) => {
        const slotRect = slot.getBoundingClientRect();
        const calendarRect = calendarElement.getBoundingClientRect();

        const x = slotRect.left - calendarRect.left;
        const y = slotRect.top - calendarRect.top;
        const width = slotRect.width;
        const height = slotRect.height;

        // Draw grid line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
    });

    // Draw day headers
    const dayHeaders = calendarElement.querySelectorAll(".fc-col-header-cell");
    dayHeaders.forEach((header) => {
        const headerRect = header.getBoundingClientRect();
        const calendarRect = calendarElement.getBoundingClientRect();

        const x = headerRect.left - calendarRect.left;
        const y = headerRect.top - calendarRect.top;
        const width = headerRect.width;
        const height = headerRect.height;

        // Draw header background with light gray color (#f3f4f6 = Tailwind gray-100)
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(x, y, width, height);

        // Draw header text with capitalize transform
        ctx.fillStyle = "#374151"; // Tailwind gray-700 for readable text
        ctx.font =
            "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        let text = header.textContent || "";

        // Apply text-transform: capitalize (proper handling for Hungarian)
        // Only capitalize the first letter of each word, not every word boundary
        text = text
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());

        ctx.fillText(text, x + 8, y + 8);
    });

    // Draw time labels
    const timeLabels = calendarElement.querySelectorAll(
        ".fc-timegrid-slot-label",
    );
    timeLabels.forEach((label) => {
        const labelRect = label.getBoundingClientRect();
        const calendarRect = calendarElement.getBoundingClientRect();

        const x = labelRect.left - calendarRect.left;
        const y = labelRect.top - calendarRect.top;

        const text = label.textContent || "";
        if (text.trim()) {
            ctx.fillStyle = "#6b7280"; // Tailwind gray-500 for subtle time labels
            ctx.fillText(text, x + 4, y + 4); // 4px padding from edges
        }
    });

    // Draw events
    const events = calendarElement.querySelectorAll(".fc-event");
    events.forEach((event) => {
        const eventRect = event.getBoundingClientRect();
        const calendarRect = calendarElement.getBoundingClientRect();

        const x = eventRect.left - calendarRect.left;
        const y = eventRect.top - calendarRect.top;
        const width = eventRect.width;
        const height = eventRect.height;

        // Get event colors from computed styles
        const computedStyle = window.getComputedStyle(event);
        // Fallback to blue (#3b82f6 = Tailwind blue-500) if no background color set
        const backgroundColor = computedStyle.backgroundColor || "#3b82f6";
        const borderColor = computedStyle.borderColor || backgroundColor;

        // Draw event background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, y, width, height);

        // Draw event border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw event text
        const eventContent = event.querySelector(
            ".fc-event-main-frame, .fc-event-main",
        );
        if (eventContent) {
            // Get the custom event content (flex flex-col gap-1 structure)
            const customContent = eventContent.querySelector(
                'div[style*="color"]',
            );

            if (customContent) {
                // Handle custom event content with multiple lines
                const children = Array.from(customContent.children);
                let lineY = y + 4; // Start text 4px from top of event
                const lineHeight = 14; // 14px spacing between text lines
                const maxWidth = width - 8; // Leave 4px padding on each side (8px total)

                // Calculate text color based on background
                const textColor = isLightColor(backgroundColor)
                    ? "#000000"
                    : "#ffffff";
                ctx.fillStyle = textColor;
                ctx.font =
                    "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

                children.forEach((child) => {
                    const text = child.textContent?.trim() || "";
                    // Check if there's space for another line (4px bottom padding)
                    if (text && lineY + lineHeight <= y + height - 4) {
                        // Truncate text if too long
                        let displayText = text;
                        const textWidth = ctx.measureText(displayText).width;

                        if (textWidth > maxWidth) {
                            // Truncate with ellipsis
                            while (
                                ctx.measureText(displayText + "...").width >
                                    maxWidth &&
                                displayText.length > 0
                            ) {
                                displayText = displayText.slice(0, -1);
                            }
                            displayText += "...";
                        }

                        ctx.fillText(displayText, x + 4, lineY); // 4px left padding
                        lineY += lineHeight; // Move to next line
                    }
                });
            } else {
                // Fallback to simple text rendering
                const text = eventContent.textContent || "";
                const textColor = isLightColor(backgroundColor)
                    ? "#000000"
                    : "#ffffff";
                ctx.fillStyle = textColor;
                ctx.font =
                    "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

                // Wrap text if needed
                const maxWidth = width - 8;
                const words = text.split(" ");
                let line = "";
                let lineY = y + 4;

                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + " ";
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(line, x + 4, lineY);
                        line = words[n] + " ";
                        lineY += 14; // 14px line height for text wrapping
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x + 4, lineY);
            }
        }
    });
}

/**
 * Determines if a color is light enough to require dark text for readability.
 * Uses the same luminance calculation as isColorDark in timetableUtils.js.
 *
 * @param {string} color - CSS color string (rgb, rgba, or other format)
 * @returns {boolean} True if the color is light, false otherwise
 */
function isLightColor(color) {
    // Handle RGB/RGBA color format (e.g., "rgb(255, 0, 128)" or "rgba(255, 0, 128, 0.5)")
    if (color.startsWith("rgb")) {
        const matches = color.match(/\d+/g); // Extract all numbers from the string
        if (matches && matches.length >= 3) {
            const r = parseInt(matches[0]); // Red component (0-255)
            const g = parseInt(matches[1]); // Green component (0-255)
            const b = parseInt(matches[2]); // Blue component (0-255)

            // ITU-R BT.709 relative luminance formula (same as isColorDark)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

            // Colors above 128 (middle threshold) are considered light
            return brightness > 128;
        }
    }
    // Default to false for unknown color formats
    return false;
}
