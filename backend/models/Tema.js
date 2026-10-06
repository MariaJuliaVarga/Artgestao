import mongoose from 'mongoose';
import TemaSchema from './TemaSchema.js';

const TemaModel = mongoose.model('Tema', TemaSchema);

class Tema {

    constructor(nome, descricao, imagens) {
        this.nome = nome;
        this.descricao = descricao;
        this.imagens = imagens;
    }

    async save() {

        const tema = new TemaModel({
            nome: this.nome,
            descricao: this.descricao,
            imagens: this.imagens
        });

        return await tema.save();
    }

    static async findAll() {
        return await TemaModel.find();
    }

    static async findById(id) {
        return await TemaModel.findById(id);
    }

    static async update(id, dados) {
        return await TemaModel.findByIdAndUpdate(
            id,
            dados,
            { new: true }
        );
    }

    static async delete(id) {
        return await TemaModel.findByIdAndDelete(id);
    }
}

export default Tema;