import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISeminar extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  guestSpeaker: string;
  tags: string[];
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
      lowercase: true,
      trim: true,
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

// Pre-save hook for slug generation and data normalization
seminarSchema.pre('save', async function () {
    const seminar = this as ISeminar;

    // Regenerate slug only when the title changes to avoid overwriting a custom slug.
    if (seminar.isModified('title') || seminar.isNew) {
        seminar.slug = generateSlug(seminar.title);
    }

    // Normalize date to YYYY-MM-DD (ISO date-only string).
    if (seminar.isModified('date')) {
        const dateNormalized = normalizeDate(seminar.date);
        if (!dateNormalized) {
            throw new Error(`Invalid date: "${seminar.date}"`);
        }
        seminar.date = dateNormalized;
    }

    // Normalize time to 24-hour HH:MM.
    if (seminar.isModified('time')) {
        const timeNormalized = normalizeTime(seminar.time);
        if (!timeNormalized) {
            throw new Error(`Invalid time: "${seminar.time}"`);
        }
        seminar.time = timeNormalized;
    }
});

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
 * Normalizes date to ISO format.
 */
function normalizeDate(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format`);
    }
    return date.toISOString().split('T')[0];
}

/**
 * Normalizes a time string to 24-hour HH:MM format.
 * Accepts "9:00", "09:00", "9:00 AM", "9:00 pm", and "09:00:00" variants.
 */
function normalizeTime(timeString: string): string {
  // handles various time formats and convert to HH:MM (24-hour format)
  const timeRegex= /^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error('Invalid time format. Expected HH:MM or HH:MM AM/PM');
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem) {
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
    throw new Error('Invalid time values');
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Create unique index on slug for better performance
// seminarSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
seminarSchema.index({ date: 1, mode: 1 });

// Guard against model recompilation during Next.js HMR in development.
const Seminar: Model<ISeminar> =
  (mongoose.models.Seminar as Model<ISeminar>) ||
  mongoose.model<ISeminar>('Seminar', seminarSchema);

export default Seminar;
