import DataBloqueada from '../models/DataBloqueada.js';

class DataBloqueadaController {

    // Lista todas as datas bloqueadas
    static async listar(req, res) {

        try {

            const datas = await DataBloqueada.findAll();

            res.json(datas);

        } catch (error) {

            console.error(
                'Erro ao listar datas bloqueadas:',
                error.message
            );

            res.status(500).send(
                'Erro ao listar datas bloqueadas.'
            );

        }
    }


    // Bloqueia uma data (toggle: se já existe, desbloqueia)
    static async alternarBloqueio(req, res) {

        try {

            const { data, motivo } = req.body;

            if (!data) {

                return res
                    .status(400)
                    .send('Data não informada.');

            }

            const existente = await DataBloqueada.findByData(data);

            if (existente) {

                // Já está bloqueada → desbloquear
                await DataBloqueada.delete(data);

                return res.json({
                    bloqueada: false,
                    data
                });

            }

            // Não estava bloqueada → bloquear
            const nova = new DataBloqueada(data, motivo || '');

            await nova.save();

            return res.json({
                bloqueada: true,
                data,
                motivo: motivo || ''
            });

        } catch (error) {

            console.error(
                'Erro ao alterar bloqueio:',
                error.message
            );

            res.status(500).send(
                'Erro ao alterar bloqueio da data.'
            );

        }
    }


    // Bloqueia uma data explicitamente
    static async bloquear(req, res) {

        try {

            const { data, motivo } = req.body;

            if (!data) {

                return res
                    .status(400)
                    .send('Data não informada.');

            }

            // Evita duplicata
            const existente = await DataBloqueada.findByData(data);

            if (existente) {

                return res.json(existente);

            }

            const nova = new DataBloqueada(data, motivo || '');

            const salva = await nova.save();

            res.json(salva);

        } catch (error) {

            console.error(
                'Erro ao bloquear data:',
                error.message
            );

            res.status(500).send(
                'Erro ao bloquear data.'
            );

        }
    }


    // Desbloqueia uma data
    static async desbloquear(req, res) {

        try {

            const { data } = req.params;

            await DataBloqueada.delete(data);

            res.json({
                mensagem: 'Data desbloqueada com sucesso.'
            });

        } catch (error) {

            console.error(
                'Erro ao desbloquear data:',
                error.message
            );

            res.status(500).send(
                'Erro ao desbloquear data.'
            );

        }
    }
}

export default DataBloqueadaController;
