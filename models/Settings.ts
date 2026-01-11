import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  address: [String],
  gettingHere: {
    steps: [String],
    mapEmbedSrc: String,
  },
  phoneNumbers: [String],
  emails: [String],
  openingHours: String,
});

const SettingsSchema = new mongoose.Schema({
  locations: [LocationSchema],
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
