'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { Input } from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import { FormModal, DeleteModal, useModals } from '@/app/components/modals/ModalAdmin';
import { NoticiaForm } from '@/app/components/NoticiaForm';
import { toast } from 'react-hot-toast';
import {
  useListarNoticias,
  useCrearNoticia,
  useActualizarNoticia,
  useEliminarNoticia,
  useTogglePublicacion
} from '@/app/hooks/useNoticias';
import { Noticia, CrearNoticiaInput } from '@/app/types/noticia';
import CardNoticiaAdmin from '@/app/components/NoticiaCardAdmin';
import { NoticiasGridSkeleton } from '@/app/components/skeletons/NoticiaCardSkeleton';

export default function NoticiasPage() {
  const [editingNoticia, setEditingNoticia] = useState<Noticia | undefined>(undefined);
  const [deletingNoticia, setDeletingNoticia] = useState<Noticia | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string | number>('all');
  const [filterEstado, setFilterEstado] = useState<string | number>('all');

  const { modals, openModal, closeModal } = useModals();

  // React Query hooks
  const { data: noticiasData, isLoading, isError, error } = useListarNoticias({
    busqueda: searchTerm || undefined,
    publicada: filterEstado === 'publicada' ? true : filterEstado === 'borrador' ? false : undefined,
  });

  const crearMutation = useCrearNoticia();
  const actualizarMutation = useActualizarNoticia();
  const eliminarMutation = useEliminarNoticia();
  const toggleMutation = useTogglePublicacion();

  // Handlers
  const handleCreate = async (data: CrearNoticiaInput) => {
    try {
      await crearMutation.mutateAsync(data);
      toast.success('Noticia creada exitosamente');
      closeModal('create');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la noticia';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia);
    openModal('edit');
  };

  const handleUpdate = async (data: CrearNoticiaInput) => {
    if (!editingNoticia) return;

    try {
      await actualizarMutation.mutateAsync({
        id_noticia: editingNoticia.id_noticia,
        data: data
      });
      toast.success('Noticia actualizada exitosamente');
      closeModal('edit');
      setEditingNoticia(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la noticia';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = (noticia: Noticia) => {
    setDeletingNoticia(noticia);
    openModal('delete');
  };

  const handleConfirmDelete = async () => {
    if (!deletingNoticia) return;

    try {
      await eliminarMutation.mutateAsync(deletingNoticia.id_noticia);
      toast.success('Noticia eliminada exitosamente');
      closeModal('delete');
      setDeletingNoticia(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la noticia';
      toast.error(errorMessage);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success('Estado de publicación actualizado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado';
      toast.error(errorMessage);
    }
  };

  // Filtrar noticias localmente (algunos filtros ya vienen del servidor)
  const filteredNoticias = useMemo(() => {
    const noticias = noticiasData?.data || [];
    return noticias.filter(noticia => {
      const matchTipo = filterTipo === 'all' || noticia.tipoNoticia?.nombre === filterTipo;
      return matchTipo;
    });
  }, [noticiasData?.data, filterTipo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de Noticias"
        description="Administra el contenido y noticias del portal"
        actions={
          <Button
            onClick={() => {
              setEditingNoticia(undefined);
              openModal('create');
            }}
            variant="success"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Noticia
          </Button>
        }
      />

      {/* Filtros */}
      <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="">
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 flex items-center justify-center"
              icon={<Search />}
            />
          </div>

          <Select
            value={filterTipo}
            onChange={(value) => setFilterTipo(value)}
            options={[
              { value: 'all', label: 'Todos los tipos' },
              { value: 'Informativa', label: 'Informativa' },
              { value: 'Resultado', label: 'Resultado' },
              { value: 'Anuncio', label: 'Anuncio' },
              { value: 'Entrevista', label: 'Entrevista' }
            ]}
            placeholder="Todos los tipos"
          />

          <Select
            value={filterEstado}
            onChange={(value) => setFilterEstado(value)}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'publicada', label: 'Publicadas' },
              { value: 'borrador', label: 'Borradores' }
            ]}
            placeholder="Todos los estados"
          />

          <div className="flex items-center justify-center px-4 py-3 bg-[var(--gray-300)] rounded-lg">
            <span className="text-[var(--white)] font-semibold">{filteredNoticias.length}</span>
            <span className="text-[var(--gray-100)] ml-1">noticias</span>
          </div>
        </div>
      </div>

      {/* Estados de carga */}
      {isLoading ? (
        <div>
          <NoticiasGridSkeleton count={3} />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-64 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-[var(--red)] mx-auto mb-4" />
            <p className="text-[var(--white)] font-semibold mb-2">Error al cargar noticias</p>
            <p className="text-[var(--gray-100)]">{error instanceof Error ? error.message : 'Error desconocido'}</p>
          </div>
        </div>
      ) : filteredNoticias.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-[var(--gray-100)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--white)] mb-2">No hay noticias</h3>
            <p className="text-[var(--gray-100)] mb-4">Comienza creando una nueva noticia</p>
            <Button
              variant="success"
              onClick={() => openModal('create')}
            >
              Crear primera noticia
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNoticias.map((noticia) => (
            <CardNoticiaAdmin noticia={noticia} handleEdit={handleEdit} handleTogglePublish={handleTogglePublish} handleDelete={handleDelete} toggleMutation={toggleMutation} key={noticia.id_noticia} />
          ))}
        </div>
      )}

      {/* Modal de creación */}
      <FormModal
        isOpen={modals.create}
        onClose={() => closeModal('create')}
        title="Nueva Noticia"
        type="create"
      >
        <NoticiaForm
          initialData={undefined}
          onSubmit={handleCreate}
          onCancel={() => closeModal('create')}
          isLoading={crearMutation.isPending}
        />
      </FormModal>

      {/* Modal de edición */}
      <FormModal
        isOpen={modals.edit}
        onClose={() => {
          closeModal('edit');
          setEditingNoticia(undefined);
        }}
        title="Editar Noticia"
        type="edit"
      >
        <NoticiaForm
          initialData={editingNoticia ? {
            titulo: editingNoticia.titulo,
            contenido: editingNoticia.contenido_preview || editingNoticia.contenido,
            img_portada: editingNoticia.img_portada || editingNoticia.img,
            id_tipo_noticia: editingNoticia.id_tipo_noticia,
            destacada: editingNoticia.destacada,
            publicada: editingNoticia.publicada,
          } : undefined}
          onSubmit={handleUpdate}
          onCancel={() => {
            closeModal('edit');
            setEditingNoticia(undefined);
          }}
          isLoading={actualizarMutation.isPending}
        />
      </FormModal>

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={modals.delete}
        onClose={() => {
          closeModal('delete');
          setDeletingNoticia(undefined);
        }}
        title="Eliminar Noticia"
        message="¿Estás seguro de que deseas eliminar esta noticia?"
        itemName={deletingNoticia?.titulo}
        onConfirm={handleConfirmDelete}
        error={null}
      />
    </div>
  );
}
