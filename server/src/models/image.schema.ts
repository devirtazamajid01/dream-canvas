import { Schema, model, Document } from 'mongoose'

interface ImageModel extends Document {
  prompt: string
  imageUrl: string
  cloudinaryId?: string
  createdAt: Date
  updatedAt: Date
}

const imageSchema = new Schema<ImageModel>(
  {
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
      minlength: [1, 'Prompt must be at least 1 character long'],
      maxlength: [1000, 'Prompt cannot exceed 1000 characters'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)
        },
        message: 'Image URL must be a valid image URL',
      },
      unique: true,
    },
    cloudinaryId: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

// Indexes for better query performance
imageSchema.index({ createdAt: -1 })
imageSchema.index({ prompt: 'text' })

// Pre-save middleware
imageSchema.pre('save', function (next) {
  // Ensure imageUrl is HTTPS
  if (this.imageUrl && this.imageUrl.startsWith('http:')) {
    this.imageUrl = this.imageUrl.replace('http:', 'https:')
  }
  next()
})

const Image = model<ImageModel>('Image', imageSchema)

export default Image
