const LEVELS = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

function getActiveLevel() {
    const configuredLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
    return LEVELS[configuredLevel] ?? LEVELS.info;
}

function serializeValue(value) {
    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack,
            code: value.code,
            status: value.status,
        };
    }

    return value;
}

function serializeContext(context = {}) {
    const entries = Object.entries(context)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, serializeValue(value)]);

    if (entries.length === 0) return '';

    try {
        return ` ${JSON.stringify(Object.fromEntries(entries))}`;
    } catch {
        return ' {"context":"unserializable"}';
    }
}

function write(level, message, context) {
    if (LEVELS[level] < getActiveLevel()) return;

    const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${serializeContext(context)}`;
    const writer =
        level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    writer(line);
}

function child(baseContext = {}) {
    return {
        debug: (message, context = {}) => write('debug', message, { ...baseContext, ...context }),
        info: (message, context = {}) => write('info', message, { ...baseContext, ...context }),
        warn: (message, context = {}) => write('warn', message, { ...baseContext, ...context }),
        error: (message, context = {}) => write('error', message, { ...baseContext, ...context }),
    };
}

module.exports = {
    debug: (message, context = {}) => write('debug', message, context),
    info: (message, context = {}) => write('info', message, context),
    warn: (message, context = {}) => write('warn', message, context),
    error: (message, context = {}) => write('error', message, context),
    child,
};
