(function () {
    async function post(path, body) {
        const res = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body || {})
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || ('Request to ' + path + ' failed'));
        return data;
    }

    // Drop-in replacement for the Websim platform SDK globals. The Python
    // backend (server.py) powers the chat completions, image generation and
    // identity, and the localdata folder backs all the saving.
    window.websim = {
        async getCurrentUser() {
            const res = await fetch('/api/me');
            if (!res.ok) throw new Error('Failed to load current user');
            return res.json();
        },
        async getUser() {
            return this.getCurrentUser();
        },
        getCurrentProject: async () => ({ id: 'deltachat', title: 'DELTACHAT', description: 'chat with deltarune characters' }),
        chat: {
            completions: {
                async create({ messages, model, json }) {
                    return { content: (await post('/api/chat/completions', { messages, model, json })).content };
                }
            }
        },
        async imageGen({ prompt, aspect_ratio }) {
            return { url: (await post('/api/imagegen', { prompt, aspect_ratio })).url };
        }
    };
})();