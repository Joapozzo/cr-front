"use client";
import BackButton from "@/app/components/ui/BackButton";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useUserStore } from "@/app/stores/userStore";
import { Calendar, Camera, CreditCard, Key, Mail, Phone, Shield, User } from "lucide-react";
import { useState } from "react";

const PerfilUsuario: React.FC = () => {
    const [activeTab, setActiveTab] = useState('perfil');
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const userData = useUserStore((state) => state.userData);

    const getRoleName = (rolId: number) => {
        const roles = { 1: 'Administrador', 2: 'Planillero', 3: 'Usuario' };
        return roles[rolId as keyof typeof roles] || 'Usuario';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen text-white">
            <div className="max-w-4xl mx-auto p-4 space-y-3">
                {/* Header */}
                <BackButton/>
                <div className="text-start py-3">
                    <h1 className="text-2xl font-bold text-white mb-2">Mi Perfil</h1>
                    <p className="text-[#737373]">Gestiona tu información personal</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-[#2D2F30] mb-6 pb-6 gap-2">
                    <Button
                        onClick={() => setActiveTab('perfil')}
                        variant={activeTab === 'perfil' ? 'more' : 'default'}
                    >
                        <User className="w-4 h-4 inline-block mr-2" />
                        Información Personal
                    </Button>
                    <Button
                        onClick={() => setActiveTab('seguridad')}
                        variant={activeTab === 'seguridad' ? 'more' : 'default'}
                    >
                        <Key className="w-4 h-4 inline-block mr-2" />
                        Seguridad
                    </Button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'perfil' && (
                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-[#2D2F30] flex items-center justify-center overflow-hidden">
                                        {userData.img && userData.img !== '/img/default-avatar.png' ? (
                                            <img
                                                src={userData.img}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-[#65656B]" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsEditingImage(!isEditingImage)}
                                        className="absolute -bottom-2 -right-2 bg-[#2AD174] text-[#101011] p-2 rounded-full hover:bg-[#22C55E] transition-colors duration-200"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-1">
                                        {userData.nombre} {userData.apellido}
                                    </h2>
                                    <p className="text-[#65656B] mb-2">@{userData.username}</p>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#2AD174]" />
                                        <span className="text-sm text-[#2AD174]">
                                            {getRoleName(userData.id_rol)}
                                        </span>
                                        <span>
                                            {userData.estado === 'S' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {isEditingImage && (
                                <div className="mt-4 p-4 bg-[#2D2F30] rounded-lg">
                                    <p className="text-sm text-[#65656B] mb-3">
                                        Selecciona una nueva imagen de perfil
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-sm text-[#65656B] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A1A1A] file:text-white hover:file:bg-[#2D2F30] file:transition-colors file:duration-200"
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <Button variant="success" size="sm">Subir Imagen</Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => setIsEditingImage(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Personal Information */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    value={userData.nombre}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="Apellido"
                                    value={userData.apellido}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="Email"
                                    value={userData.email}
                                    disabled
                                    icon={<Mail className="w-4 h-4" />}
                                />
                                <Input
                                    label="Nombre de Usuario"
                                    value={userData.username}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="DNI"
                                    value={userData.dni}
                                    disabled
                                    icon={<CreditCard className="w-4 h-4" />}
                                />
                                <Input
                                    label="Teléfono"
                                    value={userData.telefono?.toString() || ''}
                                    disabled
                                    icon={<Phone className="w-4 h-4" />}
                                />
                                <Input
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    value={userData.nacimiento}
                                    disabled
                                    icon={<Calendar className="w-4 h-4" />}
                                />
                                {/* <Input
                                    label="UID"
                                    value={userData.uid}
                                    disabled
                                    className="font-mono text-xs"
                                /> */}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Información de Cuenta
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-[#fafafa] mb-1 block">
                                        Fecha de Registro
                                    </label>
                                    <p className="text-[#65656B]">
                                        {formatDate(userData.creado_en)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#fafafa] mb-1 block">
                                        Último Acceso
                                    </label>
                                    <p className="text-[#65656B]">
                                        {formatDate(userData.ultimo_login)}
                                    </p>
                                </div>
                                {/* <div>
                                    <label className="text-sm font-medium text-[#fafafa] mb-1 block">
                                        Estado de Cuenta
                                    </label>
                                    <span className={userData.cuenta_activada ? 'bg-[#22C55E] bg-opacity-20 text-[#22C55E]' : 'bg-[#EF4444] bg-opacity-20 text-[#EF4444]'}>
                                        <div className={userData.cuenta_activada ? 'w-2 h-2 rounded-full bg-[#22C55E]' : 'w-2 h-2 rounded-full bg-[#EF4444]'} />
                                        {userData.cuenta_activada ? 'Verificada' : 'Pendiente'}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'seguridad' && (
                    <div className="space-y-6">
                        {/* Change Password */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Cambiar Contraseña
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <Input
                                    label="Contraseña Actual"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Ingresa tu contraseña actual"
                                />
                                <Input
                                    label="Nueva Contraseña"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Ingresa tu nueva contraseña"
                                />
                                <Input
                                    label="Confirmar Nueva Contraseña"
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Confirma tu nueva contraseña"
                                    error={passwords.new !== passwords.confirm && passwords.confirm ? 'Las contraseñas no coinciden' : ''}
                                />
                                <Button
                                    variant="success"
                                    disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm}
                                >
                                    Actualizar Contraseña
                                </Button>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Configuración de Seguridad
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#2D2F30] rounded-lg">
                                    <div>
                                        <h4 className="text-white font-medium">Verificación en dos pasos</h4>
                                        <p className="text-sm text-[#65656B]">
                                            Añade una capa extra de seguridad a tu cuenta
                                        </p>
                                    </div>
                                    <Button variant="default" size="sm">
                                        Configurar
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#2D2F30] rounded-lg">
                                    <div>
                                        <h4 className="text-white font-medium">Notificaciones de seguridad</h4>
                                        <p className="text-sm text-[#65656B]">
                                            Recibe alertas sobre actividad sospechosa
                                        </p>
                                    </div>
                                    <Button variant="success" size="sm">
                                        Activado
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#2D2F30] rounded-lg">
                                    <div>
                                        <h4 className="text-white font-medium">Sesiones activas</h4>
                                        <p className="text-sm text-[#65656B]">
                                            Gestiona los dispositivos conectados a tu cuenta
                                        </p>
                                    </div>
                                    <Button variant="more" size="sm">
                                        Ver Sesiones
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerfilUsuario;