// ─── Standard API Response Helpers ──────────────────────────────────────
// Guarantees consistent JSON structure for both success and error responses.

// Sends a structured HTTP success response
export const sendSuccess = (
    res,
    {
        statusCode = 200,
        message = 'Request successful',
        data = null,
        pagination = null,
        summary = null,
    } = {}
) => {
    const responsePayload = {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    };

    if (pagination) responsePayload.pagination = pagination;
    if (summary) responsePayload.summary = summary;

    return res.status(statusCode).json(responsePayload);
};

// Sends a structured HTTP error response
export const sendError = (
    res,
    {
        statusCode = 500,
        message = 'Something went wrong',
        data = null,
    } = {}
) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    });
};