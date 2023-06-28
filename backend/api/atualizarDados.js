const puppeteer = require('puppeteer');
const axios = require("axios");
const fs = require("fs");

module.exports = app => {
        const { existeOuErro, naoExisteOuErro, dataAtualFormatadaBR } = app.api.validador
        const { auditoria } = app.api.utilitiarios

        const atualizarTabelaFaq = async (req, res) => {
                res.status(204).send();
                const browser = await puppeteer.launch()
                /* const browser = await puppeteer.launch({
                        headless: false
                }) */
                const page = await browser.newPage()
                let ArrayFaqFiltrado = [];
                let ArrayFaqAutoImport = [];
                let qdtFaqsEncontrados = 0;
                let qtdFaqsNaoEncontrados = 0;
                let qtdFaqSemAutoImport = 0;

                /* REMOVE OS FAQS QUE FOI DEFINIDO SEM O AUTO IMPORT. ISSO E NECESSARIO PARA NAO DAR ERRO DE DUPLICIDADE NA HORA DE INSERIR O ARRAY COM TODOS OS FAQS FILTRADOS */
                function removeFaqSemAutoImport(array, id) {
                        var result = array.filter(function (el) {
                                return el.registro == id;
                        });

                        for (var elemento of result) {
                                var index = array.indexOf(elemento);
                                array.splice(index, 1);
                        }
                }
                function removeSpecials(str) {
                        var lower = str.toLowerCase();
                        var upper = str.toUpperCase();

                        var res = "";
                        for (var i = 0; i < lower.length; ++i) {
                                if (lower[i] != upper[i] || lower[i].trim() === '')
                                        res += str[i];
                        }
                        return res;
                }
                for (var index = 1; index < 7000; index++) {
                        try {
                                if (index != 4767) {
                                        /* ABRE A PAGINA DO FAQ */
                                        await page.goto(`http://177.43.232.3:10000/helptools2/public/core/promover/detalhe/id/${index}`, { waitUntil: 'load' })
                                        /* ESPERA ATE QUE o BODY SEJA CARREGADA NO NAVEGADOR */
                                        await page.waitForSelector("body")

                                        /* PERCORRE A PAGINA PARA PEGA OS SELETORES NECESSARIOS */
                                        let getFaq = await page.evaluate(() => {
                                                /* VERIFICA SE A PAGINA TEM A DIV COM AS INFORMAÇÕES NECESSARIA */
                                                if (document.querySelector("body > div.panel.panel-default > div.panel-heading")) {
                                                        return {
                                                                registro: document.querySelector("body > div.panel.panel-default > div.panel-heading").innerText.split(" ", 20)[3],
                                                                pergunta: document.querySelector("body > div.panel.panel-default > div.panel-body > div:nth-child(1) > h3").innerText,
                                                                grupo: document.querySelector("body > div.panel.panel-default > div.panel-heading").innerText.split(" ", 25),
                                                        }
                                                } else {
                                                        return { registro: false, pergunta: false }
                                                }
                                        })

                                        if (getFaq.registro && getFaq.pergunta) {
                                                qdtFaqsEncontrados++
                                                /* PERCORRE A DIV CABEÇALHO PARA PEGAR O  NOME DO GRUPO DO FAQ */
                                                for (let y = 0; y < getFaq.grupo.length; y++) {
                                                        if (getFaq.grupo[y].trim() == 'Tempo') {
                                                                /* TRIM()= RETIRAR TODOS OS ESPAÇOS EM BRANCO NA STRING */
                                                                /* SE O GRUPO TIVER VAZIO, SETA UM VALOR PADRAO */
                                                                if (!getFaq.grupo.slice(5, y).toString().replace(/,/g, ' ')) {
                                                                        getFaq.grupo = "SELECIONE"
                                                                } else {
                                                                        getFaq.grupo = getFaq.grupo.slice(5, y).toString().replace(/,/g, ' ')
                                                                }
                                                                ArrayFaqFiltrado.push({
                                                                        registro: getFaq.registro,
                                                                        pergunta: getFaq.pergunta,
                                                                        grupo: getFaq.grupo,
                                                                        tags: `${getFaq.registro} | ${getFaq.grupo.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^ a-zA-Z0-9]/g, '').toUpperCase()} | ${getFaq.pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^ a-zA-Z0-9]/g, '').toUpperCase()
                                                                                }`,
                                                                        auto_import: 1,
                                                                        status: 'Ativo'
                                                                })
                                                                break;
                                                        }
                                                }
                                        } else {
                                                qtdFaqsNaoEncontrados++
                                                console.log("Não existe a div panel-heading, FAQ:" + index)
                                        }
                                }
                        } catch (error) {
                                console.log("Houver erro ao atualizar a tabela de FAQ: " + error)
                        }

                }
                /* REMOVE TODOS FAQS QUE NAO TEM O AUTO IMPORT AUTOMATICO */
                await app.db("faq").delete().where({ auto_import: 1 })
                        .then(() => console.log("[SUCESSO] ao limpar tabela de [faqs]: " + dataAtualFormatadaBR()))
                        .catch(err => console.log("[ERRO] ao limpar tabela de [faq]: " + err))

                /* CONSULTA TODOS FAQS QUE COM AUTO-IMPORT */
                await app.db("faq").select("registro").where({ auto_import: 0 })
                        .then(function (faqsAuto) {
                                console.log("[SUCESSO] ao consultar faqs sem [auto_import]: " + dataAtualFormatadaBR())
                                ArrayFaqAutoImport = faqsAuto
                                qtdFaqSemAutoImport = faqsAuto.length
                        })
                        .catch(err => console.log("[ERRO] ao consultar faqs sem [auto_import]: " + err))

                /* REMOVE OS FAQS QUE FOI DEFINIDO SEM O AUTO IMPORT. ISSO E NECESSARIO PARA NAO DAR ERRO DE DUPLICIDADE NA HORA DE INSERIR O ARRAY COM TODOS OS FAQS FILTRADOS */
                for (let y = 0; y < ArrayFaqAutoImport.length; y++) {
                        removeFaqSemAutoImport(ArrayFaqFiltrado, ArrayFaqAutoImport[y].registro)
                }

                /* INSERE O ARRAY COM TODOS FAQS FILTRADOS  */
                await app.db("faq")
                        .insert(ArrayFaqFiltrado)
                        .then(() => console.log("[SUCESSO] Atualizado tabela de [faq]: " + dataAtualFormatadaBR()))
                        .catch(err => console.log("[ERRO] Não foi possível atualizar tabela de [faq]: " + err))

                await app.db("cabecalho_faq")
                        .insert({ qtd_faqs_encontrados: qdtFaqsEncontrados, qtd_faqs_ausentes: qtdFaqsNaoEncontrados, qtd_sem_autoimport: qtdFaqSemAutoImport, data_atualizacao: dataAtualFormatadaBR() })
                        .then(() => console.log("[SUCESSO] Atualizado tabela de [cabecalho_faq]: " + dataAtualFormatadaBR()))
                        .catch(err => console.log("[ERRO] Não foi possível atualizar tabela de [cabecalho_faq]: " + err))

                /* ATUALIZA FAQS VALIDOS N2 */
                await app.db.raw("UPDATE faq SET valido_n2 = true  WHERE registro IN ('5','1222','1561','1587','1622','1659','1694','1797','1816','1882','1889','2023','2196','2224','2342','2377','2441','2442','2673','2710','2715','2730','2749','2808','2821','2826','2917','3016','3045','3215','3234','3332','3355','3362','3381','3388','3390','3398','3399','3401','3436','3482','3483','3487','3492','3493','3494','3495','3497','3498','3507','3510','3518','3533','3535','3541','3604','3608','3630','3632','3652','3664','3720','3722','3728','3750','3755','3789','3966','3975','4123','4201','4206','4212','4213','4272','4285','4596','3276','1830','1822','1699','1751','3665','3676')")
                        .then(() => {
                                console.log("[SUCESSO] Atualizado faqs válidos N2 [valido_n2]: " + dataAtualFormatadaBR())
                        })
                        .catch(err => console.log("[ERRO] Não foi possível atualizar faqs válidos N2 [valido_n2]: " + err))

                /* ATUALIZA FAQS VALIDOS N1 */
                await app.db.raw("UPDATE faq SET valido_n1 = true  WHERE registro IN ('5','47','97','203','210','217','302','304','310','316','324','392','439','482','514','516','683','692','742','792','808','825','842','848','852','1013','1018','1055','1057','1060','1089','1270','1330','1336','1354','1361','1383','1412','1417','1429','1460','1561','1563','1566','1604','1613','1622','1626','1640','1659','1664','1668','1677','1696','1698','1785','1816','1822','1830','1836','1882','1892','1896','1917','1940','1943','1950','1953','1958','1959','1974','1999','2001','2023','2109','2112','2118','2150','2196','2204','2211','2215','2218','2226','2231','2233','2238','2267','2275','2278','2289','2293','2310','2324','2342','2351','2358','2363','2391','2396','2432','2438','2441','2442','2458','2476','2481','2482','2486','2575','2637','2656','2657','2659','2673','2710','2808','2826','2839','2841','2858','2878','2886','2924','2945','2987','3016','3017','3021','3023','3026','3044','3052','3054','3143','3158','3159','3215','3221','3276','3332','3398','3399','3400','3424','3435','3436','3453','3475','3476','3477','3479','3489','3491','3493','3494','3495','3496','3503','3508','3510','3518','3520','3530','3535','3539','3541','3553','3556','3559','3565','3568','3569','3571','3573','3574','3576','3579','3589','3590','3596','3598','3600','3616','3617','3619','3621','3624','3630','3633','3634','3635','3637','3638','3639','3648','3652','3724','3726','3729','3743','3744','3748','3754','3755','3770','3788','3792','3793','3806','3810','3838','3850','3852','3853','3854','3886','3902','3916','3927','3947','3966','3978','4032','4188','4194','4196','4205','4218','4221','4227','4230','4237','4242','4252','4254','4267','4272','4317','4391','4437','4438','4439','4511','4594','4595','4605','4611','4612','4622','4667','4801')")
                        .then(() => {
                                auditoria(req, `< p > Atualizado tabela de[faqs]:</p >
                                <p>Faqs encontrados: ${qdtFaqsEncontrados}</p>
                                <p>Faqs ausentes: ${qtdFaqsNaoEncontrados}</p>
                                <p>Faqs sem auto import: ${qtdFaqSemAutoImport}</p>
                                `);
                                console.log("[SUCESSO] Atualizado faqs válidos N1 [valido_n1]: " + dataAtualFormatadaBR())
                        })
                        .catch(err => console.log("[ERRO] Não foi possível atualizar faqs válidos N1 [valido_n1]: " + err))

                /* FINALIZAR O BROWSER */
                await browser.close();
        }


        return { atualizarTabelaFaq }
}
