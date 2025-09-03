export const getHomePage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/public/home' });
    } catch (error) {
        next(error);
    }
};

export const getProductsPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/public/products' });
    } catch (error) {
        next(error);
    }
};

export const getAboutPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/public/about' });
    } catch (error) {
        next(error);
    }
};

export const getContactPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/public/contact' });
    } catch (error) {
        next(error);
    }
};

export const getCartPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/user/cart' });
    } catch (error) {
        next(error);
    }
};

export const getFavoritesPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/user/favorites' });
    } catch (error) {
        next(error);
    }
};

export const getLoginPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/auth/login' });
    } catch (error) {
        next(error);
    }
};

export const getRegisterPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/auth/register' });
    } catch (error) {
        next(error);
    }
};

export const getAdminDashboardPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/admin/dashboard' });
    } catch (error) {
        next(error);
    }
};

export const getAdminProductsPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/admin/products/index' });
    } catch (error) {
        next(error);
    }
};

export const getAdminUsersPage = (req, res, next) => {
    try {
        // tenta buscar usuários do backend para exibir na página
        (async () => {
            try {
                const urlPath = '/admin/users';
                console.log('[getAdminUsersPage] fetching users from external API', urlPath);
                const response = await (await import('../utils/apiClient.js')).apiFetch(urlPath, { method: 'GET' });
                const data = await response.json().catch(() => null);
                console.log('[getAdminUsersPage] external response', { status: response.status, ok: response.ok, data });
                const users = response.ok ? (data.users || data) : [];
                res.render("layouts/main", { page: '../pages/admin/users/index', users });
            } catch (err) {
                console.warn('Could not fetch users list:', err.message);
                res.render("layouts/main", { page: '../pages/admin/users/index', users: [] });
            }
        })();
    } catch (error) {
        next(error);
    }
};

export const getAdminOrdersPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/admin/orders/index' });
    } catch (error) {
        next(error);
    }
};

export const getAdminSettingsPage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/admin/settings/index' });
    } catch (error) {
        next(error);
    }
};

export const getVerifyEmailCodePage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/auth/verify-email', email: req.query.email });
    } catch (error) {
        next(error);
    }
}

export const getVerifyNumberCodePage = (req, res, next) => {
    try {
        res.render("layouts/main", { page: '../pages/auth/verify-number', number: req.query.number });
    } catch (error) {
        next(error);
    }
};



export const getPixPaymentPage = (req, res, next) => {
    try {
        // In a real application, you would get the PIX code and QR code from a payment gateway API
        const pixCode = "00020126580014br.gov.bcb.pix0136a6a1b6e8-82b4-4b1e-a1a6-7b4a5a9c1b3a5204000053039865802BR5913Jean Castilho6009SAO PAULO62070503***6304E4B2";
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixCode}`;

        res.render("layouts/main", { 
            page: '../pages/payment/pix',
            pixCode: pixCode,
            qrCodeUrl: qrCodeUrl
        });
    } catch (error) {
        next(error);
    }
};

export const getProfilePage = (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render("layouts/main", { page: '../pages/user/profile', user: req.session.user });
    } catch (error) {
        next(error);
    }
};

