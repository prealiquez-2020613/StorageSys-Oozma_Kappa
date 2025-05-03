import { Router } from 'express'
import { check } from 'express-validator'
import { adminValidation, validateJwt } from '../../middlewares/validate.jwt.js'
import { notificationValidator } from '../../helpers/validators.js'
import {
    getAllNotifications,
    getNotificationsByProduct,
    getUnseenNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen,
    deleteNotification,
    createNotification,
    checkLowStockNotifications,
    checkExpirationNotifications
  } from './notification.controller.js'
  
const router = Router()

// Obtener todas las notificaciones
router.get('/', [validateJwt], getAllNotifications)
// Obtener notificaciones por producto
router.get('/product/:productId', [validateJwt, check('productId', 'The product ID is not valid').isMongoId(),], getNotificationsByProduct)
// Obtener notificaciones no vistas
router.get('/unseen', [validateJwt], getUnseenNotifications)
// Marcar notificación como vista
router.put('/seen/:id', [validateJwt, check('id', 'ID is not valid').isMongoId()], markNotificationAsSeen)
// Marcar todas las notificaciones como vistas
router.put('/seen', [validateJwt], markAllNotificationsAsSeen)
// Eliminar notificación
router.delete('/:id', [validateJwt, adminValidation, check('id', 'ID is not valid').isMongoId()], deleteNotification)
// Crear notificación
router.post('/create', [validateJwt, adminValidation, notificationValidator], createNotification)
// Verificar notificaciones de bajo stock
router.post('/check-low-stock', [validateJwt], checkLowStockNotifications)
// Verificar notificaciones de expiración
router.post('/check-expiration', [validateJwt], checkExpirationNotifications)

export default router