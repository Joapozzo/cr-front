"use client";
import BackButton from "@/app/components/ui/BackButton";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useAuthStore } from "@/app/stores/authStore";
import { Calendar, CreditCard, Key, Mail, Phone, Shield, User } from "lucide-react";
import { useState } from "react";
import { AvatarPerfil } from "@/app/components/perfil/AvatarPerfil";

const PerfilUsuario: React.FC = () => {
    const [activeTab, setActiveTab] = useState('perfil');
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const usuario = useAuthStore((state) => state.usuario);

    const getRoleName = (rol?: string) => {
        const roles: Record<string, string> = { 
            'ADMIN': 'Administrador', 
            'PLANILLERO': 'Planillero', 
            'USER': 'Usuario',
            'CAJERO': 'Cajero'
        };
        return rol ? roles[rol] || 'Usuario' : 'Usuario';
    };

    const formatDate = (date?: Date | string | null) => {
        if (!date) return 'Sin definir';
        try {
            return new Date(date).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Sin definir';
        }
    };

    if (!usuario) {
        return (
            <div className="min-h-screen text-white">
                <div className="max-w-4xl mx-auto p-4 space-y-3">
                    <BackButton/>
                    <div className="text-center py-8">
                        <p className="text-[#737373]">No se encontraron datos del usuario</p>
                    </div>
                </div>
            </div>
        );
    }

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen text-white">
            <div className="max-w-4xl mx-auto p-4 space-y-3">
                {/* Header */}
                <BackButton/>
                <div className="text-start py-3">
                    <h1 className="text-2xl font-bold text-white mb-2">Mi perfil</h1>
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
                        disabled={true}
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
                                <AvatarPerfil
                                    imagenUrl={usuario.img && usuario.img !== '/img/default-avatar.png' ? usuario.img : null}
                                    nombre={`${usuario.nombre} ${usuario.apellido}`}
                                    editable={true}
                                    size="xl"
                                />
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-1">
                                        {usuario.nombre} {usuario.apellido}
                                    </h2>
                                    <p className="text-[#65656B] mb-2">@{usuario.username}</p>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#2AD174]" />
                                        <span className="text-sm text-[#2AD174]">
                                            {getRoleName(usuario.rol)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre"
                                    value={usuario.nombre}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="Apellido"
                                    value={usuario.apellido}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="Email"
                                    value={usuario.email}
                                    disabled
                                    icon={<Mail className="w-4 h-4" />}
                                />
                                <Input
                                    label="Nombre de Usuario"
                                    value={usuario.username}
                                    disabled
                                    icon={<User className="w-4 h-4" />}
                                />
                                <Input
                                    label="DNI"
                                    value={usuario.dni}
                                    disabled
                                    icon={<CreditCard className="w-4 h-4" />}
                                />
                                <Input
                                    label="Teléfono"
                                    value={usuario.telefono?.toString() || ''}
                                    disabled
                                    icon={<Phone className="w-4 h-4" />}
                                />
                                <Input
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    value={usuario.nacimiento ? (typeof usuario.nacimiento === 'string' ? usuario.nacimiento : new Date(usuario.nacimiento).toISOString().split('T')[0]) : ''}
                                    disabled
                                    icon={<Calendar className="w-4 h-4" />}
                                />
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
                                        Estado de Cuenta
                                    </label>
                                    <p className="text-[#65656B]">
                                        {usuario.cuenta_activada ? 'Activada' : 'Pendiente'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#fafafa] mb-1 block">
                                        Último Acceso
                                    </label>
                                    <p className="text-[#65656B]">
                                        {formatDate(usuario.ultimo_login)}
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
                                Cambiar contraseña
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <Input
                                    label="Contraseña actual"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Ingresa tu contraseña actual"
                                />
                                <Input
                                    label="Nueva contraseña"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Ingresa tu nueva contraseña"
                                />
                                <Input
                                    label="Confirmar nueva contraseña"
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
                        {/* <div className="bg-[#1A1A1A] border border-[#2D2F30] rounded-2xl p-6">
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
                        </div> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerfilUsuario;