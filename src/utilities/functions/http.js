const fetch = require('node-fetch');
const logger = require('./logger').child({ module: 'http' });
const { createTtlCache } = require('./cache');

const responseCache = createTtlCache({ ttlMs: 30_000, maxSize: 200 });

class HttpError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = 'HttpError';
        this.status = options.status;
        this.method = options.method;
        this.url = options.url;
        this.body = options.body;
        this.cause = options.cause;
    }
}

async function readBodyPreview(response) {
    try {
        const text = await response.text();
        return text.slice(0, 500);
    } catch {
        return undefined;
    }
}

async function fetchJson(url, options = {}) {
    const {
        cacheKey,
        cacheTtlMs,
        label,
        parseJson = true,
        timeoutMs = 10_000,
        ...fetchOptions
    } = options;

    const method = (fetchOptions.method || 'GET').toUpperCase();
    const resolvedCacheKey = cacheKey ?? (method === 'GET' && cacheTtlMs ? url : null);
    if (resolvedCacheKey) {
        const cached = responseCache.get(resolvedCacheKey);
        if (cached !== undefined) return cached;
    }

    const startedAt = Date.now();
    let response;
    try {
        response = await fetch(url, { timeout: timeoutMs, ...fetchOptions });
    } catch (error) {
        throw new HttpError(`Request failed${label ? ` for ${label}` : ''}: ${error.message}`, {
            cause: error,
            method,
            url,
        });
    }

    if (!response.ok) {
        throw new HttpError(
            `Request failed${label ? ` for ${label}` : ''} with HTTP ${response.status}`,
            {
                body: await readBodyPreview(response),
                method,
                status: response.status,
                url,
            }
        );
    }

    let data = null;
    if (parseJson && response.status !== 204) {
        try {
            data = await response.json();
        } catch (error) {
            throw new HttpError(`Invalid JSON${label ? ` for ${label}` : ''}: ${error.message}`, {
                cause: error,
                method,
                status: response.status,
                url,
            });
        }
    }

    if (resolvedCacheKey) responseCache.set(resolvedCacheKey, data, cacheTtlMs);
    logger.debug('HTTP request completed', {
        label,
        method,
        status: response.status,
        ms: Date.now() - startedAt,
    });
    return data;
}

async function postJson(url, body, options = {}) {
    return fetchJson(url, {
        ...options,
        method: 'POST',
        parseJson: options.parseJson ?? false,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
}

module.exports = {
    HttpError,
    fetchJson,
    postJson,
};
