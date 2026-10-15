import Produto from '../models/Produto.js';

class ProdutoController {

    static async cadastrar(req, res) {

        try {

            const { nome, descricao, preco, categoria, quantidade } = req.body;

            if (!nome || !descricao || !preco || !categoria || quantidade === undefined) {
                return res
                    .status(400)
                    .send('Preencha todos os campos obrigatórios.');
            }

            const produto = new Produto(
                nome,
                descricao,
                Number(preco),
                categoria,
                Number(quantidade)
            );

            const produtoSalvo = await produto.save();

            res.json(produtoSalvo);

        } catch (error) {

            console.error(
                'Erro ao cadastrar produto:',
                error.message
            );

            res.status(500).send(
                'Erro ao cadastrar produto.'
            );

        }
    }


    static async listar(req, res) {

        try {

            const { nome } = req.query;

            const filtros = {};

            if (nome) {
                filtros.nome = {
                    $regex: nome,
                    $options: 'i'
                };
            }

            const produtos = await Produto.findAll(filtros);

            res.json(produtos);

        } catch (error) {

            console.error(
                'Erro ao listar produtos:',
                error.message
            );

            res.status(500).send(
                'Erro ao listar produtos.'
            );

        }
    }


    static async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const produto = await Produto.findById(id);

            if (!produto) {
                return res
                    .status(404)
                    .send('Produto não encontrado.');
            }

            res.json(produto);

        } catch (error) {

            console.error(
                'Erro ao buscar produto:',
                error.message
            );

            res.status(500).send(
                'Erro ao buscar produto.'
            );

        }
    }


    static async editar(req, res) {

        try {

            const { id } = req.params;

            const { nome, descricao, preco, categoria, quantidade } = req.body;

            const produtoAtual = await Produto.findById(id);

            if (!produtoAtual) {
                return res
                    .status(404)
                    .send('Produto não encontrado.');
            }

            const dados = {
                nome,
                descricao,
                preco: Number(preco),
                categoria,
                quantidade: Number(quantidade)
            };

            const produto = await Produto.update(id, dados);

            res.json(produto);

        } catch (error) {

            console.error(
                'Erro ao editar produto:',
                error.message
            );

            res.status(500).send(
                'Erro ao editar produto.'
            );

        }
    }


    static async atualizarQuantidade(req, res) {

        try {

            const { id } = req.params;

            const { quantidade } = req.body;

            if (quantidade === undefined) {
                return res
                    .status(400)
                    .send('Quantidade não informada.');
            }

            const produto = await Produto.findById(id);

            if (!produto) {
                return res
                    .status(404)
                    .send('Produto não encontrado.');
            }

            const produtoAtualizado = await Produto.update(
                id,
                { quantidade: Number(quantidade) }
            );

            res.json(produtoAtualizado);

        } catch (error) {

            console.error(
                'Erro ao atualizar quantidade:',
                error.message
            );

            res.status(500).send(
                'Erro ao atualizar quantidade.'
            );

        }
    }


    static async excluir(req, res) {

        try {

            const { id } = req.params;

            const produto = await Produto.findById(id);

            if (!produto) {
                return res
                    .status(404)
                    .send('Produto não encontrado.');
            }

            await Produto.delete(id);

            res.json({
                mensagem: 'Produto excluído com sucesso.'
            });

        } catch (error) {

            console.error(
                'Erro ao excluir produto:',
                error.message
            );

            res.status(500).send(
                'Erro ao excluir produto.'
            );

        }
    }
}

export default ProdutoController;
