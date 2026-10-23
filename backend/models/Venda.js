import mongoose from 'mongoose';
import VendaSchema from './VendaSchema.js';

const VendaModel = mongoose.model('Venda', VendaSchema);

class Venda {

    constructor(itens, totalVenda, data, observacao) {
        this.itens = itens;
        this.totalVenda = totalVenda;
        this.data = data;
        this.observacao = observacao;
    }

    async save() {

        const venda = new VendaModel({
            itens: this.itens,
            totalVenda: this.totalVenda,
            data: this.data,
            observacao: this.observacao
        });

        return await venda.save();
    }

    static async findAll() {
        return await VendaModel.find().sort({ createdAt: -1 });
    }

    static async findById(id) {
        return await VendaModel.findById(id);
    }

    static async delete(id) {
        return await VendaModel.findByIdAndDelete(id);
    }
}

export default Venda;
