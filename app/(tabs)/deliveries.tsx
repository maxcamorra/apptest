import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { 
  Package, 
  MapPin,
  Clock,
  CheckCircle,
  Camera,
  Navigation,
  Phone,
  MessageCircle
} from 'lucide-react-native';

export default function DeliveriesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'completed'>('available');

  if (!user || user.role !== 'courier') {
    router.replace('/');
    return null;
  }

  // Mock data for courier deliveries
  const availableDeliveries = [
    {
      id: '1',
      pickup: { address: '123 Main St, Downtown', coordinates: { latitude: 40.7128, longitude: -74.0060 } },
      dropoff: { address: '456 Oak Ave, Uptown', coordinates: { latitude: 40.7589, longitude: -73.9851 } },
      package: { size: 'M', weight: 2.5, description: 'Electronics' },
      price: 15.50,
      distance: 3.2,
      estimatedTime: 25,
      createdAt: new Date(),
    },
    {
      id: '2',
      pickup: { address: '789 Pine St, Midtown', coordinates: { latitude: 40.7505, longitude: -73.9934 } },
      dropoff: { address: '321 Elm St, Brooklyn', coordinates: { latitude: 40.6782, longitude: -73.9442 } },
      package: { size: 'L', weight: 5.0, description: 'Clothing' },
      price: 22.00,
      distance: 5.8,
      estimatedTime: 40,
      createdAt: new Date(),
    },
  ];

  const assignedDeliveries = [
    {
      id: '3',
      pickup: { address: '555 Broadway, SoHo', coordinates: { latitude: 40.7233, longitude: -74.0030 } },
      dropoff: { address: '888 Park Ave, Upper East', coordinates: { latitude: 40.7736, longitude: -73.9566 } },
      package: { size: 'S', weight: 1.0, description: 'Documents' },
      price: 12.00,
      distance: 2.1,
      estimatedTime: 18,
      status: 'accepted',
      customer: { name: 'John Doe', phone: '+1234567890' },
      createdAt: new Date(),
    },
  ];

  const completedDeliveries = [
    {
      id: '4',
      pickup: { address: '999 Wall St, Financial', coordinates: { latitude: 40.7074, longitude: -74.0113 } },
      dropoff: { address: '111 Hudson St, Tribeca', coordinates: { latitude: 40.7195, longitude: -74.0089 } },
      package: { size: 'M', weight: 3.0, description: 'Food' },
      price: 18.50,
      distance: 1.5,
      estimatedTime: 12,
      status: 'delivered',
      completedAt: new Date(),
      rating: 5,
      createdAt: new Date(),
    },
  ];

  const handleAcceptDelivery = (deliveryId: string) => {
    Alert.alert(
      'Accept Delivery',
      'Are you sure you want to accept this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => console.log('Delivery accepted:', deliveryId) },
      ]
    );
  };

  const handleStartNavigation = (address: string) => {
    Alert.alert('Navigation', `Starting navigation to ${address}`);
  };

  const handleContactCustomer = (phone: string) => {
    Alert.alert('Contact Customer', `Calling ${phone}`);
  };

  const handleMarkPickedUp = (deliveryId: string) => {
    Alert.alert(
      'Mark as Picked Up',
      'Confirm that you have picked up the package',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log('Marked as picked up:', deliveryId) },
      ]
    );
  };

  const handleMarkDelivered = (deliveryId: string) => {
    Alert.alert(
      'Mark as Delivered',
      'Confirm delivery completion',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => router.push('/camera') },
        { text: 'Confirm', onPress: () => console.log('Marked as delivered:', deliveryId) },
      ]
    );
  };

  const AvailableTab = () => (
    <ScrollView style={styles.tabContent}>
      {availableDeliveries.map(delivery => (
        <View key={delivery.id} style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <View style={styles.packageInfo}>
              <Package size={20} color="#2563EB" />
              <Text style={styles.packageSize}>Size {delivery.package.size}</Text>
              <Text style={styles.packageWeight}>{delivery.package.weight}kg</Text>
            </View>
            <Text style={styles.deliveryPrice}>${delivery.price.toFixed(2)}</Text>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.routeAddress}>{delivery.pickup.address}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.routeAddress}>{delivery.dropoff.address}</Text>
            </View>
          </View>

          <View style={styles.deliveryDetails}>
            <View style={styles.detailItem}>
              <MapPin size={16} color="#64748b" />
              <Text style={styles.detailText}>{delivery.distance} km</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color="#64748b" />
              <Text style={styles.detailText}>{delivery.estimatedTime} min</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptDelivery(delivery.id)}
          >
            <Text style={styles.acceptButtonText}>Accept Delivery</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const AssignedTab = () => (
    <ScrollView style={styles.tabContent}>
      {assignedDeliveries.map(delivery => (
        <View key={delivery.id} style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ASSIGNED</Text>
            </View>
            <Text style={styles.deliveryPrice}>${delivery.price.toFixed(2)}</Text>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.routeAddress}>{delivery.pickup.address}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.routeAddress}>{delivery.dropoff.address}</Text>
            </View>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Customer: {delivery.customer?.name}</Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContactCustomer(delivery.customer?.phone || '')}
              >
                <Phone size={16} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <MessageCircle size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => handleStartNavigation(delivery.pickup.address)}
            >
              <Navigation size={16} color="#fff" />
              <Text style={styles.navigationButtonText}>Navigate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.pickupButton}
              onPress={() => handleMarkPickedUp(delivery.id)}
            >
              <CheckCircle size={16} color="#fff" />
              <Text style={styles.pickupButtonText}>Mark Picked Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.deliveredButton}
            onPress={() => handleMarkDelivered(delivery.id)}
          >
            <Camera size={16} color="#fff" />
            <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const CompletedTab = () => (
    <ScrollView style={styles.tabContent}>
      {completedDeliveries.map(delivery => (
        <View key={delivery.id} style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <View style={[styles.statusBadge, { backgroundColor: '#059669' }]}>
              <Text style={styles.statusText}>DELIVERED</Text>
            </View>
            <View style={styles.earningsInfo}>
              <Text style={styles.deliveryPrice}>${delivery.price.toFixed(2)}</Text>
              {delivery.rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>★ {delivery.rating}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.routeAddress}>{delivery.pickup.address}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.routeAddress}>{delivery.dropoff.address}</Text>
            </View>
          </View>

          <Text style={styles.completedDate}>
            Completed: {delivery.completedAt?.toLocaleDateString()} • {delivery.completedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deliveries</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available ({availableDeliveries.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
          onPress={() => setActiveTab('assigned')}
        >
          <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>
            Assigned ({assignedDeliveries.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedDeliveries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'available' && <AvailableTab />}
      {activeTab === 'assigned' && <AssignedTab />}
      {activeTab === 'completed' && <CompletedTab />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563EB',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  packageSize: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  packageWeight: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  deliveryPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  statusBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  routeInfo: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeAddress: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  routeLine: {
    width: 1,
    height: 16,
    backgroundColor: '#cbd5e1',
    marginLeft: 4,
    marginBottom: 8,
  },
  deliveryDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  acceptButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  pickupButton: {
    flex: 1,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  pickupButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  deliveredButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deliveredButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  earningsInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingContainer: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  completedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 8,
  },
});