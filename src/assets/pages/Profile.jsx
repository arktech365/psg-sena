import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import Swal from 'sweetalert2';
import { 
  FaRegUser, 
  FaShieldHalved, 
  FaMapLocationDot, 
  FaCamera, 
  FaLaptopCode, 
  FaRegTrashCan, 
  FaPen, 
  FaCheck, 
  FaPlus 
} from 'react-icons/fa6';

const Profile = () => {
  const { currentUser, userRole, refreshUserData } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    profileImage: ''
  });
  
  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    id: Date.now(),
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  });
  
  // Editing address state
  const [editingAddress, setEditingAddress] = useState(null);
  const [editAddressData, setEditAddressData] = useState({
    id: null,
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  
  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfileData({
            displayName: userData.displayName || currentUser.displayName || '',
            email: currentUser.email,
            phone: userData.phone || '',
            profileImage: userData.profileImage || currentUser.photoURL || ''
          });
          
          setAddresses(userData.addresses || []);
        } else {
          // If no profile exists, initialize with basic data from Firebase user
          setProfileData({
            displayName: currentUser.displayName || '',
            email: currentUser.email,
            phone: '',
            profileImage: currentUser.photoURL || ''
          });
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar el perfil',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#000'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [currentUser, navigate]);
  
  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle security input changes
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle address input changes for new address
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle address input changes for editing address
  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;
    setEditAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Archivo muy grande',
          text: 'La imagen debe ser menor a 2MB',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#000'
        });
        return;
      }
      
      if (!file.type.match('image.*')) {
        Swal.fire({
          title: 'Tipo de archivo inválido',
          text: 'Por favor selecciona una imagen',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#000'
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Save profile data
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userDataToSave = {
        ...profileData,
        updatedAt: new Date()
      };
      
      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data();
        if (existingData.hasOwnProperty('role')) userDataToSave.role = existingData.role;
        if (existingData.hasOwnProperty('createdAt')) userDataToSave.createdAt = existingData.createdAt;
        if (existingData.hasOwnProperty('addresses')) userDataToSave.addresses = existingData.addresses;
      } else {
        userDataToSave.role = 'customer';
        userDataToSave.createdAt = new Date();
        userDataToSave.addresses = [];
      }
      
      await setDoc(userDocRef, userDataToSave);
      
      console.log('Profile saved, refreshing user data');
      refreshUserData();
      
      Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tu perfil se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al guardar el perfil: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecuritySaving(true);
    
    if (securityData.newPassword !== securityData.confirmNewPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas nuevas no coinciden',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      setSecuritySaving(false);
      return;
    }
    
    if (securityData.newPassword.length < 6) {
      Swal.fire({
        title: 'Error',
        text: 'La nueva contraseña debe tener al menos 6 caracteres',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      setSecuritySaving(false);
      return;
    }
    
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        securityData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, securityData.newPassword);
      
      Swal.fire({
        title: 'Contraseña actualizada',
        text: 'Tu contraseña se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Error al cambiar la contraseña';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'La contraseña actual es incorrecta';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Por favor, inténtalo más tarde';
          break;
        default:
          errorMessage = 'Error al cambiar la contraseña: ' + error.message;
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    } finally {
      setSecuritySaving(false);
    }
  };
  
  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos de la dirección',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      setAddressSaving(false);
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const newAddressWithId = { ...newAddress, id: Date.now() };
      
      if (addresses.length === 0 || newAddress.isDefault) {
        newAddressWithId.isDefault = true;
        const updatedAddresses = addresses.map(addr => ({ ...addr, isDefault: false }));
        setAddresses([...updatedAddresses, newAddressWithId]);
      } else {
        setAddresses([...addresses, newAddressWithId]);
      }
      
      await updateDoc(userDocRef, {
        addresses: arrayUnion(newAddressWithId)
      });
      
      Swal.fire({
        title: 'Dirección agregada',
        text: 'La dirección se ha agregado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      
      setNewAddress({
        id: Date.now(),
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Colombia'
      });
    } catch (error) {
      console.error('Error adding address:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al agregar la dirección: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    } finally {
      setAddressSaving(false);
    }
  };
  
  const startEditingAddress = (address) => {
    setEditingAddress(address.id);
    setEditAddressData({...address});
  };
  
  const cancelEditingAddress = () => {
    setEditingAddress(null);
    setEditAddressData({
      id: null,
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Colombia'
    });
  };
  
  const saveEditedAddress = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    
    if (!editAddressData.name || !editAddressData.street || !editAddressData.city || !editAddressData.state || !editAddressData.zipCode) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos de la dirección',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      setAddressSaving(false);
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const addressToRemove = addresses.find(addr => addr.id === editAddressData.id);
      if (addressToRemove) {
        await updateDoc(userDocRef, {
          addresses: arrayRemove(addressToRemove)
        });
      }
      
      const updatedAddressWithId = { ...editAddressData };
      await updateDoc(userDocRef, {
        addresses: arrayUnion(updatedAddressWithId)
      });
      
      setAddresses(addresses.map(addr => addr.id === editAddressData.id ? updatedAddressWithId : addr));
      
      Swal.fire({
        title: 'Dirección actualizada',
        text: 'La dirección se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
      
      setEditingAddress(null);
      setEditAddressData({
        id: null,
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Colombia'
      });
    } catch (error) {
      console.error('Error updating address:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al actualizar la dirección: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    } finally {
      setAddressSaving(false);
    }
  };
  
  const handleDeleteAddress = async (addressId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const addressToDelete = addresses.find(addr => addr.id === addressId);
          
          if (addressToDelete) {
            await updateDoc(userDocRef, { addresses: arrayRemove(addressToDelete) });
            setAddresses(addresses.filter(addr => addr.id !== addressId));
            
            Swal.fire({
              title: 'Eliminada',
              text: 'La dirección fue eliminada',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#000'
            });
          }
        } catch (error) {
          console.error('Error deleting address:', error);
          Swal.fire({
            title: 'Error',
            text: 'Error al eliminar la dirección: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#000'
          });
        }
      }
    });
  };
  
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      setAddresses(updatedAddresses);
      await updateDoc(userDocRef, { addresses: updatedAddresses });
      
      Swal.fire({
        title: 'Actualizado',
        text: 'La dirección se estableció como predeterminada',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000',
        timer: 1500
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al establecer: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#000'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#fdfdfd]">
        <div className="w-8 h-8 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#fdfdfd] pb-24 font-inter text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Compacto */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-5 py-8 mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Administra tu información personal y direcciones de envío.</p>
        </div>
      </div>

      <div className="px-5 mx-auto max-w-5xl mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <FaRegUser size={16} />
                Perfil Personal
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <FaShieldHalved size={16} />
                Seguridad
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'addresses'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <FaMapLocationDot size={16} />
                Mis Direcciones
              </button>
            </nav>
          </aside>
          
          {/* Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* ── Perfil Tab ── */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-black mb-6">Información Personal</h2>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    {/* Img Upload */}
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        {profileData.profileImage ? (
                          <img 
                            src={profileData.profileImage} 
                            alt="Profile" 
                            className="object-cover w-20 h-20 rounded-full bg-gray-100 border border-gray-200"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full border border-gray-200">
                            <span className="text-2xl font-bold text-gray-500">
                              {profileData.displayName?.charAt(0).toUpperCase() || profileData.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <FaCamera size={18} />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-black">Foto de Perfil</h3>
                        <p className="text-xs text-gray-500 mt-0.5">JPG, GIF o PNG. Max 2MB.</p>
                      </div>
                    </div>
                    
                    {/* Inputs */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="displayName" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={profileData.displayName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 text-gray-500 border-none rounded-xl cursor-not-allowed sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Rol Actual
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={userRole === 'admin' ? 'Administrador' : 'Cliente'}
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 text-gray-500 border-none rounded-xl cursor-not-allowed sm:text-sm capitalize"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
                      >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* ── Seguridad Tab ── */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-black mb-6">Cambiar Contraseña</h2>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full md:w-1/2 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmNewPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Repetir Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          id="confirmNewPassword"
                          value={securityData.confirmNewPassword}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={securitySaving}
                        className="px-6 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
                      >
                        {securitySaving ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-black mb-6">Dispositivos Activos</h2>
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black border border-gray-200">
                      <FaLaptopCode size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black">Este dispositivo</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Última actividad: Ahora mismo</p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-700 rounded-lg">
                      Activo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    Asegúrate de cambiar tu contraseña regularmente. Si notas actividad sospechosa, te recomendamos actualizarla de inmediato.
                  </p>
                </div>
              </div>
            )}
            
            {/* ── Addresses Tab ── */}
            {activeTab === 'addresses' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-black mb-6">
                    {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
                  </h2>
                  <form onSubmit={editingAddress ? saveEditedAddress : handleAddAddress}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="addressName" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Nombre de la dirección
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="addressName"
                          placeholder="Ej: Mi Casa, Oficina..."
                          value={editingAddress ? editAddressData.name : newAddress.name}
                          onChange={editingAddress ? handleEditAddressChange : handleAddressChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="addressStreet" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Calle / Número / Detalle
                        </label>
                        <input
                          type="text"
                          name="street"
                          id="addressStreet"
                          placeholder="Ej: Carrera 12 #34-56 Apto 7B"
                          value={editingAddress ? editAddressData.street : newAddress.street}
                          onChange={editingAddress ? handleEditAddressChange : handleAddressChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="addressCity" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="addressCity"
                          value={editingAddress ? editAddressData.city : newAddress.city}
                          onChange={editingAddress ? handleEditAddressChange : handleAddressChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="addressState" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Departamento
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="addressState"
                          value={editingAddress ? editAddressData.state : newAddress.state}
                          onChange={editingAddress ? handleEditAddressChange : handleAddressChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="addressZipCode" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          id="addressZipCode"
                          value={editingAddress ? editAddressData.zipCode : newAddress.zipCode}
                          onChange={editingAddress ? handleEditAddressChange : handleAddressChange}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-colors sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="addressCountry" className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                          País
                        </label>
                        <input
                          type="text"
                          name="country"
                          id="addressCountry"
                          value="Colombia"
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 text-gray-500 border-none rounded-xl cursor-not-allowed sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-8">
                      {editingAddress && (
                        <button
                          type="button"
                          onClick={cancelEditingAddress}
                          className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="px-6 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        {addressSaving ? 'Guardando...' : (editingAddress ? 'Guardar Cambios' : 'Agregar Dirección')}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-black mb-6">Mis Direcciones Guardadas</h2>
                  {addresses.length === 0 ? (
                    <div className="bg-white border border-gray-100 border-dashed rounded-2xl p-12 text-center text-gray-500 shadow-sm">
                      <FaMapLocationDot size={32} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-sm font-medium text-black">Aún no tienes direcciones</p>
                      <p className="text-xs mt-1">Empieza a agregar tus lugares frecuentes para comprar más rápido.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className={`relative p-5 rounded-2xl border transition-all ${
                          address.isDefault ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <h3 className={`text-base font-bold ${address.isDefault ? 'text-white' : 'text-black'}`}>
                              {address.name}
                            </h3>
                            {address.isDefault && (
                              <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase bg-white text-black px-2.5 py-1 rounded-md">
                                <FaCheck size={10} /> Predeterminado
                              </span>
                            )}
                          </div>
                          <div className={`text-sm space-y-1 ${address.isDefault ? 'text-gray-300' : 'text-gray-500'}`}>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-current border-opacity-10">
                            <button
                              onClick={() => startEditingAddress(address)}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                address.isDefault ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <FaPen size={10} /> Editar
                            </button>
                            
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              >
                                Hacer principal
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className={`ml-auto flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                                address.isDefault ? 'hover:bg-red-500/20 text-red-300' : 'hover:bg-red-50 text-red-500'
                              }`}
                              aria-label="Eliminar dirección"
                            >
                              <FaRegTrashCan size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;