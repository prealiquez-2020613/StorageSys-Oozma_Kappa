import Movement from '../src/movement/movement.model.js'
import Product from '../src/product/product.model.js'

export const verifyMovementForDelete = async (req, res, next) => {
    try {
        const movement = await Movement.findById(req.params.id)
        if (!movement) {
            return res.status(404).send({
                message: 'Movement not found',
                success: false
            })
        }

        const product = await Product.findById(movement.product)
        if (!product) {
            return res.status(404).send({
                message: 'Product not found',
                success: false
            })
        }

        const rollback = movement.type === 'ENTRY' ? -movement.quantity : movement.quantity
        if (product.quantity + rollback < 0) {
            return res.status(400).send({
                message: 'Cannot delete movement: insufficient stock for rollback',
                success: false
            })
        }

        req.movement = movement
        req.product = product
        req.rollback = rollback

        next()
    } catch (error) {
        return res.status(500).send({
            message: 'Error verifying movement',
            success: false,
            error
        })
    }
}

export const verifyMovementCreation = async (req, res, next) => {
    try {
        const { product, type, quantity } = req.body

        const existingProduct = await Product.findById(product)
        if (!existingProduct) {
            return res.status(404).send({
                message: 'Product not found',
                success: false
            })
        }

        if (type === 'EXIT' && existingProduct.quantity < quantity) {
            return res.status(400).send({
                message: 'Not enough stock available for this exit',
                success: false
            })
        }

        req.productDoc = existingProduct
        next()
    } catch (error) {
        return res.status(500).send({
            message: 'Error verifying movement creation',
            success: false,
            error
        })
    }
}
