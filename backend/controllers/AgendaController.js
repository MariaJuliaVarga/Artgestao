import Agenda from '../models/Agenda.js';

class AgendaController {

    static async cadastrar(req, res) {

        try {

            const { nome, data, horario, observacao, usuario } = req.body;

            const agenda = new Agenda(
                nome,
                data,
                horario,
                observacao,
                usuario
            );

            const agendaSalva = await agenda.save();

            res.json(agendaSalva);

        } catch (error) {

            console.error(
                'Erro ao cadastrar festa:',
                error.message
            );

            res.status(500).send(
                'Erro ao cadastrar festa.'
            );

        }
    }


    static async listar(req, res) {

        try {

            const festas = await Agenda.findAll();

            res.json(festas);

        } catch (error) {

            console.error(
                'Erro ao listar festas:',
                error.message
            );

            res.status(500).send(
                'Erro ao listar festas.'
            );

        }
    }


    static async listarPorData(req, res) {

        try {

            const { data } = req.params;

            const festas = await Agenda.findByData(data);

            res.json(festas);

        } catch (error) {

            console.error(
                'Erro ao buscar festas por data:',
                error.message
            );

            res.status(500).send(
                'Erro ao buscar festas por data.'
            );

        }
    }


    static async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const festa = await Agenda.findById(id);

            if (!festa) {

                return res
                    .status(404)
                    .send('Festa não encontrada.');

            }

            res.json(festa);

        } catch (error) {

            console.error(
                'Erro ao buscar festa:',
                error.message
            );

            res.status(500).send(
                'Erro ao buscar festa.'
            );

        }
    }


    static async editar(req, res) {

        try {

            const { id } = req.params;

            const { nome, data, horario, observacao, usuario } = req.body;

            const festa = await Agenda.findById(id);

            if (!festa) {

                return res
                    .status(404)
                    .send('Festa não encontrada.');

            }

            const dados = {
                nome,
                data,
                horario,
                observacao,
                usuario
            };

            const festaAtualizada = await Agenda.update(
                id,
                dados
            );

            res.json(festaAtualizada);

        } catch (error) {

            console.error(
                'Erro ao editar festa:',
                error.message
            );

            res.status(500).send(
                'Erro ao editar festa.'
            );

        }
    }


    static async excluir(req, res) {

        try {

            const { id } = req.params;

            await Agenda.delete(id);

            res.json({
                mensagem: 'Festa excluída com sucesso.'
            });

        } catch (error) {

            console.error(
                'Erro ao excluir festa:',
                error.message
            );

            res.status(500).send(
                'Erro ao excluir festa.'
            );

        }
    }
}

export default AgendaController;
