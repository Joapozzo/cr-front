export const MAPEO_POSICIONES_CODIGOS: Record<string, Record<string, { codigos: string[], nombre: string }>> = {
    '1-2-3-1': {
        '1': { codigos: ['ARQ'], nombre: 'ARQ' }, // Arquero
        '2': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' }, // Defensores
        '3': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '4': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' }, // Mediocampistas
        '5': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '6': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '7': { codigos: ['DEL'], nombre: 'DEL' }, // Delantero
    },
    '1-3-1-2': {
        '1': { codigos: ['ARQ'], nombre: 'ARQ' },
        '2': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '3': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '4': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '5': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '6': { codigos: ['DEL'], nombre: 'DEL' },
        '7': { codigos: ['DEL'], nombre: 'DEL' },
    },
    '1-3-2-1': {
        '1': { codigos: ['ARQ'], nombre: 'ARQ' },
        '2': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '3': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '4': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '5': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '6': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '7': { codigos: ['DEL'], nombre: 'DEL' },
    },
    '1-4-2': {
        '1': { codigos: ['ARQ'], nombre: 'ARQ' },
        '2': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '3': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '4': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '5': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '6': { codigos: ['DEL'], nombre: 'DEL' },
        '7': { codigos: ['DEL'], nombre: 'DEL' },
    },
    '1-2-2-2': {
        '1': { codigos: ['ARQ'], nombre: 'ARQ' },
        '2': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '3': { codigos: ['DEF', 'LD', 'LI'], nombre: 'DEF' },
        '4': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '5': { codigos: ['MC', 'MI', 'MD'], nombre: 'MED' },
        '6': { codigos: ['DEL'], nombre: 'DEL' },
        '7': { codigos: ['DEL'], nombre: 'DEL' },
    },
};

export const FORMACIONES_DISPONIBLES = {
    '1-2-3-1': [1, 2, 3, 1],
    '1-3-1-2': [1, 3, 1, 2],
    '1-3-2-1': [1, 3, 2, 1],
    '1-4-2': [1, 4, 2],
    '1-2-2-2': [1, 2, 2, 2],
};