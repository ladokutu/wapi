const { query } = require('express-validator');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
   ssl: {
    rejectUnauthorized: false
  }
});

client.connect();


const getReply = async (keyword) => {
	try {
		const res = await client.query('SELECT message FROM wa_replies WHERE keyword = $1', [keyword]);
			if (res.rows.length > 0){
				console.log(res.rows[0].message);
				return res.rows[0].message;
			}else{
				var kosong ='Yang ditanyakan g ada bosss';
				return kosong;
			}
			
	} 	catch (err) {
		throw err;
	}
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
