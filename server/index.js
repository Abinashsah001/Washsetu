const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const demoUsers = {
  admin: {
    identifier: 'admin',
    password: 'admin123',
    name: 'Laundry Admin',
  },
};

const scryptAsync = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt);
  return `${salt}:${hash}`;
};

const verifyPassword = async (password, storedHash) => {
  const [salt, originalHash] = String(storedHash).split(':');
  if (!salt || !originalHash) return false;
  const computedHash = await scryptAsync(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
};

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
const isPhone = (value) => /^\d{10,15}$/.test(value);

app.post('/api/auth/register', async (req, res) => {
  const { role, name, email, phone, password } = req.body;
  const normalizedRole = String(role || 'customer').trim().toLowerCase();
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = String(phone || '').trim();
  const normalizedPassword = String(password || '');

  if (normalizedRole !== 'customer') {
    return res.status(400).json({ success: false, error: 'Only customer self-signup is allowed' });
  }

  if (!normalizedName || normalizedPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Name and password (min 6 chars) are required' });
  }

  if (!normalizedEmail && !normalizedPhone) {
    return res.status(400).json({ success: false, error: 'Provide either email or phone' });
  }

  if (normalizedEmail && !isEmail(normalizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  if (normalizedPhone && !isPhone(normalizedPhone)) {
    return res.status(400).json({ success: false, error: 'Invalid phone format' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Account already exists with this email/phone' });
    }

    const passwordHash = await hashPassword(normalizedPassword);
    const user = await prisma.user.create({
      data: {
        role: 'customer',
        name: normalizedName,
        email: normalizedEmail || null,
        phone: normalizedPhone || null,
        passwordHash,
      },
    });

    return res.status(201).json({
      success: true,
      role: 'customer',
      name: user.name,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { role, identifier, password } = req.body;

  if (!role || !identifier || !password) {
    return res.status(400).json({ success: false, error: 'role, identifier, and password are required' });
  }

  if (role !== 'customer' && role !== 'admin') {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  const normalizedIdentifier = String(identifier).trim().toLowerCase();
  const normalizedPassword = String(password).trim();

  if (role === 'admin') {
    const selected = demoUsers.admin;
    const normalizedExpected = String(selected.identifier).trim().toLowerCase();

    if (normalizedIdentifier !== normalizedExpected || normalizedPassword !== selected.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      role,
      name: selected.name,
      message: `${role} login successful`,
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        role: 'customer',
        OR: [{ email: normalizedIdentifier }, { phone: normalizedIdentifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = await verifyPassword(normalizedPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      role: 'customer',
      name: user.name,
      message: 'customer login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Handle booking creation
app.post('/api/bookings', async (req, res) => {
  const { machineId, washType, date, timeSlot, amount } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { machineId, washType, date, timeSlot, amount }
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error('Prisma Error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Fetch all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
