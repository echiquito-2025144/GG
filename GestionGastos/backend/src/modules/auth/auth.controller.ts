import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ mensaje: 'El correo y la contraseña son obligatorios' });
      }

      const data = await AuthService.login(email, password);
      return res.json(data);
    } catch (error: any) {
      return res.status(401).json({ mensaje: error.message || 'Error al iniciar sesión' });
    }
  }
}