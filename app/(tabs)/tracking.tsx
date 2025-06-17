import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { 
  MapPin, 
  Navigation,
  Phone,
  MessageCircle,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react-native';

export default function TrackingScreen() {
  const { user } = useAuth();
  const { activeOrder } = useOrders();
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // Web fallback - show mock location
      setLocationPermission(true);
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } else {
        Alert.alert('Permission Required', 'Location permission is required for tracking');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  if (!user) {
    router.replace('/auth');
    return null;
  }

  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <MapPin size={48} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>No Active Order</Text>
          <Text style={styles.emptyStateText}>
            {user.role === 'customer' 
              ? 'Create an order to start tracking' 
              : 'Accept a delivery to start tracking'}
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(user.role === 'customer' ? '/create-order' : '/deliveries')}
          >
            <Text style={styles.actionButtonText}>
              {user.role === 'customer' ? 'Create Order' : 'Find Deliveries'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getTrackingSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package, completed: true },
      { key: 'searching_courier', label: 'Finding Courier', icon: Clock, completed: activeOrder.status !== 'pending' },
      { key: 'accepted', label: 'Courier Assigned', icon: CheckCircle, completed: ['accepted', 'picked_up', 'in_transit', 'delivered'].includes(activeOrder.status) },
      { key: 'picked_up', label: 'Package Picked Up', icon: Package, completed: ['picked_up', 'in_transit', 'delivered'].includes(activeOrder.status) },
      { key: 'in_transit', label: 'In Transit', icon: Navigation, completed: ['in_transit', 'delivered'].includes(activeOrder.status) },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle, completed: activeOrder.status === 'delivered' },
    ];
    return steps;
  };

  const mockMap = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <MapPin size={32} color="#2563EB" />
        <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Live tracking will be available here
        </Text>
      </View>
      
      {/* Route indicators */}
      <View style={styles.routeIndicators}>
        <View style={[styles.locationPin, styles.pickupPin]}>
          <Text style={styles.pinText}>A</Text>
        </View>
        <View style={[styles.locationPin, styles.dropoffPin]}>
          <Text style={styles.pinText}>B</Text>
        </View>
        {user.role === 'customer' && activeOrder.courierId && (
          <View style={[styles.locationPin, styles.courierPin]}>
            <Navigation size={16} color="#fff" />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Tracking</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeOrder.status) }]}>
          <Text style={styles.statusText}>{activeOrder.status.replace('_', ' ')}</Text>
        </View>
      </View>

      {mockMap()}

      <View style={styles.orderDetails}>
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#059669' }]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>{activeOrder.pickup.address}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Dropoff</Text>
              <Text style={styles.routeAddress}>{activeOrder.dropoff.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{activeOrder.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Est. Time</Text>
            <Text style={styles.infoValue}>{activeOrder.estimatedTime} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>${activeOrder.price.toFixed(2)}</Text>
          </View>
        </View>

        {user.role === 'customer' && activeOrder.courierId && (
          <View style={styles.courierInfo}>
            <Text style={styles.courierTitle}>Your Courier</Text>
            <View style={styles.courierDetails}>
              <View style={styles.courierAvatar}>
                <Text style={styles.courierInitial}>C</Text>
              </View>
              <View style={styles.courierText}>
                <Text style={styles.courierName}>Courier Name</Text>
                <Text style={styles.courierRating}>★ 4.9 • 250+ deliveries</Text>
              </View>
              <View style={styles.courierActions}>
                <TouchableOpacity style={styles.contactButton}>
                  <Phone size={16} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                  <MessageCircle size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.trackingProgress}>
          <Text style={styles.progressTitle}>Order Progress</Text>
          {getTrackingSteps().map((step, index) => (
            <View key={step.key} style={styles.progressStep}>
              <View style={[
                styles.progressIcon,
                step.completed && styles.progressIconCompleted
              ]}>
                <step.icon 
                  size={16} 
                  color={step.completed ? '#fff' : '#64748b'} 
                />
              </View>
              <Text style={[
                styles.progressLabel,
                step.completed && styles.progressLabelCompleted
              ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  routeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  locationPin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupPin: {
    backgroundColor: '#059669',
    top: 60,
    left: 60,
  },
  dropoffPin: {
    backgroundColor: '#dc2626',
    bottom: 60,
    right: 60,
  },
  courierPin: {
    backgroundColor: '#2563EB',
    top: 120,
    left: 120,
  },
  pinText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  orderDetails: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
  },
  routeInfo: {
    marginBottom: 24,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  routeAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#cbd5e1',
    marginLeft: 5,
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  courierInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  courierTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  courierDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierInitial: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  courierText: {
    flex: 1,
  },
  courierName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  courierRating: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  courierActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trackingProgress: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 16,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIconCompleted: {
    backgroundColor: '#059669',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  progressLabelCompleted: {
    color: '#1e293b',
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});