// ─── 404 Route Not Found Middleware ─────────────────────────────────────
import { sendError } from '../common/response.js';

const notFoundHandler = (req, res) => {
    return sendError(res, {
        statusCode: 404,
        message: `Route not found: [${req.method}] ${req.originalUrl}`,
    });
};

export default notFoundHandler;