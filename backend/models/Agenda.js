import mongoose from 'mongoose';
import AgendaSchema from './AgendaSchema.js';

const AgendaModel = mongoose.model('Agenda', AgendaSchema);

class Agenda {

    constructor(nome, data, horario, observacao, usuario) {
        this.nome = nome;
        this.data = data;
        this.horario = horario;
        this.observacao = observacao;
        this.usuario = usuario;
    }

    async save() {

        const agenda = new AgendaModel({
            nome: this.nome,
            data: this.data,
            horario: this.horario,
            observacao: this.observacao,
            usuario: this.usuario
        });

        return await agenda.save();
    }

    static async findAll() {
        return await AgendaModel.find().sort({ data: 1, horario: 1 });
    }

    static async findByData(data) {
        return await AgendaModel.find({ data }).sort({ horario: 1 });
    }

    static async findById(id) {
        return await AgendaModel.findById(id);
    }

    static async update(id, dados) {
        return await AgendaModel.findByIdAndUpdate(
            id,
            dados,
            { new: true }
        );
    }

    static async delete(id) {
        return await AgendaModel.findByIdAndDelete(id);
    }
}

export default Agenda;
