import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';


axios.defaults.baseURL = 'http://localhost:5001/api';


axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('/login', { email, password });
            onLogin(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Rating Platform</h2>
                <p className="login-subtitle">Select your role to login</p>
                
                <div className="role-selection">
                    <div className="role-card">
                        <h3>Admin Login</h3>
                        <p>Email: admin@rating.com</p>
                        <p>Password: Admin@123</p>
                    </div>
                    <div className="role-card">
                        <h3>Store Owner Login</h3>
                        <p>Email: store@example.com</p>
                        <p>Password: Store@123</p>
                    </div>
                    <div className="role-card">
                        <h3>Normal User Login</h3>
                        <p>Email: user@example.com</p>
                        <p>Password: User@123</p>
                    </div>
                </div>

                <h3 className="login-title">Login to Your Account</h3>
                {error && <div className="error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="login-links">
                    <p className="register-link">
                        Don't have an account? <a href="/register">Register as User</a>
                    </p>
                    <p className="admin-note">
                        For admin access, use the credentials above
                    </p>
                </div>
            </div>
        </div>
    );
};


const Register = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            await axios.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                role: 'user'
            });
            setSuccess('Registration successful! You can now login.');
            setError('');
            
            setFormData({
                name: '',
                email: '',
                password: '',
                address: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Register New Account</h2>
                <p className="login-subtitle">Create a normal user account</p>
                
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name (20-60 characters):</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            minLength="20"
                            maxLength="60"
                            required
                            placeholder="Enter your full name (20-60 characters)"
                        />
                        <small>Must be between 20 and 60 characters</small>
                    </div>
                    
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Address (max 400 characters):</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            maxLength="400"
                            required
                            placeholder="Enter your full address"
                            rows="3"
                        />
                        <small>Maximum 400 characters</small>
                    </div>
                    
                    <div className="form-group">
                        <label>Password (8-16 chars, uppercase + special):</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password (8-16 characters)"
                        />
                        <small>Must contain uppercase and special character</small>
                    </div>
                    
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <p className="register-link">
                    Already have an account? <a href="/">Login here</a>
                </p>
            </div>
        </div>
    );
};


const AdminDashboard = ({ user, onLogout }) => {
    const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    

    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '', email: '', password: '', address: '', role: 'user'
    });
    

    const [showAddStore, setShowAddStore] = useState(false);
    const [newStore, setNewStore] = useState({
        name: '', email: '', address: '', owner_id: ''
    });
    

    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');
    const [storeSearch, setStoreSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'stores') {
            fetchStores();
        }
    }, [activeTab]);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (userSearch) params.append('search', userSearch);
            if (userRoleFilter) params.append('role', userRoleFilter);
            params.append('sort', sortConfig.key);
            params.append('order', sortConfig.direction);
            
            const response = await axios.get(`/admin/users?${params}`);
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const fetchStores = async () => {
        try {
            const params = new URLSearchParams();
            if (storeSearch) params.append('search', storeSearch);
            params.append('sort', sortConfig.key);
            params.append('order', sortConfig.direction);
            
            const response = await axios.get(`/admin/stores?${params}`);
            setStores(response.data);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/users', newUser);
            setShowAddUser(false);
            setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
            fetchUsers();
            fetchDashboardStats();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add user');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/stores', newStore);
            setShowAddStore(false);
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
            fetchStores();
            fetchDashboardStats();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add store');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        fetchUsers(); 
    };

    if (loading && activeTab === 'dashboard') {
        return (
            <div className="dashboard">
                <header className="header">
                    <h1>Admin Dashboard</h1>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </header>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="header">
                <h1>Admin Dashboard</h1>
                <div className="header-actions">
                    <span className="welcome-message">Welcome, {user.name}</span>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </div>
            </header>
            
            <nav className="admin-nav">
                <button 
                    className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'stores' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stores')}
                >
                    Stores
                </button>
            </nav>
            
            {activeTab === 'dashboard' && (
                <div className="dashboard-content">
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p className="stat-number">{stats.users}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Stores</h3>
                            <p className="stat-number">{stats.stores}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Ratings</h3>
                            <p className="stat-number">{stats.ratings}</p>
                        </div>
                    </div>

                    <div className="actions">
                        <button onClick={() => setShowAddUser(true)} className="btn-primary">
                            + Add New User
                        </button>
                        <button onClick={() => setShowAddStore(true)} className="btn-primary">
                            + Add New Store
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="dashboard-content">
                    <div className="section-header">
                        <h2>Users Management</h2>
                        <button onClick={() => setShowAddUser(true)} className="btn-primary">
                            + Add User
                        </button>
                    </div>
                    
                    <div className="filters-container">
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Search by name, email, or address..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && fetchUsers()}
                                className="search-input"
                            />
                            <button onClick={fetchUsers} className="btn-secondary">Search</button>
                        </div>
                        
                        <div className="filter-group">
                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">Normal User</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                            <button onClick={fetchUsers} className="btn-secondary">Filter</button>
                            <button onClick={() => { setUserSearch(''); setUserRoleFilter(''); fetchUsers(); }} className="btn-secondary">
                                Clear
                            </button>
                        </div>
                    </div>
                    
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')}>
                                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('email')}>
                                        Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('address')}>
                                        Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('role')}>
                                        Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th>Store Rating (if owner)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <span className={`role-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.store?.average_rating 
                                                ? `${parseFloat(user.store.average_rating).toFixed(1)}/5` 
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'stores' && (
                <div className="dashboard-content">
                    <div className="section-header">
                        <h2>Stores Management</h2>
                        <button onClick={() => setShowAddStore(true)} className="btn-primary">
                            + Add Store
                        </button>
                    </div>
                    
                    <div className="filters-container">
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Search stores..."
                                value={storeSearch}
                                onChange={(e) => setStoreSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && fetchStores()}
                                className="search-input"
                            />
                            <button onClick={fetchStores} className="btn-secondary">Search</button>
                        </div>
                    </div>
                    
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Owner</th>
                                    <th>Average Rating</th>
                                    <th>Total Ratings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map(store => (
                                    <tr key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.email}</td>
                                        <td>{store.address}</td>
                                        <td>{store.owner_name}</td>
                                        <td>{store.average_rating}/5</td>
                                        <td>{store.total_ratings}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label>Name (20-60 characters):</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                    required
                                    minLength="20"
                                    maxLength="60"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    required
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <textarea
                                    value={newUser.address}
                                    onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                                    required
                                    maxLength="400"
                                    placeholder="Enter address"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Role:</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="user">Normal User</option>
                                    <option value="store_owner">Store Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Add User</button>
                                <button type="button" onClick={() => setShowAddUser(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {showAddStore && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Store</h3>
                        <form onSubmit={handleAddStore}>
                            <div className="form-group">
                                <label>Store Name:</label>
                                <input
                                    type="text"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                                    required
                                    placeholder="Enter store name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Store Email:</label>
                                <input
                                    type="email"
                                    value={newStore.email}
                                    onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                                    required
                                    placeholder="Enter store email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Store Address:</label>
                                <textarea
                                    value={newStore.address}
                                    onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                                    required
                                    maxLength="400"
                                    placeholder="Enter store address"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner ID (User ID):</label>
                                <input
                                    type="number"
                                    value={newStore.owner_id}
                                    onChange={(e) => setNewStore({...newStore, owner_id: e.target.value})}
                                    required
                                    placeholder="Enter owner user ID"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Add Store</button>
                                <button type="button" onClick={() => setShowAddStore(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


const UserDashboard = ({ user, onLogout }) => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            
            const response = await axios.get(`/stores?${params}`);
            setStores(response.data);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            alert('Failed to load stores. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (storeId, rating) => {
        try {
            await axios.post('/ratings', { store_id: storeId, rating });
            
       
            setStores(stores.map(store => {
                if (store.id === storeId) {
                    return { ...store, user_rating: rating };
                }
                return store;
            }));
            
            alert('Rating submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to submit rating');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert('Password changed successfully');
            setShowChangePassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to change password');
        }
    };

    return (
        <div className="dashboard">
            <header className="header">
                <h1>Welcome, {user.name}!</h1>
                <div className="header-actions">
                    <button onClick={() => setShowChangePassword(true)} className="btn-secondary">
                        Change Password
                    </button>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </div>
            </header>

            {showChangePassword && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Change Password</button>
                                <button type="button" onClick={() => setShowChangePassword(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="section-header">
                    <h2>Available Stores</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search stores by name or address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && fetchStores()}
                            className="search-input"
                        />
                        <button onClick={fetchStores} className="btn-primary">Search</button>
                        <button onClick={() => { setSearch(''); fetchStores(); }} className="btn-secondary">
                            Clear
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">Loading stores...</div>
                ) : stores.length === 0 ? (
                    <div className="no-data">No stores found. Try a different search term.</div>
                ) : (
                    <div className="stores-grid">
                        {stores.map(store => (
                            <div key={store.id} className="store-card">
                                <div className="store-header">
                                    <h3>{store.name}</h3>
                                    <div className="store-rating-badge">
                                        {parseFloat(store.average_rating).toFixed(1)}/5
                                    </div>
                                </div>
                                
                                <p className="store-address">
                                    <strong>Address:</strong> {store.address}
                                </p>
                                <p className="store-email">
                                    <strong>Email:</strong> {store.email}
                                </p>
                                <p className="store-owner">
                                    <strong>Owner:</strong> {store.owner_name}
                                </p>
                                <p className="store-total-ratings">
                                    <strong>Total Ratings:</strong> {store.total_ratings}
                                </p>
                                
                                <div className="rating-section">
                                    <p className="your-rating">
                                        <strong>Your Rating:</strong> 
                                        {store.user_rating ? ` ${store.user_rating}/5` : ' Not rated yet'}
                                    </p>
                                    <div className="rating-buttons">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => handleRating(store.id, star)}
                                                className={`rating-btn ${store.user_rating === star ? 'active' : ''}`}
                                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                            >
                                                {star}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="rating-note">
                                        Click a number to rate this store
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const StoreOwnerDashboard = ({ user, onLogout }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/store-owner/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            alert('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await axios.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert('Password changed successfully');
            setShowChangePassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to change password');
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <header className="header">
                    <h1>Store Owner Dashboard</h1>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </header>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="dashboard">
                <header className="header">
                    <h1>Store Owner Dashboard</h1>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </header>
                <div className="error-message">No store data found</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="header">
                <h1>Store Owner Dashboard</h1>
                <div className="header-actions">
                    <button onClick={() => setShowChangePassword(true)} className="btn-secondary">
                        Change Password
                    </button>
                    <button onClick={onLogout} className="btn-logout">Logout</button>
                </div>
            </header>

            {showChangePassword && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Change Password</button>
                                <button type="button" onClick={() => setShowChangePassword(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="store-info-card">
                    <h2>{dashboardData.store.name}</h2>
                    <div className="store-details">
                        <p><strong>Email:</strong> {dashboardData.store.email}</p>
                        <p><strong>Address:</strong> {dashboardData.store.address}</p>
                        <p className="average-rating">
                            <strong>Average Rating:</strong> {dashboardData.store.average_rating} / 5
                        </p>
                    </div>
                </div>

                <div className="section">
                    <h2>Customer Ratings</h2>
                    {dashboardData.ratings.length === 0 ? (
                        <div className="no-data">No ratings yet.</div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Email</th>
                                        <th>Rating</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData.ratings.map((rating, index) => (
                                        <tr key={index}>
                                            <td>{rating.name}</td>
                                            <td>{rating.email}</td>
                                            <td>
                                                <div className="rating-display">
                                                    {rating.rating} / 5
                                                    <div className="stars">
                                                        {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const App = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const handleLogin = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    const renderDashboard = () => {
        if (!user) return <Navigate to="/" />;
        
        switch (user.role) {
            case 'admin':
                return <AdminDashboard user={user} onLogout={handleLogout} />;
            case 'store_owner':
                return <StoreOwnerDashboard user={user} onLogout={handleLogout} />;
            case 'user':
                return <UserDashboard user={user} onLogout={handleLogout} />;
            default:
                return <Navigate to="/" />;
        }
    };

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={renderDashboard()} />
        </Routes>
    );
};


const RootApp = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default RootApp;