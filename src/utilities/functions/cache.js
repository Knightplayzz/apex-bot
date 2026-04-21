function createTtlCache({ ttlMs = 60_000, maxSize = 500 } = {}) {
    const entries = new Map();

    function pruneExpired(now = Date.now()) {
        for (const [key, entry] of entries) {
            if (entry.expiresAt <= now) entries.delete(key);
        }
    }

    function enforceMaxSize() {
        while (entries.size > maxSize) {
            const oldestKey = entries.keys().next().value;
            entries.delete(oldestKey);
        }
    }

    return {
        get(key) {
            const entry = entries.get(key);
            if (!entry) return undefined;

            if (entry.expiresAt <= Date.now()) {
                entries.delete(key);
                return undefined;
            }

            return entry.value;
        },

        set(key, value, ttlOverrideMs = ttlMs) {
            entries.set(key, {
                value,
                expiresAt: Date.now() + ttlOverrideMs,
            });
            pruneExpired();
            enforceMaxSize();
            return value;
        },

        delete(key) {
            entries.delete(key);
        },

        clear() {
            entries.clear();
        },

        async getOrSet(key, loader, ttlOverrideMs = ttlMs) {
            const cachedValue = this.get(key);
            if (cachedValue !== undefined) return cachedValue;

            const value = await loader();
            this.set(key, value, ttlOverrideMs);
            return value;
        },
    };
}

module.exports = { createTtlCache };
