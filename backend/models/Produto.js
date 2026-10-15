import mongoose from 'mongoose';
import ProdutoSchema from './ProdutoSchema.js';

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

class Produto {

    constructor(nome, descricao, preco, categoria, quantidade) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.quantidade = quantidade;
    }

    async save() {

        const produto = new ProdutoModel({
            nome: this.nome,
            descricao: this.descricao,
            preco: this.preco,
            categoria: this.categoria,
            quantidade: this.quantidade
        });

        return await produto.save();
    }

    static async findAll(filtros = {}) {
        return await ProdutoModel.find(filtros).sort({ createdAt: -1 });
    }

    static async findById(id) {
        return await ProdutoModel.findById(id);
    }

    static async update(id, dados) {
        return await ProdutoModel.findByIdAndUpdate(
            id,
            dados,
            { new: true }
        );
    }

    static async delete(id) {
        return await ProdutoModel.findByIdAndDelete(id);
    }
}

export default Produto;
