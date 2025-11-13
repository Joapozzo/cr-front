import {
  Home,
  BarChart3,
  Newspaper,
  Users,
  FileText,
  UserCircle,
  Settings,
  Shield,
  Calendar,
  Trophy,
} from 'lucide-react';

// Menú para USER/JUGADOR
export const userMenuItems = [
  {
    label: 'Inicio',
    href: '/home',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Estadísticas',
    href: '/estadisticas',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Noticias',
    href: '/noticias',
    icon: <Newspaper className="w-5 h-5" />,
  },
  {
    label: 'Mi Equipo',
    href: '/mi-equipo',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: <UserCircle className="w-5 h-5" />,
  },
  {
    label: 'Configuración',
    href: '/perfil/configuracion',
    icon: <Settings className="w-5 h-5" />,
  },
];

// Menú para PLANILLERO
export const planilleroMenuItems = [
  {
    label: 'Inicio',
    href: '/planillero',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Partidos',
    href: '/planillero/partidos',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Estadísticas',
    href: '/planillero/estadisticas',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Noticias',
    href: '/noticias',
    icon: <Newspaper className="w-5 h-5" />,
  },
  {
    label: 'Mi Equipo',
    href: '/mi-equipo',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Solicitudes',
    href: '/planillero/solicitudes',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: <UserCircle className="w-5 h-5" />,
  },
  {
    label: 'Configuración',
    href: '/perfil/configuracion',
    icon: <Settings className="w-5 h-5" />,
  },
];

// Menú para ADMIN
export const adminMenuItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Usuarios',
    href: '/admin/usuarios',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Categorías',
    href: '/admin/categorias',
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    label: 'Partidos',
    href: '/admin/partidos',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Estadísticas',
    href: '/admin/estadisticas',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Noticias',
    href: '/admin/noticias',
    icon: <Newspaper className="w-5 h-5" />,
  },
  {
    label: 'Solicitudes',
    href: '/admin/solicitudes',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Configuración',
    href: '/admin/configuracion',
    icon: <Shield className="w-5 h-5" />,
  },
];

// Helper para obtener el menú según el rol
export const getMenuItemsByRole = (rol: 'ADMIN' | 'PLANILLERO' | 'USER') => {
  switch (rol) {
    case 'ADMIN':
      return adminMenuItems;
    case 'PLANILLERO':
      return planilleroMenuItems;
    case 'USER':
    default:
      return userMenuItems;
  }
};

