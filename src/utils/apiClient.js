// Wrapper para chamadas à API externa usando process.env.API_URL
// Centraliza headers (ex.: Authorization) e logging para facilitar configuração

export async function apiFetch(path, options = {}) {
    const base = process.env.API_URL;
    if (!base) {
        throw new Error('API_URL não está definida. Defina API_URL no seu .env');
    }

    // Resolve URL com base
    const url = new URL(path, base).toString();

    const opts = { ...options };
    opts.headers = { ...(opts.headers || {}) };

    // Se body for objeto, stringify automaticamente e set Content-Type
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof Buffer)) {
        opts.body = JSON.stringify(opts.body);
        opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
    }

    // Se houver token de API no .env, envie Authorization
    if (process.env.API_TOKEN) {
        opts.headers['Authorization'] = opts.headers['Authorization'] || `Bearer ${process.env.API_TOKEN}`;
    }

    // Log resumido para ajudar na configuração da API externa
    console.log('[apiFetch] ', { method: opts.method || 'GET', url, headersPreview: Object.keys(opts.headers || {}), bodyPreview: typeof opts.body === 'string' ? opts.body.slice(0, 200) : undefined });

    const response = await fetch(url, opts);
    return response;
}

export function buildApiUrl(path) {
    const base = process.env.API_URL || '';
    return new URL(path, base).toString();
}
