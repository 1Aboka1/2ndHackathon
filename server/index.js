import express from "express";
import bodyParser from "body-parser";
import { DataStore } from "notarealdb";

import cors from "cors";
const app = express();
const port = 8080;

const store = new DataStore("./fake-data");
const tasks = store.collection("tasks"); // db for tasks
const users = store.collection("users"); // db for users
const infos = store.collection("info"); // db for info

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // json is working well
app.use(cors());

// tasks

app.get("/tasks", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json(tasks.list()); // get all tasks
});

app.get("/tasks/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json(tasks.get(req.params.id)); // get single task
});

app.post("/create", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { name, usernames, tags, done, deadline, author } = req.body;
  tasks.create({ name, usernames, tags, done, deadline, author });
  res.json({ name, usernames, tags, done, deadline, author });
});

app.put("/change", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id, name, usernames, tags, done, deadline, author } = req.body; // to change, all data together is must be written
  tasks.update({ id, name, usernames, tags, done, deadline, author });
  res.json({ id, usernames, name, tags, done, deadline, author });
});

app.post("/delete", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  tasks.delete(id);
  res.status(200).send();
});

app.put("/undone", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  for (let i = 0; i < tasks.list().length; i++) {
    if (tasks.list()[i].id === id) {
      // if account in DB
	  var { usernames, name, tags, done, deadline, author } = tasks.list()[i];
	done = false
	    tasks.update({ id, usernames, name, tags, done, deadline, author })
	  res.json('updated');
	    return
    }
  }
  res.json({
    id: id,
    usernames: usernames,
    name: name,
    tags: tags,
    done: done,
    deadline: deadline,
    author: author,
  });
});

app.put("/done", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  for (let i = 0; i < tasks.list().length; i++) {
    if (tasks.list()[i].id === id) {
      // if account in DB
	  var { usernames, name, tags, done, deadline, author } = tasks.list()[i];
	done = true	
	    tasks.update({ id, usernames, name, tags, done, deadline, author })
	  res.json('updated');
	    return
    }
  }
  res.json({
    id: id,
    usernames: usernames,
    name: name,
    tags: tags,
    done: done,
    deadline: deadline,
    author: author,
  });
});

// users
app.post("/register", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { username, password } = req.body;
  const tasks = users.list();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].username === username && tasks[i].password === password) {
      // checking if account is already exists
      res.json("You already have an account");
      return;
    }
  }
  users.create({ username, password }); // if no, create it
  res.json({ username, password });
});

app.post("/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { username, password } = req.body;
  const usersl = users.list();
  for (let i = 0; i < usersl.length; i++) {
	  console.log(usersl[i])
    if (usersl[i].username === username && usersl[i].password === password) {
      // if account in DB
      res.json("Login successfully");
      return;
    }
  }
  res.json("You probably don't have an account.");
});

app.post("/info", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { info, username } = req.body;
  const infolar = infos.list();
  for (let i = 0; i < infolar.length; i++) {
    // checking if info is already exists
    if (infolar[i].username === username && infolar[i].info === info) {
      res.json("Info already exists");
      return;
    }
  }
  infos.create({ info, username }); // if no, create
  res.json({ info, username });
});

app.post('/upload-avatar', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
	console.log(req.files)
	console.log(req.body)
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
app.put("/reset_password", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { username, newPassword, oldPassword } = req.body;

  for (let i = 0; i < users.list().length; i++) {
    if (users.list()[i].username === username) {
      // if account in DB
	  var { id, password } = users.list()[i];
		
	  if(password === oldPassword) {
		  
		users.update({ id, username, password: newPassword })
	  } else {
		  res.json('password don\'t match');
	  }
	  res.json('updated');
	    return
    }
  }
});


app.listen(port, () => {
  console.log("SERVER STARTED!");
});
