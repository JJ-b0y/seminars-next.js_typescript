import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import Seminar from "./seminar.model";

export interface IRegister extends Document {
  _id: Types.ObjectId;
  seminarId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Registration schema.
 *
 * Design decisions:
 * - seminarId is a ref to 'Seminar' for populate() support; existence is
 *   enforced at the application layer in the pre-save hook rather than relying
 *   solely on the DB ref, giving a clearer error message on invalid IDs.
 * - email is lowercased and trimmed at the schema level so duplicates due to
 *   casing are handled consistently before any uniqueness checks.
 */
const registerSchema = new Schema<IRegister>(
  {
    seminarId: {
      type: Schema.Types.ObjectId,
      ref: 'Seminar',
      required: [true, 'Seminar ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322-inspired regex for basic email format validation.
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Invalid email address',
      },
    },
  },
  { timestamps: true }
);

// Verify the referenced Seminar exists before persisting a registration.
registerSchema.pre('save', async function (next: any) {

  const register = this as IRegister;
  // Only run the check on new documents or when seminarId is explicitly modified.
  if (register.isNew || register.isModified('seminarId')) {
    try {
      const seminarExists = await Seminar.findById(register.seminarId).select('_id').lean();

      if (!seminarExists) {
        const error = new Error(`Seminar with ID ${register.seminarId} does not exist`);
        error.name = 'ValidationError';
        return next(error);
      }
    } catch {
        const validationError = new Error('Invalid seminar ID format or database error');
        validationError.name = 'ValidationError';
        return next(validationError);
    }
  }

  next();
});

// Create index on seminarId for faster queries
registerSchema.index({ seminarId: 1 });

// Create compound index for common queries (seminar registrations by date)
registerSchema.index({ seminarId: 1, createdAt: -1 });

// Create index on email for user registration lookups
registerSchema.index({ email: 1 });

// Create index to block duplicate seminar registration with one email
registerSchema.index({ seminarId: 1, email: 1 }, { unique: true, name: "uniq_seminar_email" });

// Guard against model recompilation during Next.js HMR in development.
const Register: Model<IRegister> =
  (mongoose.models.Register as Model<IRegister>) ||
  mongoose.model<IRegister>('Register', registerSchema);

export default Register;
