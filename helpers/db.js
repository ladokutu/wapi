const { query } = require('express-validator');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //connectionString: "postgres://vzdgvkaidoconw:e31767ba71640aa4c687d50ad30c0871a32cfe05273d16fe7d8569114a755734@ec2-52-44-31-100.compute-1.amazonaws.com:5432/d11aufp3c5upbc",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();


const getReply = async (keyword) => {
	client.query('SELECT message FROM wa_replies WHERE keyword = $1', [keyword], (err, results) => {
			if (err) {
			  console.log(err);
			}else{
				console.log(results.rows[0].message);
				return results.rows[0].message;
			}
	})
}


const readSession = async () => {
  try {
    const res = await client.query('SELECT * FROM wa_sessions ORDER BY createdate DESC LIMIT 1');
    if (res.rows.length) return res.rows[0].session;
    return '';
  } catch (err) {
    throw err;
  }
}

const saveSession = (session) => {
  client.query('INSERT INTO wa_sessions (session) VALUES($1)', [session], (err, results) => {
    if (err) {
      console.error('Failed to save session!', err);
    } else {
      console.log('Session saved!');
    }
  });
}

const removeSession = () => {
  client.query('DELETE FROM wa_sessions', (err, results) => {
    if (err) {
      console.error('Failed to remove session!', err);
    } else {
      console.log('Session deleted!');
    }
  });
}




module.exports = {
  getReply,
  readSession,
  saveSession,
  removeSession
}
