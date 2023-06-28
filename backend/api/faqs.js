module.exports = app => {
        const { existeOuErro, naoExisteOuErro, dataAtualFormatadaBR, naoExisteNoBancoOuErro } = app.api.validador

        const saveFaq = async (req, res) => {
                const auditoria = {
                        url: JSON.stringify({
                                method: req.method,
                                url: req.url,
                                params: req.params
                        }),
                        usuario: JSON.stringify({
                                codigo_usuario: req.user.codigo_usuario,
                                nome_agenda: req.user.nome_agenda,
                                admin: req.user.admin,
                        }),
                        body: JSON.stringify(
                                req.body
                        ),
                        data: dataAtualFormatadaBR()
                }

                const faqBody = {
                        registro: req.body.registro,
                        pergunta: req.body.pergunta,
                        grupo: req.body.grupo,
                        auto_import: req.body.auto_import,
                        valido_n1: req.body.valido_n1,
                        valido_n2: req.body.valido_n2,
                        tags: `${req.body.registro} | ${req.body.grupo.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^ a-zA-Z0-9]/g, '').toUpperCase()} | ${req.body.pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^ a-zA-Z0-9]/g, '').toUpperCase()
                                }`,
                        status: req.body.status
                };
                /*  if (req.params.id) faqBody.registro = req.params.id */

                try {
                        existeOuErro(faqBody.registro, "[Vazio] Preencha o Número do Faq!.");
                        existeOuErro(req.body.grupo, "[Vazio] Preencha o Grupo do Faq!.");
                        const GrupoFaq = await app.db("faq_grupo")
                                .where({ nome_grupo: req.body.grupo }).first()
                        existeOuErro(GrupoFaq, "[Inválido]Grupo do Faq Não encontrado.")
                        existeOuErro(faqBody.pergunta, "[Vazio] Preencha a Pergunta do FAQ!.");

                } catch (msg) {
                        return res.status(400).send(msg)
                }

                try {
                        const faq = await app.db("faq")
                                .where({ registro: faqBody.registro }).first()

                        await app.db.transaction(async trans => {
                                await app.db("auditoria")
                                        .insert(auditoria)
                                if (faq) {
                                        await app.db("faq")
                                                .update(faqBody)
                                                .where({ registro: faqBody.registro })
                                } else {
                                        await app.db("faq")
                                                .insert(faqBody)
                                }
                        })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        return res.status(500).send(msg)
                }
        }
        const getFaqsValidos = (req, res) => {
                app.db
                        .select()
                        .table("faq")
                        .where({ valido_n1: true })
                        .andWhere({ status: 'Ativo' })
                        .then(faqs => res.json(faqs))
                        .catch(error => res.status(500).send(error))
        }

        const getFaqsAdm = (req, res) => {
                app.db
                        .select()
                        .table("faq")
                        .then(faqs => res.json(faqs))
                        .catch(error => res.status(500).send(error))
        }

        const getFaqsAll = (req, res) => {
                app.db
                        .select()
                        .table("faq")
                        .where({ status: 'Ativo' })
                        .then(faqs => res.json(faqs))
                        .catch(error => res.status(500).send(error))
        }

        const getFaqsN2 = (req, res) => {
                app.db
                        .select()
                        .table("faq")
                        .where({ valido_n2: true })
                        .andWhere({ status: 'Ativo' })
                        .then(faqs => res.json(faqs))
                        .catch(error => res.status(500).send(error))
        }

        const saveGrupoFaq = async (req, res) => {
                const auditoria = {
                        url: JSON.stringify({
                                method: req.method,
                                url: req.url,
                                params: req.params
                        }),
                        usuario: JSON.stringify({
                                codigo_usuario: req.user.codigo_usuario,
                                nome_agenda: req.user.nome_agenda,
                                admin: req.user.admin,
                        }),
                        body: JSON.stringify(
                                req.body
                        ),
                        data: dataAtualFormatadaBR()
                }
                const grupoFaqBody = {
                        nome_grupo: req.body.nome_grupo,
                        grupo_valido: req.body.grupo_valido,
                        status: req.body.status
                };
                if (req.params.id) grupoFaqBody.codigo_grupo = req.params.id


                try {
                        existeOuErro(grupoFaqBody.nome_grupo, "Preencha o Nome do Grupo!.");
                        if (!grupoFaqBody.codigo_grupo) {
                                const GrupoFaq = await app.db("faq_grupo")
                                        .where({ nome_grupo: req.body.nome_grupo }).first()
                                naoExisteOuErro(GrupoFaq, "Nome de grupo já cadastrado!.")
                        }
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                try {
                        await app.db.transaction(async trans => {
                                await app.db("auditoria")
                                        .insert(auditoria)
                                if (grupoFaqBody.codigo_grupo) {
                                        await app.db("faq_grupo")
                                                .update(grupoFaqBody)
                                                .where({ codigo_grupo: grupoFaqBody.codigo_grupo })
                                } else {
                                        await app.db("faq_grupo")
                                                .insert(grupoFaqBody)
                                }
                        })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                } catch (error) {
                        return res.status(500).send(msg)
                }
        }

        const getGruposFaqAdm = (req, res) => {
                app.db("faq_grupo")
                        .select()
                        .then(faqGrupos => res.json(faqGrupos))
                        .catch(error => res.status(500).send(error))
        }
        const getGruposFaq = (req, res) => {
                app.db("faq_grupo")
                        .select()
                        .where({ status: "Ativo" })
                        .then(faqGrupos => res.json(faqGrupos))
                        .catch(error => res.status(500).send(error))
        }

        return { getFaqsAll, saveFaq, saveGrupoFaq, getGruposFaq, getFaqsValidos, getFaqsN2, getFaqsAdm, getGruposFaqAdm }
}


