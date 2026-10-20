import mongoose from 'mongoose';
import DataBloqueadaSchema from './DataBloqueadaSchema.js';

const DataBloqueadaModel = mongoose.model('DataBloqueada', DataBloqueadaSchema);

class DataBloqueada {

    constructor(data, motivo) {
        this.data = data;
        this.motivo = motivo;
    }

    async save() {

        const registro = new DataBloqueadaModel({
            data: this.data,
            motivo: this.motivo
        });

        return await registro.save();
    }

    static async findAll() {
        return await DataBloqueadaModel.find().sort({ data: 1 });
    }

    static async findByData(data) {
        return await DataBloqueadaModel.findOne({ data });
    }

    static async delete(data) {
        return await DataBloqueadaModel.findOneAndDelete({ data });
    }
}

export default DataBloqueada;
