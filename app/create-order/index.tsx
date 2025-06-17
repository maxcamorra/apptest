import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Order, PackageSize } from '@/types';
import { 
  MapPin, 
  Package, 
  CreditCard, 
  ArrowLeft,
  Navigation,
  Plus,
  Minus
} from 'lucide-react-native';

export default function CreateOrderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [dropoffInstructions, setDropoffInstructions] = useState('');
  const [packageSize, setPackageSize] = useState<PackageSize>('M');
  const [packageWeight, setPackageWeight] = useState(2.0);
  const [packageDescription, setPackageDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  if (!user || user.role !== 'customer') {
    router.replace('/');
    return null;
  }

  const packageSizes: { size: PackageSize; label: string; description: string; price: number }[] = [
    { size: 'S', label: 'Small', description: 'Up to 2kg', price: 8.00 },
    { size: 'M', label: 'Medium', description: 'Up to 5kg', price: 12.00 },
    { size: 'L', label: 'Large', description: 'Up to 10kg', price: 18.00 },
    { size: 'XL', label: 'Extra Large', description: 'Up to 20kg', price: 25.00 },
  ];

  const calculatePrice = () => {
    const basePrice = packageSizes.find(p => p.size === packageSize)?.price || 12.00;
    const distance = 3.5; // Mock distance
    const distancePrice = distance * 2.50;
    return basePrice + distancePrice;
  };

  const handleCreateOrder = () => {
    if (!pickupAddress || !dropoffAddress) {
      Alert.alert('Error', 'Please enter both pickup and dropoff addresses');
      return;
    }

    if (!packageDescription) {
      Alert.alert('Error', 'Please describe your package');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      customerId: user.id,
      pickup: {
        address: pickupAddress,
        coordinates: { latitude: 40.7128, longitude: -74.0060 }, // Mock coordinates
        instructions: pickupInstructions,
      },
      dropoff: {
        address: dropoffAddress,
        coordinates: { latitude: 40.7589, longitude: -73.9851 }, // Mock coordinates
        instructions: dropoffInstructions,
      },
      package: {
        size: packageSize,
        weight: packageWeight,
        description: packageDescription,
      },
      status: 'pending',
      price: calculatePrice(),
      distance: 3.5, // Mock distance
      estimatedTime: 25, // Mock time
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createOrder(newOrder);
    
    Alert.alert(
      'Order Created',
      'Your order has been created successfully! We\'re finding a courier for you.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/tracking') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Order</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup & Delivery</Text>
          
          <View style={styles.addressContainer}>
            <View style={styles.addressInputContainer}>
              <View style={styles.addressIcon}>
                <View style={[styles.addressDot, { backgroundColor: '#059669' }]} />
              </View>
              <View style={styles.addressInput}>
                <Text style={styles.addressLabel}>Pickup Address</Text>
                <TextInput
                  style={styles.input}
                  value={pickupAddress}
                  onChangeText={setPickupAddress}
                  placeholder="Enter pickup address"
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.mapButton}>
                <Navigation size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.addressLine} />
            
            <View style={styles.addressInputContainer}>
              <View style={styles.addressIcon}>
                <View style={[styles.addressDot, { backgroundColor: '#dc2626' }]} />
              </View>
              <View style={styles.addressInput}>
                <Text style={styles.addressLabel}>Dropoff Address</Text>
                <TextInput
                  style={styles.input}
                  value={dropoffAddress}
                  onChangeText={setDropoffAddress}
                  placeholder="Enter dropoff address"
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.mapButton}>
                <Navigation size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.instructionsContainer}>
            <TextInput
              style={styles.textArea}
              value={pickupInstructions}
              onChangeText={setPickupInstructions}
              placeholder="Pickup instructions (optional)"
              multiline
              numberOfLines={2}
            />
            <TextInput
              style={styles.textArea}
              value={dropoffInstructions}
              onChangeText={setDropoffInstructions}
              placeholder="Dropoff instructions (optional)"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          
          <View style={styles.packageSizeContainer}>
            <Text style={styles.fieldLabel}>Package Size</Text>
            <View style={styles.sizeOptions}>
              {packageSizes.map(size => (
                <TouchableOpacity
                  key={size.size}
                  style={[
                    styles.sizeOption,
                    packageSize === size.size && styles.sizeOptionActive
                  ]}
                  onPress={() => setPackageSize(size.size)}
                >
                  <Text style={[
                    styles.sizeOptionLabel,
                    packageSize === size.size && styles.sizeOptionLabelActive
                  ]}>
                    {size.size}
                  </Text>
                  <Text style={[
                    styles.sizeOptionText,
                    packageSize === size.size && styles.sizeOptionTextActive
                  ]}>
                    {size.label}
                  </Text>
                  <Text style={[
                    styles.sizeOptionDescription,
                    packageSize === size.size && styles.sizeOptionDescriptionActive
                  ]}>
                    {size.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.weightContainer}>
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            <View style={styles.weightControls}>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => setPackageWeight(Math.max(0.1, packageWeight - 0.1))}
              >
                <Minus size={16} color="#64748b" />
              </TouchableOpacity>
              <Text style={styles.weightValue}>{packageWeight.toFixed(1)} kg</Text>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => setPackageWeight(packageWeight + 0.1)}
              >
                <Plus size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.fieldLabel}>Package Description</Text>
            <TextInput
              style={styles.textArea}
              value={packageDescription}
              onChangeText={setPackageDescription}
              placeholder="Describe what you're sending"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'card' && styles.paymentMethodActive
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <CreditCard size={20} color={paymentMethod === 'card' ? '#2563EB' : '#64748b'} />
              <Text style={[
                styles.paymentMethodText,
                paymentMethod === 'card' && styles.paymentMethodTextActive
              ]}>
                Credit Card
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                paymentMethod === 'paypal' && styles.paymentMethodActive
              ]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Package size={20} color={paymentMethod === 'paypal' ? '#2563EB' : '#64748b'} />
              <Text style={[
                styles.paymentMethodText,
                paymentMethod === 'paypal' && styles.paymentMethodTextActive
              ]}>
                PayPal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.priceBreakdown}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Package Size ({packageSize})</Text>
            <Text style={styles.priceValue}>
              ${packageSizes.find(p => p.size === packageSize)?.price.toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Distance (3.5 km)</Text>
            <Text style={styles.priceValue}>$8.75</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>$2.00</Text>
          </View>
          <View style={[styles.priceItem, styles.totalPrice]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculatePrice().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateOrder}>
          <Text style={styles.createButtonText}>Create Order - ${calculatePrice().toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 16,
  },
  addressContainer: {
    marginBottom: 16,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressIcon: {
    width: 24,
    alignItems: 'center',
    paddingTop: 32,
  },
  addressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addressLine: {
    width: 2,
    height: 20,
    backgroundColor: '#cbd5e1',
    marginLeft: 6,
    marginVertical: 8,
  },
  addressInput: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fff',
    minHeight: 48,
  },
  mapButton: {
    backgroundColor: '#f1f5f9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  instructionsContainer: {
    gap: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  packageSizeContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  sizeOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#eff6ff',
  },
  sizeOptionLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#64748b',
  },
  sizeOptionLabelActive: {
    color: '#2563EB',
  },
  sizeOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  sizeOptionTextActive: {
    color: '#2563EB',
  },
  sizeOptionDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  sizeOptionDescriptionActive: {
    color: '#64748b',
  },
  weightContainer: {
    marginBottom: 20,
  },
  weightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  weightButton: {
    backgroundColor: '#f1f5f9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    minWidth: 80,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  paymentMethodActive: {
    borderColor: '#2563EB',
    backgroundColor: '#eff6ff',
  },
  paymentMethodText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  paymentMethodTextActive: {
    color: '#2563EB',
  },
  priceBreakdown: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  totalPrice: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  createButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});