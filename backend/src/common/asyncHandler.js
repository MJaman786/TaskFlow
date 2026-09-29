// ─── Async Request Handler Wrapper ──────────────────────────────────────
// Catches rejected promises in controller actions and passes them to next().
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;