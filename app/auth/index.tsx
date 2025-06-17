import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types';
import { User as UserIcon, Truck, Shield } from 'lucide-react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [vehicleType, setVehicleType] = useState<'bike' | 'car' | 'foot'>('bike');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleAuth = () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Mock authentication
    const user: User = {
      id: Date.now().toString(),
      role: selectedRole,
      name: isLogin ? 'Demo User' : name,
      phone: phone || '+1234567890',
      email,
      rating: 4.8,
      vehicleType: selectedRole === 'courier' ? vehicleType : undefined,
      active: true,
    };

    login(user);
    router.replace('/(tabs)');
  };

  const RoleSelector = () => (
    <View style={styles.roleContainer}>
      <Text style={styles.roleTitle}>Select Role</Text>
      <View style={styles.roleButtons}>
        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'customer' && styles.roleButtonActive]}
          onPress={() => setSelectedRole('customer')}
        >
          <UserIcon size={24} color={selectedRole === 'customer' ? '#fff' : '#2563EB'} />
          <Text style={[styles.roleButtonText, selectedRole === 'customer' && styles.roleButtonTextActive]}>
            Customer
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'courier' && styles.roleButtonActive]}
          onPress={() => setSelectedRole('courier')}
        >
          <Truck size={24} color={selectedRole === 'courier' ? '#fff' : '#2563EB'} />
          <Text style={[styles.roleButtonText, selectedRole === 'courier' && styles.roleButtonTextActive]}>
            Courier
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'admin' && styles.roleButtonActive]}
          onPress={() => setSelectedRole('admin')}
        >
          <Shield size={24} color={selectedRole === 'admin' ? '#fff' : '#2563EB'} />
          <Text style={[styles.roleButtonText, selectedRole === 'admin' && styles.roleButtonTextActive]}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const VehicleSelector = () => (
    <View style={styles.vehicleContainer}>
      <Text style={styles.vehicleTitle}>Vehicle Type</Text>
      <View style={styles.vehicleButtons}>
        {['bike', 'car', 'foot'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.vehicleButton, vehicleType === type && styles.vehicleButtonActive]}
            onPress={() => setVehicleType(type as 'bike' | 'car' | 'foot')}
          >
            <Text style={[styles.vehicleButtonText, vehicleType === type && styles.vehicleButtonTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>QuickCourier</Text>
          <Text style={styles.subtitle}>Professional Delivery Service</Text>
        </View>

        <View style={styles.form}>
          <RoleSelector />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && selectedRole === 'courier' && <VehicleSelector />}

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  vehicleContainer: {
    marginBottom: 24,
  },
  vehicleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 12,
  },
  vehicleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  vehicleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  vehicleButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  vehicleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  vehicleButtonTextActive: {
    color: '#fff',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fff',
  },
  authButton: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});