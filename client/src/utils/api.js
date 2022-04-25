const api = async (url, body, method = 'GET') => {
    if (body) body=JSON.stringify(body);
    const headers = { 'Content-Type': 'application/json' };

    try {
        const res = await fetch(url, { method, headers, body });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        return json;
    } catch (err) {
        if (err.message === 'Failed to fetch') return {
            success: false, message: 'A server error occured. Please try again later.'
        };
        return { success: false, message: err.message };
    }
}

export default api;
