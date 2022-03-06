const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',  //localhost
    port : 5432,
    user : 'postgres',  //Owner in \d (database)
    password : 'cheeyuiming8128',
    database : 'smart-brain'
  }
});

/*
db.select('*').from('users').then(data => {
	console.log(data);
});
*/

const app = express();

app.use(express.json()); //middleware
app.use(cors());

/*
const database = {
	users: [
	{
		id: '123',
		name: 'John',
		password: 'cookies',
		email: 'john@gmail.com',
		entries: 0,
		joined: new Date()
	},

	{
		id: '124',
		name: 'Sally',
		password: 'bananas',
		email: 'sally@gmail.com',
		entries: 0,
		joined: new Date()
	}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}
*/

// Everytime its saved, the top(database) got reinitialised again...not accurate if we save...
// Whenever server.js retart, we lose all the added data
// ...that is why databases(i.e. SQL) is needed...

app.get('/', (req, res) => {
	res.send('this is working');
	//res.send(database.users);
})

/*
app.post('/signin', (req, res) => {

db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid) {
			db.select('*').from('users').where('email', '=', req.body.email)
				.then(user => res.json(user[0]))
				.catch(err => res.status(400).json('unable to get user'));
		} else {
			res.status(400).json('wrong credentials');
		} 
	}).catch(err => res.status(400).json('wrong credentials'));

	//res.json('signin'); //responds with json

	
// 	bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

	// Load hash from your password DB.
	// bcrypt.compare("apples", '$2a$10$M/MYmKN0RRs1cDyHlaz62e45IrLDeBkrGw7es19wBAme.8i4B9.Da', function(err, res) {
	//     console.log('first guess', res);
	// });
	// bcrypt.compare("veggies", '$2a$10$M/MYmKN0RRs1cDyHlaz62e45IrLDeBkrGw7es19wBAme.8i4B9.Da', function(err, res) {
	//     console.log('second guess', res);
	// });
	

	
	// if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
	// 	res.json(database.users[0]);
	// } else {
	// 	res.status(400).json('error logging in');
	// }
	
})
*/

//handleSignin function is run, then (req, res) are automatically received...
//hence, function has to be designed to handle currying 
app.post('/signin', signin.handleSignin(db, bcrypt))















/*
app.post('/register', (req, res) => {
	const {email, password, name} = req.body;

	const hash = bcrypt.hashSync(password);

	// create a transaction when 2 or more things need to be done at once
	//transaction: data persisted in all the databases (schemas) goes through 
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*') //return all columns
				.insert({
					name: name, 
					email: loginEmail[0].email,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register')) //don't respond with err (contains system info)

	
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	entries: 0,
	// 	joined: new Date()		
	// })
	

//	res.json(database.users[database.users.length-1]);
	
});
*/

//db, bcrypt: dependencies injection
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})



















/*
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	//let found = false;

	db.select('*').from('users').where({id}) //id: id (property === value)
	.then(user => {
		//console.log(user[0]);
		//console.log(user);
		if (user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('Not found');
		}
	}).catch(err => res.status(400).json('error getting user'));

	
	// database.users.forEach((user) => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		return res.json(user); //return once user is found, if not the next request will error
	// 	} 
	// })
	

	
	// if (!found) {
	// 	res.status(400).json('not found'); 
	// }
	
})
*/

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})




















/*
app.put('/image', (req, res) => {
	const { id } = req.body;

	db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	res.json(entries[0].entries);
  }).catch(err => res.status(400).json('unable to get entries'));

	
	// let found = false;
	// database.users.forEach((user) => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries); //return once user is found, if not the next request will error
	// 	} 
	// })
	// if (!found) {
	// 	res.status(400).json('not found');
	// }
	
})
*/

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

// Post request because api key is added to the body (security reason)
// Imported via image already
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})








app.listen(3001, () => {
	console.log('app is running on port 3001');
})



//API design - endpoints
/*
/ (root) ----> res = this is working
/signin --> POST (request from browser - post data; user info); responds with success/failure by server
/register --> POST (same as above - add info); responds with new user object stating everything's working
/profile/:userId (each user has own home screen) --> GET; responds with user
/image --> PUT; an update on the user profile; responds the updated info, i.e. count

note: signin is a POST because password is sent in the body not in the query string; not visible


*/