import Movement from './movement.model.js'

export const getAllMovements = async (req, res) => {
    try {
        const movements = await Movement.find()
            .populate('product', 'name')
            .populate('employee', 'name email')
            .sort({ date: -1 })

        return res.send({
            message: 'Movements retrieved successfully',
            success: true,
            movements
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error retrieving movements',
            success: false,
            error
        })
    }
}

export const createMovement = async (req, res) => {
    try {
        const { type, quantity, employee, reason, destination } = req.body
        const productDoc = req.productDoc

        const movement = new Movement({
            product: productDoc._id,
            type,
            quantity,
            employee,
            reason,
            destination
        })

        await movement.save()

        productDoc.quantity += (type === 'ENTRY' ? quantity : -quantity)
        await productDoc.save()

        return res.send({
            message: 'Movement recorded successfully',
            success: true,
            movement
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error creating movement',
            success: false,
            error
        })
    }
}


export const getMovementById = async (req, res) => {
    try {
        const movement = await Movement.findById(req.params.id)
            .populate('product', 'name')
            .populate('employee', 'name email')

        if (!movement) {
            return res.status(404).send({
                message: 'Movement not found',
                success: false
            })
        }

        return res.send({
            message: 'Movement retrieved successfully',
            success: true,
            movement
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error retrieving movement',
            success: false,
            error
        })
    }
}

export const deleteMovement = async (req, res) => {
    try {
        const { movement, product, rollback } = req

        product.quantity += rollback
        await product.save()
        await movement.deleteOne()

        return res.send({
            message: 'Movement deleted and inventory updated',
            success: true
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error deleting movement',
            success: false,
            error
        })
    }
}

export const filterMovements = async (req, res) => {
    try {
        const { type, product, from, to } = req.params
        const filters = {}

        if (type) filters.type = type
        if (product) filters.product = product
        if (from || to) {
            filters.date = {}
            if (from) filters.date.$gte = new Date(from)
            if (to) filters.date.$lte = new Date(to)
        }

        const movements = await Movement.find(filters)
            .populate('product', 'name')
            .populate('employee', 'name email')
            .sort({ date: -1 })

        return res.send({
            message: 'Filtered movements retrieved',
            success: true,
            movements
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error filtering movements',
            success: false,
            error
        })
    }
}
