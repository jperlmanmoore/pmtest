import mongoose, { Document, Schema } from 'mongoose';

export interface ICase extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  stage: 'intake' | 'opening' | 'treating' | 'demandPrep' | 'negotiation' | 'settlement' | 'resolution' | 'probate' | 'closed';
  dateOfLoss: Date;
  anteLitemRequired: boolean;
  anteLitemAgency?: string;
  anteLitemDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  stage: {
    type: String,
    enum: ['intake', 'opening', 'treating', 'demandPrep', 'negotiation', 'settlement', 'resolution', 'probate', 'closed'],
    default: 'intake'
  },
  dateOfLoss: {
    type: Date,
    required: true
  },
  anteLitemRequired: {
    type: Boolean,
    default: false
  },
  anteLitemAgency: {
    type: String,
    trim: true
  },
  anteLitemDeadline: {
    type: Date
  }
}, {
  timestamps: true
});

const Case = mongoose.model<ICase>('Case', caseSchema);

export default Case;
