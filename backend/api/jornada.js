module.exports = app => {
        const saveFuncionario = async (req, res) => {
                const funcionarioBody = {
                        codigo_funcionario,
                        status,
                        personagem_gif,
                } = req.body;
                if (req.params.id) funcionarioBody.codigo_funcionario = req.params.id

                if (funcionarioBody.codigo_funcionario) {
                        await app.db("jornada_funcionarios")
                                .update(funcionarioBody)
                                .where({ codigo_funcionario: funcionarioBody.codigo_funcionario })
                                .then(() => res.status(204).send())
                                .catch(err => res.status(500).send(err))
                }
        }
        const getFuncionarios = (req, res) => {
                app.db.raw("SELECT  codigo_funcionario, nome_suporte, setor, subsetor, personagem_gif, status, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista) AS qtd_insignia FROM jornada_funcionarios WHERE setor= 'SERVICE DESK'")
                        .then(funcionario => res.json(funcionario))
                        .catch(err => res.status(500).send(err))
        }

        const getServiceDesk = (req, res) => {
                app.db.raw("SELECT  codigo_funcionario, nome_suporte, personagem_gif, new_player, pro_player, hacker, overpower, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) * 100/24 AS somatorioNewPlayer, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) AS qtd_insignia FROM jornada_funcionarios WHERE setor= 'SERVICE DESK' AND status= 'Ativo'")
                        .then(funcionario => res.json(funcionario))
                        .catch(err => res.status(500).send(err))
        }

        const getServiceDeskRetaguarda = (req, res) => {
                app.db.raw("SELECT  codigo_funcionario, nome_suporte, personagem_gif, new_player, pro_player, hacker, overpower, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) * 100/24 AS somatorioNewPlayer, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) AS qtd_insignia FROM jornada_funcionarios WHERE setor= 'SERVICE DESK' AND subsetor= 'RETAGUARDA' AND status= 'Ativo'")
                        .then(funcionario => res.json(funcionario))
                        .catch(err => res.status(500).send(err))
        }

        const getServiceDeskEstagiarioCallCenter = (req, res) => {
                app.db.raw("SELECT  codigo_funcionario, nome_suporte, personagem_gif, new_player, pro_player, hacker, overpower, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) * 100/24 AS somatorioNewPlayer, abs(np_batismo + np_60minutos + np_relatarios + np_segmentos + np_docs_fiscais + np_boleto_pay + np_birdbox + np_mobile + np_certificacao_n1 + np_oportunidades + np_acao_preventiva + np_trilha_sped + np_rodizio_implantacao + np_sinuca + np_trilha_especialista + pp_banco_dados + pp_trilha_n2 + pp_dicionario_dados + pp_padrinho + pp_trilha_parametrizacao + pp_trilha_testes + hk_access + hk_vba + hk_meu_projeto) AS qtd_insignia FROM jornada_funcionarios WHERE setor= 'SERVICE DESK' AND subsetor= 'ESTAGIARIO' OR subsetor= 'CALL CENTER' AND status= 'Ativo'")
                        .then(funcionario => res.json(funcionario))
                        .catch(err => res.status(500).send(err))
        }

        return { saveFuncionario, getFuncionarios, getServiceDesk, getServiceDeskRetaguarda, getServiceDeskEstagiarioCallCenter }
}
