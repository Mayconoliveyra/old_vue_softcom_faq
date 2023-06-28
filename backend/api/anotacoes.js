module.exports = app => {
        const { existeOuErro, naoExisteOuErro, dataAtualFormatadaBR } = app.api.validador
        const { auditoria } = app.api.utilitiarios

        const saveAnotacao = async (req, res) => {
                const anotacaoBody = {
                        sintoma: req.body.sintoma,
                        solucao: req.body.solucao,
                        id_usuario: req.body.id_usuario,
                        compartilhar: req.body.compartilhar,
                        faqs: JSON.stringify(req.body.faqs),
                        software: req.body.software,
                        categoria: req.body.categoria,
                        dificuldade: req.body.dificuldade,
                };

                if (req.params.id) anotacaoBody.codigo_anotacao = req.params.id

                try {
                        existeOuErro(anotacaoBody.id_usuario, "Usuário não identificado! Faça login e tente novamente.");
                        existeOuErro(anotacaoBody.sintoma, "[Sintoma*] deve ser informado.");
                        existeOuErro(anotacaoBody.categoria, "[categoria] deve ser informado.");
                        existeOuErro(anotacaoBody.dificuldade, "[Dificuldade] deve ser informado.");
                        existeOuErro(anotacaoBody.solucao, "[Solução*] deve ser informado.");
                        const usuarioExiste = await app.db("usuarios")
                                .where({ codigo_usuario: anotacaoBody.id_usuario }).first()
                        existeOuErro(usuarioExiste, "Usuário não encontrado!")
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                try {
                        await app.db.transaction(async trans => {
                                if (anotacaoBody.codigo_anotacao) {
                                        await app.db("anotacao")
                                                .update(anotacaoBody)
                                                .where({ codigo_anotacao: anotacaoBody.codigo_anotacao })
                                                .whereNull("deletado_em") /* so altera se tiver null */
                                } else {
                                        await app.db("anotacao")
                                                .insert(anotacaoBody)
                                }
                        })
                                .then(() => {
                                        auditoria(req, "");
                                        res.status(204).send()
                                })
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        return res.status(500).send(msg)
                }
        }

        const getAnotacaoAll = async (req, res) => {
                const limit = 15
                const page = parseInt(req.query.page)
                const codigo_usuario = parseInt(req.params.id)
                const pesquisa = req.body.filtro
                let totalRegistros = []
                let anotacoes = []

                try {
                        const softwares = await app.db.select("nome").table("soft_cat_dif").where({ soft1_cat2_dif3: 1 })
                        const categorias = await app.db.select("nome").table("soft_cat_dif").where({ soft1_cat2_dif3: 2 })
                        const dificuldades = await app.db.select("nome").table("soft_cat_dif").where({ soft1_cat2_dif3: 3 })

                        if (pesquisa) {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros 
                                FROM anotacao
                                WHERE 
                                MATCH (sintoma,software,categoria,dificuldade) 
                                AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL
                                AND id_usuario = ${codigo_usuario}`)

                                anotacoes = await app.db.raw(`
                                SELECT *, 
                                MATCH(sintoma,software,categoria,dificuldade) 
                                AGAINST("${pesquisa}") 
                                AS Relevancia 
                                FROM anotacao
                                WHERE 
                                MATCH (sintoma,software,categoria,dificuldade) 
                                AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL
                                AND id_usuario = ${codigo_usuario}
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        } else {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros
                                FROM anotacao
                                WHERE id_usuario = ${codigo_usuario}
                                AND deletado_em IS NULL
                                ORDER BY codigo_anotacao DESC`)

                                anotacoes = await app.db.raw(`
                                SELECT * FROM anotacao
                                WHERE id_usuario = ${codigo_usuario}
                                AND deletado_em IS NULL
                                ORDER BY codigo_anotacao DESC
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        }
                        res.json({ anotacoes: anotacoes[0], total_registros: totalRegistros[0][0], softwares, categorias, dificuldades })
                } catch (error) {
                        return res.status(500).send(error)
                }
        }

        const ADM_getAnotacaoAll = async (req, res) => {
                const limit = 15
                const page = parseInt(req.query.page)
                const pesquisa = req.body.filtro
                let totalRegistros = []
                let anotacoes = []

                try {
                        if (pesquisa) {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros 
                                FROM anotacao
                                WHERE 
                                MATCH (sintoma,software,categoria,dificuldade) 
                                AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL`)

                                anotacoes = await app.db.raw(`
                                SELECT anotacao.*, usuarios.nome_agenda, 
                                MATCH(sintoma,software,categoria,dificuldade) 
                                AGAINST("${pesquisa}") 
                                AS Relevancia 
                                FROM anotacao
                                INNER JOIN usuarios ON anotacao.id_usuario = usuarios.codigo_usuario
                                WHERE MATCH (sintoma,software,categoria,dificuldade) AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        } else {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros
                                FROM anotacao
                                WHERE deletado_em IS NULL
                                ORDER BY codigo_anotacao DESC`)

                                anotacoes = await app.db.raw(`
                                SELECT anotacao.*, usuarios.nome_agenda FROM anotacao
                                INNER JOIN usuarios ON anotacao.id_usuario = usuarios.codigo_usuario
                                WHERE anotacao.deletado_em IS NULL
                                ORDER BY anotacao.codigo_anotacao DESC
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        }
                        res.json({ anotacoes: anotacoes[0], total_registros: totalRegistros[0][0] })
                } catch (error) {
                        return res.status(500).send(error)
                }
        }

        const getAnotacaoCompartilhadasAll = async (req, res) => {
                const limit = 15
                const page = parseInt(req.query.page)
                const pesquisa = req.body.filtro
                let totalRegistros = []
                let anotacoes = []

                try {
                        if (pesquisa) {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros 
                                FROM anotacao
                                WHERE 
                                MATCH (sintoma,software,categoria,dificuldade) 
                                AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL
                                AND compartilhar = True`)

                                anotacoes = await app.db.raw(`
                                SELECT *, 
                                MATCH(sintoma,software,categoria,dificuldade) 
                                AGAINST("${pesquisa}") 
                                AS Relevancia 
                                FROM anotacao
                                WHERE 
                                MATCH (sintoma,software,categoria,dificuldade) 
                                AGAINST ("${pesquisa}")
                                AND deletado_em IS NULL
                                AND compartilhar = True
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        } else {
                                totalRegistros = await app.db.raw(`
                                SELECT COUNT(*) AS total_registros
                                FROM anotacao
                                WHERE compartilhar = True
                                AND deletado_em IS NULL
                                ORDER BY codigo_anotacao DESC`)

                                anotacoes = await app.db.raw(`
                                SELECT * FROM anotacao
                                WHERE compartilhar = True
                                AND deletado_em IS NULL
                                ORDER BY codigo_anotacao DESC
                                LIMIT ${limit} OFFSET ${(page * limit - limit)}`)
                        }
                        res.json({ anotacoes: anotacoes[0], total_registros: totalRegistros[0][0] })
                } catch (error) {
                        return res.status(500).send(error)
                }
        }

        const removeAnotacao = async (req, res) => {
                const codigo_usuario = req.params.id

                try {
                        const anotacaoExiste = await app.db("anotacao")
                                .where({ codigo_anotacao: codigo_usuario })
                                .first()
                        existeOuErro(anotacaoExiste, "Anotação não encontrada. Tente novamente!")
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                try {
                        await app.db.transaction(async trans => {
                                await app.db("anotacao")
                                        .update({ deletado_em: app.db.fn.now() })
                                        .whereNull("deletado_em")
                                        .where({ codigo_anotacao: codigo_usuario })
                        })
                                .then(() => {
                                        auditoria(req, "");
                                        res.status(204).send()
                                })
                                .catch(err => res.status(500).send(err))
                } catch (msg) {
                        return res.status(500).send(msg)
                }
        }

        return { getAnotacaoCompartilhadasAll, ADM_getAnotacaoAll, getAnotacaoAll, saveAnotacao, removeAnotacao }
}


