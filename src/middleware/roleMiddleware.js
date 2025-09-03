// Middleware para autenticação e autorização por 'role'
// Roles esperadas: 'admin', 'staff' (funcionario), 'customer' (cliente)

export function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    // se for requisição API JSON, retorne 401
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ success: false, message: 'Não autenticado' });
    }
    // caso contrário redireciona para login
    return res.redirect('/login');
}

export function requireRole(required) {
    // required pode ser string ou array de strings
    const requiredRoles = Array.isArray(required) ? required : [required];

    return (req, res, next) => {
        const user = req.session?.user;
        if (!user) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ success: false, message: 'Não autenticado' });
            }
            return res.redirect('/login');
        }

        const role = (user.role || user.roles || 'customer').toString();

        // se o usuário tiver múltiplos roles (array ou string separado por vírgula)
        const userRoles = Array.isArray(user.role) ? user.role : (role.includes(',') ? role.split(',').map(r => r.trim()) : [role]);

        const has = userRoles.some(r => requiredRoles.includes(r));
        if (!has) {
            // Para requisições API, retornar 403
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(403).json({ success: false, message: 'Acesso negado' });
            }
            // renderiza uma página de erro ou redireciona
            return res.status(403).render('layouts/main', { page: '../errors/500', error: { message: 'Acesso negado' } });
        }

        return next();
    };
}
