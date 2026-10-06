import Tema from '../models/Tema.js';

class TemaController {

    static async cadastrar(req, res) {

        try {

            const { nome, descricao } = req.body;

            const imagens = [];

            if (req.files) {

                req.files.forEach(file => {

                    imagens.push(`/uploads/${file.filename}` );

                });

            }

            const tema = new Tema(
                nome,
                descricao,
                imagens
            );

            const temaSalvo = await tema.save();

            res.json(temaSalvo);

        } catch (error) {

            console.error(
                'Erro ao cadastrar tema:',
                error.message
            );

            res.status(500).send(
                'Erro ao cadastrar tema.'
            );

        }
    }


    static async listar(req, res) {

        try {

            const temas = await Tema.findAll();

            res.json(temas);

        } catch (error) {

            console.error(
                'Erro ao listar temas:',
                error.message
            );

            res.status(500).send(
                'Erro ao listar temas.'
            );

        }
    }


    static async buscarPorId(req, res) {

        try {

            const { id } = req.params;

            const tema = await Tema.findById(id);

            if (!tema) {

                return res
                    .status(404)
                    .send('Tema não encontrado.');

            }

            res.json(tema);

        } catch (error) {

            console.error(
                'Erro ao buscar tema:',
                error.message
            );

            res.status(500).send(
                'Erro ao buscar tema.'
            );

        }
    }


    static async editar(req, res) {

    try {

        const { id } = req.params;

        const { nome, descricao } = req.body;

        // Busca o tema que já existe
        const temaAtual = await Tema.findById(id);

        if (!temaAtual) {

            return res
                .status(404)
                .send('Tema não encontrado.');

        }


        // Mantém as imagens que já estavam cadastradas
        const imagensAtuais = temaAtual.imagens || [];


        // Pega as novas imagens enviadas
        const novasImagens = [];

        if (req.files) {

            req.files.forEach(file => {

                novasImagens.push(
                    `/uploads/${file.filename}`
                );

            });

        }


        // Junta imagens antigas + imagens novas
        const imagens = [
            ...imagensAtuais,
            ...novasImagens
        ];


        const dados = {

            nome,
            descricao,
            imagens

        };


        const tema = await Tema.update(
            id,
            dados
        );


        res.json(tema);

    } catch (error) {

        console.error(
            'Erro ao editar tema:',
            error.message
        );

        res.status(500).send(
            'Erro ao editar tema.'
        );

    }

}


    static async excluir(req, res) {

        try {

            const { id } = req.params;

            await Tema.delete(id);

            res.json({
                mensagem: 'Tema excluído com sucesso.'
            });

        } catch (error) {

            console.error(
                'Erro ao excluir tema:',
                error.message
            );

            res.status(500).send(
                'Erro ao excluir tema.'
            );

        }
    }

    static async excluirImagem(req, res) {

        try {

            const { id } = req.params;

            const { imagem } = req.body;


            if (!imagem) {

                return res
                    .status(400)
                    .send('Imagem não informada.');

            }


            const tema = await Tema.findById(id);


            if (!tema) {

                return res
                    .status(404)
                    .send('Tema não encontrado.');

            }


            const imagensAtualizadas =
                tema.imagens.filter(
                    item => item !== imagem
                );


            const temaAtualizado =
                await Tema.update(
                    id,
                    {
                        imagens: imagensAtualizadas
                    }
                );


            res.json(temaAtualizado);

        } catch (error) {

            console.error(
                'Erro ao excluir imagem:',
                error.message
            );

            res
                .status(500)
                .send('Erro ao excluir imagem.');

        }

    }
}

export default TemaController;