import { connectDB } from '../config/db.js';
import User from '../models/User.js';

await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');

let user = await User.findOne({ email });
if (!user) user = new User({ name: 'Speed News Admin', email, role: 'admin', isEmailVerified: true });
await user.setPassword(password);
user.role = 'admin';
await user.save();
console.log(`Admin ready: ${email}`);
process.exit(0);
