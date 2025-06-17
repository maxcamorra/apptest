import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useRouter } from 'expo-router';
import { 
  Package, 
  Plus, 
  Truck, 
  Clock, 
  CheckCircle, 
  Star,
  ToggleLeft,
  ToggleRight 
} from 'lucide-react-native';

export default function HomeScreen() {
  const { user, switchRole } = useAuth();
  const { orders, activeOrder } = useOrders();
  const router = useRouter();
  const [courierAvailable, setCourierAvailable] = useState(true);

  if (!user) {
    router.replace('/auth');
    return null;
  }

  const CustomerHome = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name}!</Text>
          <Text style={styles.subGreeting}>Where would you like to send a package?</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <Text style={styles.rating}>{user.rating}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.createOrderButton}
        onPress={() => router.push('/create-order')}
      >
        <Plus size={24} color="#fff" />
        <Text style={styles.createOrderText}>Create New Order</Text>
      </TouchableOpacity>

      {activeOrder && (
        <View style={styles.activeOrderCard}>
          <View style={styles.activeOrderHeader}>
            <Text style={styles.activeOrderTitle}>Active Order</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeOrder.status) }]}>
              <Text style={styles.statusText}>{activeOrder.status.replace('_', ' ')}</Text>
            </View>
          </View>
          <Text style={styles.activeOrderRoute}>
            {activeOrder.pickup.address} → {activeOrder.dropoff.address}
          </Text>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => router.push('/tracking')}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Package size={24} color="#2563EB" />
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={24} color="#059669" />
          <Text style={styles.statNumber}>{orders.filter(o => o.status === 'delivered').length}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#ea580c" />
          <Text style={styles.statNumber}>{orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      <View style={styles.recentOrders}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.slice(0, 3).map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderRoute}>
                {order.pickup.address} → {order.dropoff.address}
              </Text>
              <Text style={styles.orderDate}>
                {order.createdAt.toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{order.status.replace('_', ' ')}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const CourierHome = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name}!</Text>
          <Text style={styles.subGreeting}>Ready to deliver packages?</Text>
        </View>
        <View style={styles.availabilityToggle}>
          <TouchableOpacity onPress={() => setCourierAvailable(!courierAvailable)}>
            {courierAvailable ? (
              <ToggleRight size={32} color="#059669" />
            ) : (
              <ToggleLeft size={32} color="#64748b" />
            )}
          </TouchableOpacity>
          <Text style={[styles.availabilityText, { color: courierAvailable ? '#059669' : '#64748b' }]}>
            {courierAvailable ? 'Available' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Truck size={24} color="#2563EB" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Today's Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#fbbf24" />
          <Text style={styles.statNumber}>{user.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$245</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
      </View>

      <View style={styles.availableOrders}>
        <Text style={styles.sectionTitle}>Available Orders</Text>
        {/* Mock available orders */}
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.availableOrderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderRoute}>
                Downtown → Uptown
              </Text>
              <Text style={styles.orderDetails}>
                Package Size: M • Distance: 2.5 km
              </Text>
            </View>
            <View style={styles.orderActions}>
              <Text style={styles.orderPrice}>$12.50</Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ea580c';
      case 'searching_courier': return '#eab308';
      case 'accepted': return '#2563EB';
      case 'picked_up': return '#7c3aed';
      case 'in_transit': return '#0891b2';
      case 'delivered': return '#059669';
      case 'cancelled': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.roleSwitch}>
        <TouchableOpacity
          style={[styles.roleSwitchButton, user.role === 'customer' && styles.roleSwitchActive]}
          onPress={() => switchRole('customer')}
        >
          <Text style={[styles.roleSwitchText, user.role === 'customer' && styles.roleSwitchTextActive]}>
            Customer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleSwitchButton, user.role === 'courier' && styles.roleSwitchActive]}
          onPress={() => switchRole('courier')}
        >
          <Text style={[styles.roleSwitchText, user.role === 'courier' && styles.roleSwitchTextActive]}>
            Courier
          </Text>
        </TouchableOpacity>
      </View>
      
      {user.role === 'customer' ? <CustomerHome /> : <CourierHome />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    margin: 16,
    padding: 4,
  },
  roleSwitchButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  roleSwitchActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  roleSwitchText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  roleSwitchTextActive: {
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  availabilityToggle: {
    alignItems: 'center',
    gap: 4,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  createOrderButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  createOrderText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  activeOrderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeOrderTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  activeOrderRoute: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 16,
  },
  recentOrders: {
    marginBottom: 24,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderRoute: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  availableOrders: {
    marginBottom: 24,
  },
  availableOrderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  orderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  acceptButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});