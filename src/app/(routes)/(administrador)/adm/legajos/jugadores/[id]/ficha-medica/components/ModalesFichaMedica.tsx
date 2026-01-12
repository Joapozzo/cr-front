import { FormModal, FormDataValue } from '@/app/components/modals/ModalAdmin';
import { FichaMedica } from '@/app/services/fichaMedica.service';
import { getSubirFichaFields, getCambiarEstadoFields } from '../config/formFields';

interface ModalesFichaMedicaProps {
    showSubirModal: boolean;
    showCambiarEstadoModal: boolean;
    estadoSeleccionado: string;
    fichaMedica: FichaMedica | null;
    isSubiendo: boolean;
    isCambiandoEstado: boolean;
    onCloseSubir: () => void;
    onCloseCambiarEstado: () => void;
    onSubirFicha: (data: Record<string, FormDataValue>) => Promise<void>;
    onCambiarEstado: (data: Record<string, FormDataValue>) => Promise<void>;
    onEstadoChange: (name: string, value: FormDataValue) => void;
}

export const ModalesFichaMedica = ({
    showSubirModal,
    showCambiarEstadoModal,
    estadoSeleccionado,
    fichaMedica,
    isSubiendo,
    isCambiandoEstado,
    onCloseSubir,
    onCloseCambiarEstado,
    onSubirFicha,
    onCambiarEstado,
    onEstadoChange,
}: ModalesFichaMedicaProps) => {
    return (
        <>
            <FormModal
                isOpen={showSubirModal}
                onClose={onCloseSubir}
                title="Subir/Actualizar Ficha médica"
                fields={getSubirFichaFields()}
                onSubmit={onSubirFicha}
                submitText="Subir Ficha"
                type="create"
                isLoading={isSubiendo}
                maxWidth="max-w-2xl"
            />

            {fichaMedica && (
                <FormModal
                    isOpen={showCambiarEstadoModal}
                    onClose={onCloseCambiarEstado}
                    title="Cambiar Estado de Ficha médica"
                    fields={getCambiarEstadoFields(estadoSeleccionado)}
                    initialData={{
                        estado: fichaMedica.estado,
                        motivo_rechazo: fichaMedica.motivo_rechazo || '',
                    }}
                    onSubmit={onCambiarEstado}
                    submitText="Cambiar Estado"
                    type="edit"
                    isLoading={isCambiandoEstado}
                    maxWidth="max-w-md"
                    onFieldChange={onEstadoChange}
                />
            )}
        </>
    );
};

