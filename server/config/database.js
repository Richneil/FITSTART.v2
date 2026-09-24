import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GLOSSARY_TERMS } from '../data/glossary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/fitstart_local_db.json');

const { Pool } = pg;

let pool = null;
let usePostgres = false;

// Fallback in-memory/file storage when Postgres credentials are not configured
let localDb = {
  users: [],
  user_profiles: [],
  assessment_results: [],
  glossary_entries: []
};

// Load local DB file if exists
function loadLocalDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      localDb = JSON.parse(data);
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.warn('[DB] Could not load local DB file, initializing fresh:', err.message);
  }
}

function saveLocalDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Failed to persist local DB:', err.message);
  }
}

export async function initDatabase() {
  loadLocalDb();

  const connString = process.env.DATABASE_URL;
  if (connString) {
    try {
      pool = new Pool({ connectionString: connString });
      await pool.query('SELECT 1');
      usePostgres = true;
      console.log('✓ Connected to PostgreSQL database successfully.');

      // Create PostgreSQL tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          google_id VARCHAR(255),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          two_factor_enabled BOOLEAN DEFAULT FALSE,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

        CREATE TABLE IF NOT EXISTS user_profiles (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          fitMao_report_data JSONB,
          parq_answers JSONB,
          assessed_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS assessment_results (
          id SERIAL PRIMARY KEY,
          profile_id INT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
          scored_metrics JSONB,
          main_focus JSONB,
          top_priorities JSONB,
          change_log JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS glossary_entries (
          id SERIAL PRIMARY KEY,
          term VARCHAR(255) UNIQUE NOT NULL,
          definition TEXT,
          why_it_matters TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✓ PostgreSQL tables verified/created.');
      return;
    } catch (err) {
      console.warn(`[DB] PostgreSQL connection attempt failed (${err.message}). Using persistent local store.`);
      usePostgres = false;
    }
  } else {
    console.log('[DB] No DATABASE_URL specified. Running with persistent local database mode.');
  }

  // Populate local glossary if empty
  if (localDb.glossary_entries.length === 0) {
    localDb.glossary_entries = GLOSSARY_TERMS.map((g, idx) => ({
      id: idx + 1,
      term: g.term,
      definition: g.definition,
      why_it_matters: g.whyItMatters,
      created_at: new Date().toISOString()
    }));
    saveLocalDb();
  }
}

// Database helper functions supporting both PostgreSQL & local persistent mode
export const db = {
  // Users
  async findUserByEmail(email) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      return res.rows[0] || null;
    }
    return localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (usePostgres) {
      const res = await pool.query('SELECT id, email, first_name, last_name, google_id, two_factor_enabled, avatar, created_at FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const u = localDb.users.find(user => user.id === Number(id));
    if (!u) return null;
    const { password_hash, ...safeUser } = u;
    safeUser.two_factor_enabled = Boolean(safeUser.two_factor_enabled);
    safeUser.avatar = safeUser.avatar || null;
    return safeUser;
  },

  async createUser({ email, password_hash, first_name, last_name, google_id, avatar }) {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, google_id, two_factor_enabled, avatar)
         VALUES ($1, $2, $3, $4, $5, FALSE, $6) RETURNING id, email, first_name, last_name, two_factor_enabled, avatar, created_at`,
        [email, password_hash, first_name, last_name, google_id, avatar || null]
      );
      return res.rows[0];
    }
    const newUser = {
      id: localDb.users.length + 1,
      email,
      password_hash,
      first_name,
      last_name,
      google_id: google_id || null,
      two_factor_enabled: false,
      avatar: avatar || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localDb.users.push(newUser);
    saveLocalDb();
    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, { first_name, last_name, password_hash, two_factor_enabled, avatar }) {
    if (usePostgres) {
      let query = 'UPDATE users SET updated_at = NOW()';
      const params = [];
      let paramIdx = 1;

      if (first_name !== undefined) {
        query += `, first_name = $${paramIdx++}`;
        params.push(first_name);
      }
      if (last_name !== undefined) {
        query += `, last_name = $${paramIdx++}`;
        params.push(last_name);
      }
      if (password_hash !== undefined && password_hash !== null) {
        query += `, password_hash = $${paramIdx++}`;
        params.push(password_hash);
      }
      if (two_factor_enabled !== undefined) {
        query += `, two_factor_enabled = $${paramIdx++}`;
        params.push(two_factor_enabled);
      }
      if (avatar !== undefined) {
        query += `, avatar = $${paramIdx++}`;
        params.push(avatar);
      }

      query += ` WHERE id = $${paramIdx} RETURNING id, email, first_name, last_name, two_factor_enabled, avatar`;
      params.push(id);

      const res = await pool.query(query, params);
      return res.rows[0];
    }
    const user = localDb.users.find(u => u.id === Number(id));
    if (!user) return null;
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (password_hash) user.password_hash = password_hash;
    if (two_factor_enabled !== undefined) user.two_factor_enabled = Boolean(two_factor_enabled);
    if (avatar !== undefined) user.avatar = avatar;
    user.updated_at = new Date().toISOString();
    saveLocalDb();
    const { password_hash: _, ...safeUser } = user;
    safeUser.two_factor_enabled = Boolean(safeUser.two_factor_enabled);
    return safeUser;
  },

  // Assessments / User Profiles
  async createProfile({ user_id, fitMao_report_data, parq_answers, assessed_date }) {
    if (usePostgres) {
      const res = await pool.query(
        `INSERT INTO user_profiles (user_id, fitMao_report_data, parq_answers, assessed_date)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id || null, JSON.stringify(fitMao_report_data), JSON.stringify(parq_answers), assessed_date || new Date()]
      );
      return res.rows[0];
    }
    const newProfile = {
      id: localDb.user_profiles.length + 1,
      user_id: user_id ? Number(user_id) : null,
      fitMao_report_data,
      parq_answers,
      assessed_date: assessed_date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localDb.user_profiles.push(newProfile);
    saveLocalDb();
    return newProfile;
  },

  async linkGuestProfileToUser(profile_id, user_id) {
    if (usePostgres) {
      const res = await pool.query(
        `UPDATE user_profiles SET user_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [user_id, profile_id]
      );
      return res.rows[0] || null;
    }
    const profile = localDb.user_profiles.find(p => p.id === Number(profile_id));
    if (profile) {
      profile.user_id = Number(user_id);
      profile.updated_at = new Date().toISOString();
      saveLocalDb();
    }
    return profile;
  },

  async getProfilesByUserId(user_id) {
    if (usePostgres) {
      const res = await pool.query(
        `SELECT p.*, r.main_focus, r.top_priorities 
         FROM user_profiles p
         LEFT JOIN assessment_results r ON r.profile_id = p.id
         WHERE p.user_id = $1 
         ORDER BY p.created_at DESC`,
        [user_id]
      );
      return res.rows;
    }
    const profiles = localDb.user_profiles
      .filter(p => p.user_id === Number(user_id))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return profiles.map(p => {
      const result = localDb.assessment_results.find(r => r.profile_id === p.id);
      return {
        ...p,
        main_focus: result?.main_focus || null,
        top_priorities: result?.top_priorities || null
      };
    });
  },

  async getProfileById(id, user_id) {
    if (!user_id) return null;
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM user_profiles WHERE id = $1 AND user_id = $2', [id, user_id]);
      return res.rows[0] || null;
    }
    return localDb.user_profiles.find(p => p.id === Number(id) && p.user_id === Number(user_id)) || null;
  },

  async updateProfile(id, user_id, { parq_answers, fitMao_report_data }) {
    if (usePostgres) {
      const res = await pool.query(
        `UPDATE user_profiles 
         SET parq_answers = COALESCE($1, parq_answers), 
             fitMao_report_data = COALESCE($2, fitMao_report_data),
             updated_at = NOW()
         WHERE id = $3 AND user_id = $4 RETURNING *`,
        [parq_answers ? JSON.stringify(parq_answers) : null, fitMao_report_data ? JSON.stringify(fitMao_report_data) : null, id, user_id || null]
      );
      return res.rows[0] || null;
    }
    const profile = localDb.user_profiles.find(p => p.id === Number(id) && p.user_id === Number(user_id));
    if (!profile) return null;
    if (parq_answers) profile.parq_answers = parq_answers;
    if (fitMao_report_data) profile.fitMao_report_data = fitMao_report_data;
    profile.updated_at = new Date().toISOString();
    saveLocalDb();
    return profile;
  },

  async deleteProfile(id, user_id) {
    if (usePostgres) {
      const res = await pool.query('DELETE FROM user_profiles WHERE id = $1 AND user_id = $2 RETURNING id', [id, user_id]);
      return res.rowCount > 0;
    }
    const initialLen = localDb.user_profiles.length;
    localDb.user_profiles = localDb.user_profiles.filter(p => !(p.id === Number(id) && p.user_id === Number(user_id)));
    const deleted = localDb.user_profiles.length < initialLen;
    if (deleted) {
      localDb.assessment_results = localDb.assessment_results.filter(r => r.profile_id !== Number(id));
      saveLocalDb();
    }
    return deleted;
  },

  // Results
  async saveResult({ profile_id, scored_metrics, main_focus, top_priorities, change_log }) {
    if (usePostgres) {
      // Upsert into assessment_results
      const check = await pool.query('SELECT id FROM assessment_results WHERE profile_id = $1', [profile_id]);
      if (check.rows.length > 0) {
        const res = await pool.query(
          `UPDATE assessment_results 
           SET scored_metrics = $1, main_focus = $2, top_priorities = $3, change_log = $4
           WHERE profile_id = $5 RETURNING *`,
          [JSON.stringify(scored_metrics), JSON.stringify(main_focus), JSON.stringify(top_priorities), JSON.stringify(change_log), profile_id]
        );
        return res.rows[0];
      } else {
        const res = await pool.query(
          `INSERT INTO assessment_results (profile_id, scored_metrics, main_focus, top_priorities, change_log)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [profile_id, JSON.stringify(scored_metrics), JSON.stringify(main_focus), JSON.stringify(top_priorities), JSON.stringify(change_log)]
        );
        return res.rows[0];
      }
    }

    const existingIdx = localDb.assessment_results.findIndex(r => r.profile_id === Number(profile_id));
    const resultObj = {
      id: existingIdx >= 0 ? localDb.assessment_results[existingIdx].id : localDb.assessment_results.length + 1,
      profile_id: Number(profile_id),
      scored_metrics,
      main_focus,
      top_priorities,
      change_log,
      created_at: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      localDb.assessment_results[existingIdx] = resultObj;
    } else {
      localDb.assessment_results.push(resultObj);
    }
    saveLocalDb();
    return resultObj;
  },

  async getResultByProfileId(profile_id) {
    if (usePostgres) {
      const res = await pool.query('SELECT * FROM assessment_results WHERE profile_id = $1', [profile_id]);
      return res.rows[0] || null;
    }
    return localDb.assessment_results.find(r => r.profile_id === Number(profile_id)) || null;
  }
};
