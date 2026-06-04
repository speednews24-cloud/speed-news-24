import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

export async function connectDB() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (env.DNS_SERVERS) {
    dns.setServers(env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean));
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
}
