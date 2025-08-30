export const getAllProducts = (req, res) => {
    res.send('Lista de produtos');
};

export const getProductById = (req, res) => {
    const { id } = req.params;
    res.send(`Detalhes do produto ${id}`);
};

export const addProductforcatalog = (req, res) => {
    res.send('Produto adicionado ao catálogo');
};

export const addProductFavorite = (req, res) => {
    const { id } = req.params;
    res.send(`Produto ${id} adicionado aos favoritos`);
};

export const addProductCart = (req, res) => {
    const { id } = req.params;
    res.send(`Produto ${id} adicionado ao carrinho`);
};