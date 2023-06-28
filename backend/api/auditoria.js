module.exports = app => {
        const getAuditoria = (req, res) => {
                app.db("auditoria")
                        .orderBy('codigo_auditoria', 'desc')
                        .then(auditoria => res.json(auditoria))
                        .catch(error => res.status(500).send(error))
        }

        return { getAuditoria }
}