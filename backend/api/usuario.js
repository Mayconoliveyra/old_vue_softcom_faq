const bcrypt = require("bcrypt-nodejs")

module.exports = app => {
        const { maiorOuErro, validarEmail, existeOuErro, naoExisteOuErro, igualOuErro, dataAtualFormatadaBR, naoExisteNoBancoOuErro } = app.api.validador

        const cryptografarSenha = senha => {
                const salt = bcrypt.genSaltSync(10)
                return bcrypt.hashSync(senha, salt)
        }

        const saveUsuario = async (req, res) => {

                const auditoria = {
                        url: JSON.stringify({
                                method: req.method,
                                url: req.url,
                                params: req.params
                        }),
                        usuario: JSON.stringify({
                                codigo_usuario: req.params.id ? req.user.codigo_usuario : "Novo",
                                nome_agenda: req.params.id ? req.user.nome_agenda : "Novo",
                                admin: req.params.id ? req.user.admin : "Novo",
                        }),
                        body: JSON.stringify({
                                nome_agenda: req.body.nome_agenda,
                                email: req.body.email
                        }

                        ),
                        data: dataAtualFormatadaBR()
                }

                const usuarioBody = {
                        email: req.body.email,
                        senha: req.body.senha,
                        nome_agenda: req.body.nome_agenda,
                        admin: req.body.admin,
                        status: req.body.status,
                        confirmaSenha: req.body.confirmaSenha
                };
                if (req.params.id) usuarioBody.codigo_usuario = req.params.id

                //se a requição veio do "/conta", seta adm como false.
                if (!req.originalUrl.startsWith('/conta')) usuarioBody.admin = false
                // se o usuario setado na requição não foi informado ou não é adm, seta false para adm
                if (!req.user || !req.user.admin) usuarioBody.admin = false

                try {
                        existeOuErro(usuarioBody.nome_agenda, "NOME NA AGENDA deve ser preenchido.");
                        usuarioBody.nome_agenda = usuarioBody.nome_agenda.charAt(0).toUpperCase() + usuarioBody.nome_agenda.slice(1)
                        existeOuErro(usuarioBody.email, "O endereço de E-MAIL deve ser preenchido.");
                        validarEmail(usuarioBody.email, "Endereço de E-MAIL inválido. Por favor, verifique o E-EMAIL informado.");
                        if (!usuarioBody.codigo_usuario) existeOuErro(usuarioBody.senha, "A SENHA deve ser preenchida.");
                        if (!usuarioBody.codigo_usuario) existeOuErro(usuarioBody.confirmaSenha, "Confirme a SENHA.");
                        if (!usuarioBody.codigo_usuario) igualOuErro(usuarioBody.senha, usuarioBody.confirmaSenha, "As SENHAS informadas não conferem.");
                        if (!usuarioBody.codigo_usuario) {
                                /* naoExisteNoBancoOuErro(nomeTabelaBD, nomeColunaBD, reqBody, msg) */
                                await naoExisteNoBancoOuErro("usuarios", "email", usuarioBody.email, "Alguém já tem este endereço de email. Tente usar outro email.")
                        }
                        if (usuarioBody.codigo_usuario == 1) {
                                throw "Usuário Administrador não pode ser alterado."
                        };

                } catch (msg) {
                        return res.status(400).send(msg)
                }


                if (!usuarioBody.codigo_usuario || req.body.defSenha) {
                        usuarioBody.senha = cryptografarSenha(usuarioBody.senha)
                }
                delete usuarioBody.confirmaSenha

                try {
                        app.db.transaction(async trans => {
                                await trans("auditoria")
                                        .insert(auditoria);
                                if (usuarioBody.codigo_usuario) {
                                        await trans("usuarios")
                                                .update(usuarioBody)
                                                .where({ codigo_usuario: usuarioBody.codigo_usuario })
                                } else {
                                        await trans("usuarios")
                                                .insert(usuarioBody)
                                }
                        })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        return res.status(500).send(msg)
                }
        }

        const getUsuarios = (req, res) => {
                app.db('usuarios')
                        .select('codigo_usuario', 'nome_agenda', 'email', 'admin', 'senha', 'status')
                        .then(users => res.json(users))
                        .catch(err => res.status(500).send(err))
        }
        const setHistoricoVisita = async (req, res) => {
                const historico = {
                        nome_usuario: req.body.nome_usuario,
                        data: dataAtualFormatadaBR()
                }
                try {
                        await app.db("historico_visitas")
                                .insert(historico)
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        return res.status(500).send(msg)
                }
        }
        return { setHistoricoVisita, saveUsuario, getUsuarios }
}