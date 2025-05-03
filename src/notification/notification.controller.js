import Notification from './notification.model.js';
import Product from '../product/product.model.js';
import { checkDuplicateNotification } from '../../helpers/db.validators.js';

// Get all notifications
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('product', 'name');
        
        res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error getting notifications. Please contact the administrator.'
        });
    }
};

// Get notifications by product ID
export const getNotificationsByProduct = async (req, res) => {
    const { productId } = req.params;
    
    try {
        const notifications = await Notification.find({ product: productId }).populate('product', 'name');
        
        res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error getting notifications. Please contact the administrator.'
        });
    }
};

// Get unread notifications
export const getUnseenNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ seen: false }).populate('product', 'name');
        
        res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error getting unseen notifications. Please contact the administrator.'
        });
    }
};

// Mark notification as seen
export const markNotificationAsSeen = async (req, res) => {
    const { id } = req.params;
    
    try {
        const notification = await Notification.findByIdAndUpdate(id, { seen: true }, { new: true });
        
        if (!notification) {
            return res.status(404).json({
                ok: false,
                msg: 'Notification not found'
            });
        }
        
        res.status(200).json({
            ok: true,
            notification
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error updating notification. Please contact the administrator.'
        });
    }
};

// Mark all notifications as seen
export const markAllNotificationsAsSeen = async (req, res) => {
    try {
        await Notification.updateMany({ seen: false }, { seen: true });
        
        res.status(200).json({
            ok: true,
            msg: 'All notifications marked as seen'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error updating notifications. Please contact the administrator.'
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    const { id } = req.params;
    
    try {
        const notification = await Notification.findByIdAndDelete(id);
        
        if (!notification) {
            return res.status(404).json({
                ok: false,
                msg: 'Notification not found'
            });
        }
        
        res.status(200).json({
            ok: true,
            msg: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error deleting notification. Please contact the administrator.'
        });
    }
};

// Create a notification (for testing or manual creation)
export const createNotification = async (req, res) => {
    const { product, type, message } = req.body;
    
    try {
        // Verificar product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Product does not exist'
            });
        }
        
        // Verificar si ya existe una notificación similar utilizando la función auxiliar
        try {
            await checkDuplicateNotification(product, type);
        } catch (error) {
            return res.status(400).json({
                ok: false,
                msg: error.message
            });
        }
        
        const notification = new Notification({
            product,
            type,
            message
        });
        
        await notification.save();
        
        res.status(201).json({
            ok: true,
            notification
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error creating notification. Please contact the administrator.'
        });
    }
};

// Check for low stock notifications
export const checkLowStockNotifications = async (req, res) => {
    try {
        // Find products with stock below minStock
        const lowStockProducts = await Product.find({
            $expr: {
                $lt: ["$stock", "$minStock"]
            }
        });
        
        // Create notifications for each low stock product
        const notifications = [];
        
        for (const product of lowStockProducts) {
            try {
                // Usar la función auxiliar para verificar duplicados
                await checkDuplicateNotification(product._id, 'LOW_STOCK');
                
                const notification = new Notification({
                    product: product._id,
                    type: 'LOW_STOCK',
                    message: `Low stock alert: ${product.name} is below minimum stock level (Current: ${product.stock}, Minimum: ${product.minStock})`
                });
                
                await notification.save();
                notifications.push(notification);
            } catch (error) {
                // Si ya existe una notificación para este producto, continuamos con el siguiente
                console.log(`Skipping duplicate notification for product ${product.name}: ${error.message}`);
                continue;
            }
        }
        
        res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error checking for low stock notifications. Please contact the administrator.'
        });
    }
};

// Check for product expiration notifications
export const checkExpirationNotifications = async (req, res) => {
    try {
        const today = new Date();
        // Crear un nuevo objeto de fecha para la fecha límite en lugar de modificar today
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        // Find products that will expire in the next 30 days
        const expiringProducts = await Product.find({
            expirationDate: {
                $gte: today,
                $lte: thirtyDaysFromNow
            }
        });
        
        // Create notifications for expiring products
        const notifications = [];
        
        for (const product of expiringProducts) {
            // Format expiration date
            const expirationDate = new Date(product.expirationDate).toLocaleDateString();
            
            try {
                // Usar la función auxiliar para verificar duplicados
                await checkDuplicateNotification(product._id, 'EXPIRATION');
                
                const notification = new Notification({
                    product: product._id,
                    type: 'EXPIRATION',
                    message: `Expiration alert: ${product.name} will expire on ${expirationDate}`
                });
                
                await notification.save();
                notifications.push(notification);
            } catch (error) {
                // Si ya existe una notificación para este producto, continuamos con el siguiente
                console.log(`Skipping duplicate notification for product ${product.name}: ${error.message}`);
                continue;
            }
        }
        
        res.status(200).json({
            ok: true,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error checking for expiration notifications. Please contact the administrator.'
        });
    }
};