import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ISeminar extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  date: string;
  time: string;
  mode: 'virtual' | 'physical' | 'hybrid';
  audience: string;
  agenda: string[];
  guestSpeaker: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const seminarSchema = new Schema<ISeminar>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    // Populated automatically from title in the pre-save hook.
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    // Stored as YYYY-MM-DD after normalization.
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    // Stored as HH:MM (24-hour) after normalization.
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['virtual', 'physical', 'hybrid'],
        message: 'Mode must be "virtual", "physical", or "hybrid".',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must contain at least one item.',
      },
    },
    guestSpeaker: {
      type: String,
      required: [true, 'Guest speaker is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must contain at least one item.',
      },
    },
  },
  { timestamps: true }
);

/**
 * Converts a title into a URL-friendly slug.
 * e.g. "Hello World! 2024" → "hello-world-2024"
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // strip punctuation (keep word chars, spaces, hyphens)
    .replace(/[\s_]+/g, '-')   // collapse whitespace/underscores into a single hyphen
    .replace(/-{2,}/g, '-')    // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens
}

/**
 * Normalizes a time string to 24-hour HH:MM format.
 * Accepts "9:00", "09:00", "9:00 AM", "9:00 pm", and "09:00:00" variants.
 */
function normalizeTime(raw: string): string {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(am|pm))?$/i);

  if (!match) {
    throw new Error(`Invalid time format: "${raw}". Expected HH:MM or H:MM AM/PM.`);
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;

  if (hours > 23 || parseInt(minutes, 10) > 59) {
    throw new Error(`Time value out of range: "${raw}".`);
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

seminarSchema.pre('save', function (next) {
  // Regenerate slug only when the title changes to avoid overwriting a custom slug.
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to YYYY-MM-DD (ISO date-only string).
  if (this.isModified('date')) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      return next(new Error(`Invalid date: "${this.date}".`));
    }
    this.date = parsed.toISOString().split('T')[0];
  }

  // Normalize time to 24-hour HH:MM.
  if (this.isModified('time')) {
    try {
      this.time = normalizeTime(this.time);
    } catch (err) {
      return next(err instanceof Error ? err : new Error(String(err)));
    }
  }

  next();
});

// Guard against model recompilation during Next.js HMR in development.
const Seminar: Model<ISeminar> =
  (mongoose.models.Seminar as Model<ISeminar>) ||
  mongoose.model<ISeminar>('Seminar', seminarSchema);

export default Seminar;
