const { senhaSecretaAutenticacao } = require("../.env")
const jwt = require("jwt-simple")
const bcrypt = require("bcrypt-nodejs")
const nodemailer = require('nodemailer');

module.exports = app => {
        const { existeOuErro, validarEmail, igualOuErro } = app.api.validador
        const { auditoria } = app.api.utilitiarios

        const criarSenha = senha => {
                const salt = bcrypt.genSaltSync(10)
                return bcrypt.hashSync(senha, salt)
        }
        /* CONFIGURAÇÃO EMAIL */
        const transporter = nodemailer.createTransport({
                host: 'smtp.umbler.com',
                port: 587,
                secure: false,
                auth: {
                        user: 'softcom.heroku@softcomheroku.com.br',
                        pass: 'softcomHeroku8767@'
                }
        })

        function gerarCodigoAutenticacao() {
                const valorMaximo = 999999999999;
                const valorMinimo = 100000000000;

                let codigoGerado = Math.floor(
                        Math.random() * (valorMaximo - valorMinimo + 1) + valorMinimo
                );
                return codigoGerado
        }

        let data = new Date()
        let dia = data.getDate().toString().padStart(2, '0')
        let mes = (data.getMonth() + 1).toString().padStart(2, '0') //+1 pois no getMonth Janeiro começa com zero.
        let ano = data.getFullYear()

        const enviarEmailAutenticacao = async (req, res) => {
                const { email } = req.body
                transporter.sendMail({
                        from: `"Softcom Heroku " <softcom.heroku@softcomheroku.com.br>`,
                        to: email,
                        subject: "Verifique sua nova conta da Softcom Heroku",
                        html: `<div style='text-align: center;'>
                        <thead style='text-align: center;'>
                          <img
                            src='https://ci5.googleusercontent.com/proxy/zM3TF8xQ2Ctb__e24DIogvB4EfR4V9z3ycj_D_pGhtlxj8B_DDQt8OA0t6Ss2K3Xrw9uHMs6iIyPEnwWu0kd6HY=s0-d-e1-ft#https://i.ibb.co/bWdjRPg/softcomlogo-Email.png'
                            alt='logo'
                            width='180px'
                          />
                          <hr />
                          <h3>Verifique sua nova conta da Softcom Heroku</h3>
                          <hr />
                          <p>Acesso o link a baixo para autenticar sua conta:</p>
                          <a href='http://www.softcomheroku.com.br/autenticacao/$2a$10$thTlRwJG.Ifh7w24yQ$2a$10$tlRwJG.Ifh24yQofneBscUpxYYT.W0SzCPiPCr6Mex7RUmoeBscUpxYYT/${email}/W0SzCPiPCrSr6Mex7RUmofneBscUpxYYT/${true}'>http://www.softcomheroku.com.br/autenticacao/$2a$10$thTlRwJG.Ifh7w24yQ$2a$10$thTlRwJG.Ifh7w24yQofneBscUpxYYT.W0SzCPiPCrSr6Mex7RUmofneBscUpxYYT/W0SzCPiPCrSr6Mex7RUmofneBscUpxYY</a>
                        </thead>
                      </div>`
                })
                        .then(() => res.status(204).send())
                        .catch(err => res.status(500).send(err))
        }

        const entrar = async (req, res) => {
                const { email, senha } = req.body

                try {
                        existeOuErro(email, "O endereço de E-MAIL deve ser informado.");
                        existeOuErro(senha, "A SENHA deve ser informada.");
                        validarEmail(email, "Endereço de E-MAIL inválido. Por favor, verifique o E-EMAIL informado.");

                } catch (error) {
                        return res.status(400).send(error)
                }

                const usuario = await app.db("usuarios")
                        .where({ email: email })
                        .first()
                if (!usuario) return res.status(400).send("Usuário não encontrado!")
                if (usuario.status == "Inativo") return res.status(400).send("Usuário inativo. Contate o dep.")

                try {
                        const senhaIgual = bcrypt.compareSync(senha, usuario.senha)
                        if (!senhaIgual) return res.status(400).send("Email/Senha inválidos!")
                } catch (error) {
                        return res.status(400).send("Email/Senha inválidos!")
                }

                const data = Math.floor(Date.now() / 1000)

                const payload = {
                        codigo_usuario: usuario.codigo_usuario,
                        email: usuario.email,
                        nome_agenda: usuario.nome_agenda,
                        admin: usuario.admin,
                        codigo_autenticacao: usuario.codigo_autenticacao,
                        status: usuario.status,
                        iat: data, // emitido em
                        exp: data + (60 * 60 * 24 * 90) // expira em 3 dias (60segundos x 60 minutos x 24horas x 90 dias)
                }

                res.json({
                        ...payload,
                        token: jwt.encode(payload, senhaSecretaAutenticacao)
                })
        }


        const autenticar = async (req, res) => {
                const { email } = req.body
                req.body = {};
                req.user = {
                        codigo_usuario: "Avulso",
                        nome_agenda: "Avulso",
                        admin: "Avulso"
                }
                try {
                        existeOuErro(email, "O endereço de E-MAIL deve ser informado.");
                        validarEmail(email, "Endereço de E-MAIL inválido. Por favor, verifique o E-EMAIL informado.");
                } catch (error) {
                        return res.status(400).send(error)
                }
                const usuario = await app.db("usuarios")
                        .where({ email: email })
                        .first()
                if (usuario.codigo_autenticacao) return res.status(400).send("Usuário já autenticado.")
                if (!usuario) return res.status(400).send("[E-mail] Usuário não encontrado! </br>Verifique se o email foi digitado corretamente.")
                if (usuario.status == "Inativo") return res.status(400).send("Usuário inativo. Contate o ADM.")

                /*  CADASTRA CODIGO DE AUTENTICACAO DO USUARIO */
                await app.db("usuarios")
                        .update({ codigo_autenticacao: gerarCodigoAutenticacao() })
                        .where({ codigo_usuario: usuario.codigo_usuario })
                        .then(() => {
                                auditoria(req, `<p>[Sistema] Codigo de autenticação cadastrado com sucesso[usuarios]</p>
                                Email: ${email}`);
                                res.status(204).send();
                        })
                        .catch(err => {
                                auditoria(req, `<p>[ERRO] Ouve um erro ao tentar cadastrar o codigo de autenticação do usuario [usuarios]:
                  ${err}`);
                                console.log("[ERRO] Ouve um erro ao tentar cadastrar o codigo de autenticação do usuario [usuarios]: " + err);
                                res.status(500).send("[ERRO] Ouve um erro ao tentar cadastrar o codigo de autenticação do usuario [usuarios]");
                        })
        }

        const recuperarSenha = async (req, res) => {
                req.user = {
                        codigo_usuario: "Avulso",
                        nome_agenda: "Avulso",
                        admin: "Avulso"
                }
                const { email } = req.body

                try {
                        existeOuErro(email, "O endereço de E-MAIL deve ser informado.");
                        validarEmail(email, "Endereço de E-MAIL inválido. Por favor, verifique o E-EMAIL informado.");
                } catch (error) {
                        return res.status(400).send(error)
                }

                const usuario = await app.db("usuarios")
                        .where({ email: email })
                        .first()
                if (!usuario) return res.status(400).send("[E-mail] Usuário não encontrado! </br>Verifique se o email foi digitado corretamente.")
                if (usuario.status == "Inativo") return res.status(400).send("Usuário inativo. Contate o ADM.")

                /* CRIAR UMA SENHA TEMPORARIA */
                let senhaRedefinida = `${parseInt(dia) + 12}aWr5awT9${parseInt(usuario.codigo_usuario) + 13}${parseInt(dia) + 6}Teusw9Pz${usuario.codigo_autenticacao}aAf${parseInt(dia) + 3}69Am${mes}l9uQ${parseInt(usuario.codigo_usuario) + 23}4aP${ano}a4ZwF${parseInt(dia) + 5}WsL${parseInt(usuario.codigo_usuario) + 37}3t`
                /*  if (senhaRedefinida == usuario.senha) return res.status(400).send("Sua senha já foi redefinida. <br> Por favor, verifique seu email.") */

                /* ATUALIZA A SENHA PARA A SENHA TEMPORARIA */
                await app.db("usuarios")
                        .update({ senha: senhaRedefinida })
                        .where({ codigo_usuario: usuario.codigo_usuario })
                /* https://accounts.google.com/DisplayUnlockCaptcha  */
                /* https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs */
                await transporter.sendMail({
                        from: `"Softcom Heroku " <softcom.heroku@softcomheroku.com.br>`,
                        to: email,
                        subject: "Recuperar senha Softcom Heroku",
                        html: `<div style='text-align: center;'>
                        <thead style='text-align: center;'>
                          <img
                            src='https://ci5.googleusercontent.com/proxy/zM3TF8xQ2Ctb__e24DIogvB4EfR4V9z3ycj_D_pGhtlxj8B_DDQt8OA0t6Ss2K3Xrw9uHMs6iIyPEnwWu0kd6HY=s0-d-e1-ft#https://i.ibb.co/bWdjRPg/softcomlogo-Email.png'
                            alt='logo'
                            width='180px'
                          />
                          <hr />
                          <h3>Recuperar senha Softcom Heroku</h3>
                          <hr />
                          <p>Acesse o link para redefinir uma nova senha</p>
                          <a href='http://www.softcomheroku.com.br/autenticacao/$2a$10$thTlRwJG.Ifh7w24yQ$2a$10$thTlRwJG.Ifh7w24yQofneBscUpxYYT.W0SzCPiPCrSr6Mex7RUmofneBscUpxYYT/${email}/${senhaRedefinida}/${false}'>http://www.softcomheroku.com.br/autenticacao/$2a$10$thTlRwJG.Ifh7w24yQ$2a$10$thTlRwJG.Ifh7w24yQofneBscUpxYYT.W0SzCPiPCrSr6Mex7RUmofneBscUpxYYT/W0SzCPiPCrSr6Mex7RUmofneBscUpxYY</a>
                        </thead>
                      </div>`
                })
                        .then(() => {
                                auditoria(req, `<p>[Sistema] A senha do usuário foi redefinida para a recuperação [usuarios]</p>`);
                                res.status(204).send()
                        })
                        .catch(err => {
                                auditoria(req, `<p>[ERRO] Ouve um erro ao tentar redefinir a senha para a recuperação [usuarios]:
                ${err}`);
                                res.status(500).send(err)
                                console.log("[ERRO] Ouve um erro ao tentar redefinir a senha para a recuperação [usuarios]: " + err)
                        })

        }
        const redefinirSenha = async (req, res) => {
                const { email, novaSenha, confirmaNovaSenha, senhaRedifinidaAutomatica } = req.body
                req.body = {};
                req.user = {
                        codigo_usuario: "Avulso",
                        nome_agenda: "Avulso",
                        admin: "Avulso"
                }

                try {
                        existeOuErro(email, "O endereço de E-MAIL deve ser informado.");
                        validarEmail(email, "Endereço de E-MAIL inválido. Por favor, verifique o E-EMAIL informado.");
                        existeOuErro(novaSenha, "A SENHA deve ser preenchida.");
                        existeOuErro(confirmaNovaSenha, "Confirme a SENHA.");
                        igualOuErro(novaSenha, confirmaNovaSenha, "As SENHAS informadas não conferem.");

                } catch (error) {
                        return res.status(400).send(error)
                }

                const usuario = await app.db("usuarios")
                        .where({ email: email })
                        .first()
                if (!usuario) return res.status(400).send("[E-mail] Usuário não encontrado! </br>Verifique se o email foi digitado corretamente.")
                if (usuario.status == "Inativo") return res.status(400).send("Usuário inativo. Contate o ADM.")

                try {
                        igualOuErro(usuario.senha, senhaRedifinidaAutomatica, "[Erro] Não foi possível redefinir sua senha. <br> Volte até a tela incial e envie um novo email de recuperação.");
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                /* REDEFINE SENHA DO USUARIO */
                await app.db("usuarios")
                        .update({ senha: criarSenha(novaSenha) })
                        .where({ codigo_usuario: usuario.codigo_usuario })
                        .then(() => {
                                auditoria(req, `<p>A nova senha do usuário foi redefinida com sucesso.</p >
                                E-mail: ${usuario.email}`);
                                res.status(204).send();
                        })
                        .catch(err => {
                                auditoria(req, `<p>[ERRO] Ouve um erro ao salvar a nova senha redefinida pelo usuário:
                                ${err}`);
                                res.status(500).send("[Erro] Não foi possivel redefinir sua senha. <br> Tente redefinir sua senha novamente na tela inicial, caso o erro persista contate o dep.");
                        })
        }
        const validarToken = async (req, res) => {
                const dataUsuario = req.body || null
                try {
                        if (dataUsuario) {
                                // VALIDA SE O TOKEN É VALIDO
                                const token = jwt.decode(dataUsuario.token, senhaSecretaAutenticacao)
                                const funcionarioDB = await app.db("usuarios")
                                        .where({ codigo_usuario: token.codigo_usuario })
                                        .first()

                                if (!funcionarioDB) return res.send(false)
                                if (funcionarioDB.codigo_usuario !== token.codigo_usuario) return res.send(false)
                                if (!funcionarioDB.codigo_autenticacao) return res.send(false)
                                if (funcionarioDB.codigo_autenticacao !== token.codigo_autenticacao) return res.send(false)
                                if (funcionarioDB.email !== token.email) return res.send(false)
                                if (funcionarioDB.nome_agenda !== token.nome_agenda) return res.send(false)
                                if (funcionarioDB.status !== token.status) return res.send(false)
                                if (funcionarioDB.admin !== token.admin) return res.send(false)

                                //NO JS A DATA E EM MILISSEGUNDOS, NO TOKEN ESTA EM SEGUNDOS, MULTIPLICO POR 1000 PRA TRANSFORMA EM MILISSEGUNDOS TBM.
                                if (new Date(token.exp * 1000) > new Date()) {
                                        return res.send(true)
                                }
                        }
                } catch (e) {
                        // problema com o token
                        // poderia criar  uma nova data de expiração para o teken aqui.  
                }
                return res.send(false)
        }

        const validarUsuarioADM = async (req, res) => {
                const dataUsuario = req.body || null
                try {
                        if (dataUsuario) {
                                const usuario = await app.db("usuarios").select("admin", "codigo_usuario").where({ "codigo_usuario": dataUsuario.codigo_usuario }).first()
                                const token = jwt.decode(dataUsuario.token, senhaSecretaAutenticacao)
                                if (new Date(token.exp * 1000) > new Date() && usuario.admin) {
                                        return res.send(true)
                                }
                        }
                } catch (e) {
                }
                return res.send(false)
        }

        return { entrar, validarToken, validarUsuarioADM, recuperarSenha, redefinirSenha, autenticar, enviarEmailAutenticacao }
}