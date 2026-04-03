import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IRegister extends Document {
  _id: Types.ObjectId;
  seminarId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// RFC 5322-inspired regex for basic email format validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      // Index for fast lookups of all registrations for a given seminar.
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: 'Invalid email address.',
      },
    },
  },
  { timestamps: true }
);

// Verify the referenced Seminar exists before persisting a registration.
registerSchema.pre('save', async function (next) {
  // Only run the check on new documents or when seminarId is explicitly changed.
  if (!this.isNew && !this.isModified('seminarId')) return next();

  const seminar = await mongoose.models['Seminar']?.findById(this.seminarId).lean();

  if (!seminar) {
    return next(
      new Error(`Seminar with id "${this.seminarId.toString()}" does not exist.`)
    );
  }

  next();
});

// Guard against model recompilation during Next.js HMR in development.
const Register: Model<IRegister> =
  (mongoose.models.Register as Model<IRegister>) ||
  mongoose.model<IRegister>('Register', registerSchema);

export default Register;
