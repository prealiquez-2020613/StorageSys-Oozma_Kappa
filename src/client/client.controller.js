import Client from './client.model.js'

export const save = async (req, res) => {
    try {
        const data = req.body
        const client = new Client(data)
        await client.save()

        return res.send({
            success: true,
            message: `${client.name} saved successfully`,
            client
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when adding client',
            error: err.message
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const { limit, skip = 0 } = req.query
        const clients = await Client.find().skip(Number(skip)).limit(Number(limit))

        if (clients.length === 0)
            return res.status(404).send({ success: false, message: 'No clients found' })

        return res.send({
            success: true,
            message: 'Clients retrieved successfully',
            clients,
            total: clients.length
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when fetching clients',
            error: err.message
        })
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        const client = await Client.findById(id)

        if (!client)
            return res.status(404).send({ success: false, message: 'Client not found' })

        return res.send({ success: true, message: 'Client found', client })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when fetching client',
            error: err.message
        })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true })

        if (!updatedClient)
            return res.status(404).send({ success: false, message: 'Client not found' })

        return res.send({ success: true, message: 'Client updated', client: updatedClient })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when updating client',
            error: err.message
        })
    }
}

export const eliminate = async (req, res) => {
    try {
        const { id } = req.params
        const client = await Client.findByIdAndDelete(id)

        if (!client)
            return res.status(404).send({ success: false, message: 'Client not found' })

        return res.send({ success: true, message: 'Client deleted', client })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error when deleting client',
            error: err.message
        })
    }
}
