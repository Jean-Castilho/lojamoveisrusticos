const handleAuthRequest = async (req, res, next, endpoint, body, successMessage, errorMessage) => {
    try {

        console.log('[handleAuthRequest] endpoint:', endpoint);

        // Construir URL da API externa a ser chamada
        const urlPath = `/public/${endpoint}`;


        console.log('[handleAuthRequest] calling external API', { urlPath, method: 'POST', body });

        // Chamada ao serviço externo. A API externa deve retornar JSON com
        // pelo menos um campo `user` quando o login/registro for bem-sucedido.
        // A API também pode enviar um token — adapte conforme necessário.
        import('../utils/apiClient.js').then(({ apiFetch }) => apiFetch(urlPath, { method: 'POST', body })).catch(err => { throw err; });

        // Use dynamic import above to keep top-level import-free; now perform the actual call
        const response = await (await import('../utils/apiClient.js')).apiFetch(urlPath, { method: 'POST', body });

        // Registrar status e corpo para ajudar a configurar a API externa
        const data = await response.json().catch(err => {
            console.warn('[handleAuthRequest] failed to parse JSON response', err);
        
            return null;
        });

        console.log('[handleAuthRequest] external response', { status: response.status, ok: response.ok, data });

        // Se a API externa definiu cookie de sessão/token via Set-Cookie, encaminhe-o para o cliente;
        try {
            // Tenta obter cookies de diferentes implementações de fetch;
            let setCookie = null;
            if (response.headers && typeof response.headers.get === 'function') {
                setCookie = response.headers.get('set-cookie');
            }
            // node-fetch v2 expõe headers.raw();
            if ((!setCookie || setCookie === null) && response.headers && typeof response.headers.raw === 'function') {
                const raw = response.headers.raw();
                if (raw && raw['set-cookie']) setCookie = raw['set-cookie'];
            }

            if (setCookie) {
                // Se for array, encaminha todos; se for string, encaminha diretamente;
                if (Array.isArray(setCookie)) {
                    res.setHeader('Set-Cookie', setCookie);
                } else {
                    res.setHeader('Set-Cookie', setCookie);
                }
                console.log('[handleAuthRequest] forwarded Set-Cookie header to client', Array.isArray(setCookie) ? setCookie.length : 1);
            }
        } catch (cookieErr) {
            console.warn('[handleAuthRequest] could not forward Set-Cookie header', cookieErr?.message || cookieErr);
        }

        if (response.ok) {
            // garante que a sessão receba um objeto user com role
            const userFromApi = data.user || {};
            const user = { ...userFromApi, role: userFromApi.role || 'customer' };
            req.session.user = user;
            res.status(200).json({ success: true, message: successMessage });
        } else {
            res.status(400).json({ success: false, message: data.message || errorMessage });
        }
    } catch (error) {
        console.error(`Erro em ${endpoint}:`, error);
        next(error);
    }
};

export const postRegisterUser = async (req, res, next) => {
    const { name, email, number, password } = req.body;
    await handleAuthRequest(req, res, next, 'createUser', { name, email, number, password }, 'Cadastro realizado com sucesso!', 'Erro no cadastro');
};

export const postLoginUser = async (req, res, next) => {
    const { email, password } = req.body;
    await handleAuthRequest(req, res, next, 'login', { email, password }, 'Login realizado com sucesso!', 'Erro no login');
};

export const getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

export const sendEmailCodeotp = async (email, code) => {
    // Aqui você pode integrar com um serviço de email para enviar o código

    // NOTE: aqui havia um erro no endpoint: `${process.env.API_URL}/public/}`
    // Substitua pelo endpoint correto da sua API externa, por exemplo:
    // `${process.env.API_URL}/public/send-otp-email`.
    const urlPath = '/public/send-otp-email';
    console.log('[sendEmailCodeotp] calling', { urlPath, body: { email, code } });
    const response = await (await import('../utils/apiClient.js')).apiFetch(urlPath, { method: 'POST', body: { email, code } });
    const data = await response.json().catch(() => null);
    console.log('[sendEmailCodeotp] external response', { status: response.status, ok: response.ok, data });

    console.log(`Enviando código ${code} para o email ${email}`);
};

export const sendNumberCodeotp = (number, code) => {
    // Aqui você pode integrar com um serviço de SMS para enviar o código
    console.log(`Enviando código ${code} para o número ${number}`);
};

export const verifyEmailCode = (req, res, next) => {
    try {
        const { email, code } = req.body;
        console.log(email, code);
        // Aqui você pode adicionar a lógica para verificar o código
        // Por enquanto, vamos apenas redirecionar para a página inicial
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const verifyNumberCode = (req, res, next) => {
    try {
        const { number, code } = req.body;
        console.log(number, code);
        // Aqui você pode adicionar a lógica para verificar o código
        // Por enquanto, vamos apenas redirecionar para a página inicial
        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export const promoteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validação simples de role
        const allowed = ['admin', 'staff', 'customer'];
        if (!allowed.includes(role)) {
            return res.status(400).json({ success: false, message: 'Role inválido' });
        }

        // Chama a API backend para atualizar o role do usuário
        const urlPath = `/admin/users/${id}/role`;
        console.log('[promoteUser] calling external API', { urlPath, method: 'PUT', body: { role } });
        const response = await (await import('../utils/apiClient.js')).apiFetch(urlPath, { method: 'PUT', body: { role } });
        const data = await response.json().catch(() => null);
        console.log('[promoteUser] external response', { status: response.status, ok: response.ok, data });

        if (!response.ok) {
            return res.status(response.status).json({ success: false, message: data?.message || 'Erro ao atualizar role' });
        }

        // Se o usuário atualizado for o mesmo do session, atualiza a sessão
        if (req.session && req.session.user && req.session.user._id && req.session.user._id.toString() === id.toString()) {
            req.session.user.role = role;
        }

        return res.status(200).json({ success: true, message: 'Role atualizado', user: data.user || null });
    } catch (err) {
        console.error('promoteUser error:', err);
        return next(err);
    }
};
