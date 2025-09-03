import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mainRouter from "./src/routes/index.js";

import session from "express-session";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET, // Carregue o segredo de uma variável de ambiente!
    resave: false,
    saveUninitialized: false, // Evita criar sessões desnecessárias
    cookie: {
        secure: isProduction, // Use cookies seguros em produção (HTTPS)
        httpOnly: true, // Impede que o cookie seja lido por JavaScript no cliente
        maxAge: 1000 * 60 * 60 * 24 // Exemplo: cookie válido por 1 dia
    }
}));

app.use((req, res, next) => {
    // Expor sessão, usuário atual e caminho para as views EJS
    res.locals.session = req.session;
    res.locals.user = req.session?.user || null;
    res.locals.currentPath = req.path;
    // helper para marcar item ativo no menu
    res.locals.isActive = (pathPrefix) => {
        try { return req.path === pathPrefix || req.path.startsWith(pathPrefix + '/'); } catch (e) { return false; }
    };
    next();
});

app.use("/", mainRouter);

// Handler para rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).render("layouts/main", { page: "../errors/404" });
});

// Handler de erro genérico (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Em produção, é uma boa prática não vazar detalhes do erro para o cliente
    const message = isProduction ? "Ocorreu um erro inesperado." : err.message;
    res.status(500).render("layouts/main", { page: "../errors/500", error: { message } });
});


const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
    console.log(
        `Servidor rodando na porta ${PORT} link: http://localhost:${PORT}`
    );
});