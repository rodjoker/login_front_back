import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // nunca vuelve en un find() normal -- hay que pedirlo con .select('+password')
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // --- Bloqueo de cuenta por intentos fallidos ---
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// true mientras lockUntil exista y siga en el futuro. Una vez que el tiempo
// pasa, isLocked vuelve a false solo -- no hace falta ningún job que limpie
// lockUntil a mano, el siguiente login exitoso ya lo resetea (ver
// auth.service.js).
userSchema.virtual('isLocked').get(function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Mongoose 8+/9 detecta que esta función es async por su firma (sin
// parámetro `next`) y espera la promesa en vez de pasar un callback --
// llamar a next() acá tiraría "next is not a function".
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Nunca dejar salir password/loginAttempts/lockUntil en una respuesta JSON,
// incluso si algún día alguien olvida usar .select() en una query nueva.
userSchema.methods.toJSON = function toSafeJSON() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.__v;
  return obj;
};

export const User = model('User', userSchema);
