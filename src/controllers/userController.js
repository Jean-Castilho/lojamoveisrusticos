const handleAuthRequest = async (req, res, next, endpoint, body, successMessage, errorMessage) => {
    try {

        console.log(endpoit);
        

        const response = await fetch(`${process.env.API_URL}/public/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            req.session.user = data.user;
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

    const response = await fetch(`${process.env.API_URL}/public/${endpoit}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
    });
    const data = await response.json();
    console.log(data);

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
