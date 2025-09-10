import { Notification } from '../models/index.js'
import { io } from '../index.js'

export interface NotificationData {
  type: 'order_update' | 'account_security' | 'cart_wishlist' | 'offers_promotions' | 'order' | 'new-customer' | 'low-stock' | 'product-updated' | 'payment-received' | 'inventory-alert'
  title: string
  message: string
  admin_id?: number | null
  user_id?: number | null
  priority?: 'low' | 'medium' | 'high'
  metadata?: object
  order_id?: number | null
  product_id?: number | null
}

export class NotificationService {
  static async createNotification(data: NotificationData): Promise<Notification> {
    const notification = await Notification.create({
      title: data.title,
      message: data.message,
      type: data.type,
      admin_id: data.admin_id || null,
      user_id: data.user_id || null,
      priority: data.priority || 'medium',
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      order_id: data.order_id || null,
      product_id: data.product_id || null,
      is_read: false
    })

    // Emit real-time notification
    const notificationData = {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      admin_id: notification.admin_id,
      created_at: notification.created_at,
      metadata: notification.metadata ? JSON.parse(notification.metadata) : null
    }

    // Send to specific admin or broadcast to all admins
    if (data.admin_id) {
      io.to(`admin_${data.admin_id}`).emit('notification', notificationData)
    } else {
      io.emit('notification', notificationData)
    }

    return notification
  }

  static async getAdminNotifications(adminId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit
    
    const notifications = await Notification.findAndCountAll({
      where: { 
        admin_id: adminId 
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    })

    return {
      notifications: notifications.rows,
      total: notifications.count,
      page,
      totalPages: Math.ceil(notifications.count / limit),
      hasMore: offset + limit < notifications.count
    }
  }

  static async markAsRead(notificationId: number, adminId: number): Promise<boolean> {
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { 
        where: { 
          id: notificationId, 
          admin_id: adminId 
        } 
      }
    )
    return updatedCount > 0
  }

  static async markAllAsRead(adminId: number): Promise<number> {
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { 
        where: { 
          admin_id: adminId,
          is_read: false 
        } 
      }
    )
    return updatedCount
  }

  static async getUnreadCount(adminId: number): Promise<number> {
    return await Notification.count({
      where: {
        admin_id: adminId,
        is_read: false
      }
    })
  }

  static async deleteNotification(notificationId: number, adminId: number): Promise<boolean> {
    const deletedCount = await Notification.destroy({
      where: {
        id: notificationId,
        admin_id: adminId
      }
    })
    return deletedCount > 0
  }

  // Specific notification creators
  static async createOrderNotification(orderId: number, adminId: number, customerName: string, totalAmount: number) {
    return await this.createNotification({
      type: 'order',
      message: `New order #${orderId} from ${customerName} - $${totalAmount.toFixed(2)}`,
      admin_id: adminId,
      priority: 'high',
      metadata: {
        orderId,
        customerName,
        totalAmount,
        action: 'view_order'
      }
    })
  }

  static async createLowStockNotification(productId: number, productName: string, currentStock: number, adminId: number) {
    return await this.createNotification({
      type: 'low-stock',
      message: `Low stock alert: ${productName} has only ${currentStock} items left`,
      admin_id: adminId,
      priority: currentStock === 0 ? 'high' : 'medium',
      metadata: {
        productId,
        productName,
        currentStock,
        action: 'update_inventory'
      }
    })
  }

  static async createNewCustomerNotification(customerId: number, customerName: string, customerEmail: string, adminId: number) {
    return await this.createNotification({
      type: 'new-customer',
      title: 'New Customer',
      message: `New customer: ${customerName} (${customerEmail}) made their first purchase`,
      admin_id: adminId,
      priority: 'low',
      metadata: {
        customerId,
        customerName,
        customerEmail,
        action: 'view_customer'
      }
    })
  }

  // User notification methods
  static async getUserNotifications(userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit
    
    const notifications = await Notification.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    })

    return {
      notifications: notifications.rows,
      total: notifications.count,
      page,
      totalPages: Math.ceil(notifications.count / limit)
    }
  }

  static async getUserUnreadCount(userId: number): Promise<number> {
    return await Notification.count({
      where: { 
        user_id: userId,
        is_read: false 
      }
    })
  }

  // Create user notifications
  static async createOrderUpdateNotification(userId: number, orderId: number, status: string, priority: 'high' | 'medium' | 'low' = 'high') {
    const statusMessages = {
      'pending': 'Your order has been placed successfully and is being processed',
      'processing': 'Your order is being prepared for shipment',
      'shipped': 'Your order has been shipped and is on its way',
      'delivered': 'Your order has been delivered successfully',
      'cancelled': 'Your order has been cancelled',
      'refunded': 'Your refund has been processed'
    }

    return await this.createNotification({
      type: 'order_update',
      title: 'Order Update',
      message: statusMessages[status as keyof typeof statusMessages] || `Your order status has been updated to ${status}`,
      user_id: userId,
      order_id: orderId,
      priority,
      metadata: { status, action: 'view_order' }
    })
  }

  static async createAccountSecurityNotification(userId: number, type: 'login' | 'password_change' | 'profile_update', metadata?: any) {
    const messages = {
      'login': 'You logged in from a new device or location',
      'password_change': 'Your password has been changed successfully',
      'profile_update': 'Your profile has been updated'
    }

    return await this.createNotification({
      type: 'account_security',
      title: 'Account Security',
      message: messages[type],
      user_id: userId,
      priority: 'medium',
      metadata: { type, ...metadata }
    })
  }

  static async createCartWishlistNotification(userId: number, type: 'back_in_stock' | 'price_drop' | 'cart_reminder', productId: number, metadata?: any) {
    const messages = {
      'back_in_stock': 'An item from your wishlist is back in stock',
      'price_drop': 'Price dropped for an item in your wishlist',
      'cart_reminder': 'You have items in your cart waiting for checkout'
    }

    return await this.createNotification({
      type: 'cart_wishlist',
      title: 'Cart & Wishlist',
      message: messages[type],
      user_id: userId,
      product_id: productId,
      priority: 'low',
      metadata: { type, ...metadata }
    })
  }

  static async createOffersPromotionsNotification(userId: number, type: 'personalized_discount' | 'flash_sale' | 'seasonal_offer', metadata?: any) {
    const messages = {
      'personalized_discount': 'You have a personalized discount available',
      'flash_sale': 'Flash sale alert! Limited time offer',
      'seasonal_offer': 'Special seasonal offer just for you'
    }

    return await this.createNotification({
      type: 'offers_promotions',
      title: 'Offers & Promotions',
      message: messages[type],
      user_id: userId,
      priority: 'low',
      metadata: { type, ...metadata }
    })
  }

  static async deleteNotification(notificationId: number, userId: number, userRole: string): Promise<boolean> {
    const whereClause: any = { id: notificationId }
    
    if (userRole === 'admin') {
      whereClause.admin_id = userId
    } else {
      whereClause.user_id = userId
    }

    const deletedCount = await Notification.destroy({ where: whereClause })
    return deletedCount > 0
  }
}

