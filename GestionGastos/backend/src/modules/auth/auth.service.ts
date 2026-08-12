import { pool } from '../../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async login(email: string, passwordPlana: string) {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('Credenciales incorrectas');
    }

    const usuario = result.rows[0];

    const esValida = await bcrypt.compare(passwordPlana, usuario.password);
    if (!esValida) {
      throw new Error('Credenciales incorrectas');
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      secret,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  }
}