import { IUserData, IUserPlayer } from "../types/user";

export const UserData: IUserData = {
    uid: 1,
    nombre: "John",
    apellido: "Doe",
    email: "john.doe@example.com",
    dni: "12345678",
    img: null,
    nacimiento: new Date("1995-05-15"),
    telefono: "1234567890",
    username: "johndoe",
};

export const UserPlayer: IUserPlayer = {
    id_jugador: 162236, //162247
    id_posicion: 1,
};

export const Capitan = {
    id_jugador: 162236, 
    id_equipo: 10,
    id_categoria_edicion: 44,
};