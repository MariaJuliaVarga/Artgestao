import Venda from '../models/Venda.js';
import Produto from '../models/Produto.js';

class VendaController {

    // Registra uma nova venda e abate o estoque dos produtos
    static async cadastrar(req, res) {

        try {

            const { itens, observacao } = req.body;

            // Valida presença dos itens
            if (!itens || !Array.isArray(itens) || itens.length === 0) {

                return res
                    .status(400)
                    .send('A venda deve ter ao menos um produto.');

            }

            // Verifica disponibilidade de estoque de todos os itens
            for (const item of itens) {

                const produto = await Produto.findById(item.produto);

                if (!produto) {

                    return res
                        .status(404)
                        .send(`Produto não encontrado: ${item.nomeProduto || item.produto}`);

                }

                if (produto.quantidade < item.quantidade) {

                    return res
                        .status(409)
                        .send(
                            `Estoque insuficiente para "${produto.nome}". ` +
                            `Disponível: ${produto.quantidade}, solicitado: ${item.quantidade}.`
                        );

                }

            }

            // Monta itens com preço atual e calcula totais
            let totalVenda = 0;

            const itensMontados = await Promise.all(
                itens.map(async (item) => {

                    const produto = await Produto.findById(item.produto);

                    const totalItem = produto.preco * item.quantidade;

                    totalVenda += totalItem;

                    return {
                        produto: produto._id,
                        nomeProduto: produto.nome,
                        precoUnitario: produto.preco,
                        quantidade: item.quantidade,
                        totalItem
                    };

                })
            );

            // Data da venda = hoje
            const hoje = new Date();
            const ano  = hoje.getFullYear();
            const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
            const dia  = String(hoje.getDate()).padStart(2, '0');
            const data = `${ano}-${mes}-${dia}`;

            // Salva a venda
            const venda = new Venda(
                itensMontados,
                totalVenda,
                data,
                observacao || ''
            );

            const vendaSalva = await venda.save();

            // Abate o estoque de cada produto
            for (const item of itensMontados) {

                const produto = await Produto.findById(item.produto);

                await Produto.update(item.produto, {
                    quantidade: produto.quantidade - item.quantidade
                });

            }

            res.json(vendaSalva);

        } catch (error) {

            console.error('Erro ao registrar venda:', error.message);

            res.status(500).send('Erro ao registrar venda.');

        }
    }


    // Lista todas as vendas registradas
    static async listar(req, res) {

        try {

            const vendas = await Venda.findAll();

            res.json(vendas);

        } catch (error) {

            console.error('Erro ao listar vendas:', error.message);

            res.status(500).send('Erro ao listar vendas.');

        }
    }


    // Busca uma venda pelo ID
    static async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const venda = await Venda.findById(id);

            if (!venda) {

                return res
                    .status(404)
                    .send('Venda não encontrada.');

            }

            res.json(venda);

        } catch (error) {

            console.error('Erro ao buscar venda:', error.message);

            res.status(500).send('Erro ao buscar venda.');

        }
    }


    // Exclui uma venda (não reverte estoque — exclusão apenas de registro)
    static async excluir(req, res) {

        try {

            const { id } = req.params;

            const venda = await Venda.findById(id);

            if (!venda) {

                return res
                    .status(404)
                    .send('Venda não encontrada.');

            }

            await Venda.delete(id);

            res.json({ mensagem: 'Venda excluída com sucesso.' });

        } catch (error) {

            console.error('Erro ao excluir venda:', error.message);

            res.status(500).send('Erro ao excluir venda.');

        }
    }
}

export default VendaController;
