const nodemailer = require('nodemailer');

module.exports = app => {
        function dataAtualFormatadaBR() {
                var data = new Date(),
                        dia = data.getDate().toString().padStart(2, '0'),
                        mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
                        ano = data.getFullYear(),
                        hra = data.getHours().toString().padStart(2, '0'),
                        mnt = data.getMinutes().toString().padStart(2, '0'),
                        seg = data.getSeconds().toString().padStart(2, '0');
                return `${dia}/${mes}/${ano} ${hra}:${mnt}:${seg}`

        }
        async function auditoria(req, msgInformacoes) {
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
                        outras_informacoes: msgInformacoes,
                        data: dataAtualFormatadaBR()
                }
                await app.db("auditoria")
                        .insert(auditoria)
        }

        function EnvioEmail(para, titulo, conteudo) {
                let transporter = nodemailer.createTransport({
                        name: "softcom.heroku@softcomheroku.com.br",
                        host: "smtp.umbler.com",
                        port: 587,
                        secure: false,
                        auth: {
                                user: "softcom.heroku@softcomheroku.com.br",
                                pass: "softcomHeroku8767@"
                        }
                })

                transporter.sendMail({
                        from: "Softcom Heroku <softcom.heroku@softcomheroku.com.br>",
                        to: para,
                        subject: titulo,
                        html: conteudo
                }).then(mensagem => {
                        console.log(mensagem)
                }).catch(err => {
                        console.log(err)
                })
        }

        return { auditoria, EnvioEmail }
}