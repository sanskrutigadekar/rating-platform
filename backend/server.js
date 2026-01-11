const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rating_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
const isStoreOwner = (req, res, next) => {
    if (req.user.role !== 'store_owner') {
        return res.status(403).json({ error: 'Store owner access required' });
    }
    next();
};

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is workinggggg!' });
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, address, role = 'user' } = req.body;
        
        
        if (!name || !email || !password || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: 'Name must be 20-60 characters' });
        }
        
        if (address.length > 400) {
            return res.status(400).json({ error: 'Address must be max 400 characters' });
        }
        
        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({ error: 'Password must be 8-16 characters' });
        }
        
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter and one special character' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
    
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        

        const hashedPassword = await bcrypt.hash(password, 10);
        

        await pool.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            success: true 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

//login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/admin/dashboard/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const [storesCount] = await pool.execute('SELECT COUNT(*) as count FROM stores');
        const [ratingsCount] = await pool.execute('SELECT COUNT(*) as count FROM ratings');
        
        res.json({
            users: usersCount[0].count,
            stores: storesCount[0].count,
            ratings: ratingsCount[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/admin/stores', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        
        if (!name || !email || !address || !owner_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        await pool.execute(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );
        
        res.status(201).json({ message: 'Store added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, email, password, address, role = 'user' } = req.body;
        

        if (!name || !email || !password || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: 'Name must be 20-60 characters' });
        }
        
        if (address.length > 400) {
            return res.status(400).json({ error: 'Address must be max 400 characters' });
        }
        
        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({ error: 'Password must be 8-16 characters' });
        }
        
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter and one special character' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        

        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        

        const hashedPassword = await bcrypt.hash(password, 10);
        

        await pool.execute(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/stores', authenticateToken, async (req, res) => {
    try {
        const { search = '', sort = 'name', order = 'asc' } = req.query;
        
        let query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_ratings,
                   u.name as owner_name
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            LEFT JOIN users u ON s.owner_id = u.id
        `;
        
        const conditions = [];
        const params = [];
        
        if (search) {
            conditions.push('(s.name LIKE ? OR s.address LIKE ? OR u.name LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' GROUP BY s.id';
        

        const validSortColumns = ['name', 'email', 'address', 'average_rating'];
        const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        
        query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        
        const [stores] = await pool.execute(query, params);
        

        if (req.user.role === 'user') {
            for (const store of stores) {
                const [userRating] = await pool.execute(
                    'SELECT rating FROM ratings WHERE store_id = ? AND user_id = ?',
                    [store.id, req.user.id]
                );
                store.user_rating = userRating[0]?.rating || null;
            }
        }
        
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { search = '', role = '', sort = 'name', order = 'asc' } = req.query;
        
        let query = 'SELECT * FROM users WHERE 1=1';
        const conditions = [];
        const params = [];
        
        if (search) {
            conditions.push('(name LIKE ? OR email LIKE ? OR address LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (role) {
            conditions.push('role = ?');
            params.push(role);
        }
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        

        const validSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
        const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        
        query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        
        const [users] = await pool.execute(query, params);
        

        for (const user of users) {
            if (user.role === 'store_owner') {
                const [store] = await pool.execute(
                    `SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating
                     FROM stores s
                     LEFT JOIN ratings r ON s.id = r.store_id
                     WHERE s.owner_id = ?
                     GROUP BY s.id`,
                    [user.id]
                );
                user.store = store[0] || null;
            }
        }
        
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/ratings', authenticateToken, async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        if (!store_id) {
            return res.status(400).json({ error: 'Store ID is required' });
        }
        

        const [existing] = await pool.execute(
            'SELECT id FROM ratings WHERE store_id = ? AND user_id = ?',
            [store_id, req.user.id]
        );
        
        if (existing.length > 0) {
          
            await pool.execute(
                'UPDATE ratings SET rating = ? WHERE id = ?',
                [rating, existing[0].id]
            );
            res.json({ message: 'Rating updated successfully' });
        } else {
         
            await pool.execute(
                'INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)',
                [store_id, req.user.id, rating]
            );
            res.status(201).json({ message: 'Rating submitted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/store-owner/dashboard', authenticateToken, isStoreOwner, async (req, res) => {
    try {
       
        const [stores] = await pool.execute(
            `SELECT s.*, COALESCE(AVG(r.rating), 0) as average_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.owner_id = ?
             GROUP BY s.id`,
            [req.user.id]
        );
        
        if (stores.length === 0) {
            return res.status(404).json({ error: 'No store found for this user' });
        }
        
        const store = stores[0];
        
       
        const [ratings] = await pool.execute(`
            SELECT u.id, u.name, u.email, r.rating, r.created_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
        `, [store.id]);
        
        res.json({
            store: {
                ...store,
                average_rating: parseFloat(store.average_rating).toFixed(1)
            },
            ratings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.put('/api/users/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both passwords are required' });
        }
        
      
        const [users] = await pool.execute(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
    
        const validPassword = await bcrypt.compare(currentPassword, users[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        

        if (newPassword.length < 8 || newPassword.length > 16) {
            return res.status(400).json({ error: 'Password must be 8-16 characters' });
        }
        
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter and one special character' 
            });
        }
        
   
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        

        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/admin/stores', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { search = '', sort = 'name', order = 'asc' } = req.query;
        
        let query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_ratings,
                   u.name as owner_name
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            LEFT JOIN users u ON s.owner_id = u.id
        `;
        
        const conditions = [];
        const params = [];
        
        if (search) {
            conditions.push('(s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ? OR u.name LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' GROUP BY s.id';
        

        const validSortColumns = ['name', 'email', 'address', 'average_rating'];
        const sortColumn = validSortColumns.includes(sort) ? sort : 'name';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
        
        query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        
        const [stores] = await pool.execute(query, params);
        
        res.json(stores.map(store => ({
            ...store,
            average_rating: parseFloat(store.average_rating).toFixed(1)
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for: http://localhost:3000`);
});