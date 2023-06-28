const admin = require("./admin")

module.exports = app => {
   app.post("/validarToken", app.api.autenticacao.validarToken) //publico
   app.post("/validarUsuarioAdm", app.api.autenticacao.validarUsuarioADM) //publico
   app.post("/entrar", app.api.autenticacao.entrar) //publico
   app.post("/recuper_senha", app.api.autenticacao.recuperarSenha) //publico
   app.post("/redefinir_nova_senha", app.api.autenticacao.redefinirSenha) //publico
   app.post("/email_autenticacao", app.api.autenticacao.enviarEmailAutenticacao) //publico
   app.post("/autenticar_usuario", app.api.autenticacao.autenticar) //publico

   app.route("/conta") //publico
      .post(app.api.usuario.saveUsuario)

   app.route("/conta_adm")
      .all(app.config.passport.authenticate())
      .post(admin(app.api.usuario.saveUsuario))
      .get(admin(app.api.usuario.getUsuarios))
   app.route("/conta_adm/:id")
      .all(app.config.passport.authenticate())
      .put(admin(app.api.usuario.saveUsuario))
      .delete(admin(app.api.usuario.removeUsuario))

   app.route("/auditoria")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.auditoria.getAuditoria))

   app.route("/atualizar_faqs")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.atualizarDados.atualizarTabelaFaq))

   app.route("/adm_faq")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.faqs.getFaqsAdm))
      .post(admin(app.api.faqs.saveFaq))
   app.route("/adm_faq/:id")
      .all(app.config.passport.authenticate())
      .put(admin(app.api.faqs.saveFaq))

   app.route("/adm_grupo_faq")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.faqs.getGruposFaqAdm))
      .post(admin(app.api.faqs.saveGrupoFaq))
   app.route("/adm_grupo_faq/:id")
      .all(app.config.passport.authenticate())
      .put(admin(app.api.faqs.saveGrupoFaq))

   app.route("/adm_anotacao")
      .all(app.config.passport.authenticate())
      .put(admin(app.api.anotacoes.ADM_getAnotacaoAll))

   app.route("/anotacao")
      .all(app.config.passport.authenticate())
      .post(app.api.anotacoes.saveAnotacao)
   app.route("/anotacao/:id")
      .all(app.config.passport.authenticate())
      /*    .get(app.api.anotacoes.getAnotacaoID) */
      .put(app.api.anotacoes.saveAnotacao)
      .delete(app.api.anotacoes.removeAnotacao)

   app.route("/anotacaoAllUserAnotacao/:id")
      .all(app.config.passport.authenticate())
      .put(app.api.anotacoes.getAnotacaoAll)


   app.route("/anotacao_compartilhadasAll") //publico
      .put(app.api.anotacoes.getAnotacaoCompartilhadasAll)


   app.route("/get_faqs_all") //publico
      .get(app.api.faqs.getFaqsAll)

   app.route("/get_faqs_n2") //publico
      .get(app.api.faqs.getFaqsN2)

   app.route("/get_faqs_validos") //publico
      .get(app.api.faqs.getFaqsValidos)

   app.route("/get_faqs_grupos")  //publico
      .get(app.api.faqs.getGruposFaq)

   app.route("/historico_visita")  //publico
      .post(app.api.usuario.setHistoricoVisita)

   app.route("/jornada_funcionarios")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.jornada.getFuncionarios))

   app.route("/jornada_funcionarios/:id")
      .all(app.config.passport.authenticate())
      .put(admin(app.api.jornada.saveFuncionario))

   app.route("/jornada_servicedesk")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.jornada.getServiceDesk))

   app.route("/jornada_servicedesk_retaguarda")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.jornada.getServiceDeskRetaguarda))

   app.route("/jornada_servicedesk_estagiario_callcenter")
      .all(app.config.passport.authenticate())
      .get(admin(app.api.jornada.getServiceDeskEstagiarioCallCenter))
}
