const express = require('express')
const fs = require('fs/promises')
const https = require('https')
//var mysql = require('mysql2');
const url = require('url')
const { v4: uuidv4 } = require('uuid')
const post = require('./post.js')
const { MongoClient, ObjectId } = require('mongodb')
const cors = require('cors')
const session = require('express-session')

function generateInviteCode(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter++
  }
  return result
}

Number.prototype.toHexString = function () {
  if (this === null) { return null; }
  if (isNaN(this)) { return this; }
  var num;//  w ww .  j av  a 2 s  .c  o  m
  var hex;
  if (this < 0) {
    num = 0xFFFFFFFF + this + 1;
  }
  else {
    num = this;
  }
  hex = num.toString(16).toUpperCase();
  return "0x" + ("00000000".substr(0, 8 - hex.length) + hex);
}

// Iniciar servidors HTTP
const app = express()

// Use the session middleware
app.use(session({ secret: 'mi romance con el chema', cookie: { maxAge: 3000 } }))

// Access the session as req.session
app.get('/', function (req, res, next) {
  if (req.session.views) {
    console.log(req.session)
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>id: ' + req.session.id + '</p>')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write(JSON.stringify(req.session.cookie))
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})



// Configurar el port del servidor HTTP
const port = process.env.PORT || 3000

// Publicar els arxius HTTP de la carpeta 'public'
app.use(cors())

// Activar el servidor HTTP
const httpServer = app.listen(port, appListen)
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
const databaseName = "Agility"

function appListen() {
  console.log(`Example app listening for HTTP queries on: ${port}`)
}

// Definir URLs del servidor HTTP
app.get('/direccioURL', getIndex)
async function getIndex(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end("Aquestes són les dades que el servidor retorna per un missatge 'GET' a la direcció '/direccioURL'")
}

// Definir URL per les dades tipus POST
app.post('/getAllUsers', getUsers)
async function getUsers(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let collection = db.collection('users')

    result = { status: "OK", result: await collection.find().toArray() }
    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))

}

app.post('/googleLogin', testGoogle)
async function testGoogle(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let collection = db.collection('users')

    dbUser = await collection.findOne({ email: { $eq: receivedPOST.email } })
    if (dbUser) {
      await collection.updateOne({ email: { $eq: receivedPOST.email } }, { $set: { token: req.session.id } })
      result = { status: "OK", result: "LOGIN", token: req.session.id }
    } else {
      userData = {
        username: receivedPOST.name,
        email: receivedPOST.email,
        type: "google",
        token: req.session.id
      }
      if (receivedPOST.picture) {
        userData.picture = receivedPOST.picture
      }
      console.log(userData)
      await collection.insertOne(userData)
      result = { status: "OK", result: "REGISTER OK", token: req.session.id }
    }
    //console.log(receivedPOST)
    await client.close()
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/login', login)
async function login(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect();
    const db = client.db(databaseName)

    let collection = db.collection('users')

    let userData = await collection.findOne({ email: { $eq: receivedPOST.email } })

    if (userData) {
      if (userData.type == "google") {
        result = { status: "KO", result: "GOOGLE REGISTER" }
      } else {
        if (userData.password != receivedPOST.password) {
          result = { status: "KO", result: "WRONG PASSWORD" }
        } else {
          await collection.updateOne({ email: { $eq: receivedPOST.email } }, { $set: { token: req.session.id } })
          result = { status: "OK", result: "LOGIN OK", token: req.session.id }
        }
      }
    } else {
      result = { status: "KO", result: "WRONG USER" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/register', register)
async function register(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let collection = db.collection('users')
    let dbUser = await collection.findOne({ email: { $eq: receivedPOST.email } })

    if (dbUser) {
      result = { status: "KO", result: "L'usuari ja existeix" }
    } else {
      let userData = receivedPOST
      receivedPOST.token = req.session.id
      await collection.insertOne(userData)
      result = { status: "OK", result: "Usuari registrat", token: req.session.id }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/getProjects', getProjects)
async function getProjects(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let projects = await projectCollection.find({ creator: { $eq: user.email } }).toArray()
      if (projects) {
        result = { status: "OK", result: projects }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}


app.post('/createProject', createProject)
async function createProject(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}


  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let project = {
        creator: user.email,
        title: receivedPOST.title,
        description: receivedPOST.description,
        inviteCode: generateInviteCode(32),
        date: new Date().toDateString()
      }
      let insertedObject = await projectCollection.insertOne(project)
      insertedId = insertedObject.insertedId.toString()
      let sprintCollection = db.collection('sprintBoards')
      await insertSprintBoard(insertedId, "Backlog", sprintCollection)
      result = { status: "OK", result: "PROJECT CREATED" }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/createSprintBoard', createSprintBoard)
async function createSprintBoard(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    console.log(receivedPOST)
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    console.log(user)
    if (user) {
      let projectCollection = db.collection('projects')
      console.log(new ObjectId(receivedPOST.projectID))
      let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } })
      console.log(project)
      if (project) {
        let sprintCollection = db.collection('sprintBoards')
        await insertSprintBoard(receivedPOST.projectID, receivedPOST.name, sprintCollection)
        result = { status: "OK", result: "SPRINT CREATED" }
      } else {
        result = { status: "KO", result: "PROJECT NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

async function insertSprintBoard(projectID, name, sprintCollection) {
  let sprint = {
    projectID: projectID,
    name: name,
  }
  let insertedObject = await sprintCollection.insertOne(sprint)
  insertedId = insertedObject.insertedId.toJSON()
  return insertedId
}

app.post('/getSprintBoards', getSprintBoards)
async function getSprintBoards(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprints = await sprintCollection.find({ projectID: { $eq: receivedPOST.projectID } }).toArray()
      console.log(sprints)
      if (sprints) {
        result = { status: "OK", result: sprints }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/editSprintBoard', editSprintBoard)
async function editSprintBoard(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.newName } })
      if (sprintExists) {
        result = { status: "KO", result: "SPRINT ALREADY EXISTS" }
      } else {
        await sprintCollection.updateOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.oldName } }, { $set: { name: receivedPOST.newName } })
        result = { status: "OK", result: "SPRINT EDITED" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/deleteSprintBoard', deleteSprintBoard)
async function deleteSprintBoard(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      await sprintCollection.deleteOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.name } })
      result = { status: "OK", result: "SPRINT DELETED" }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/createTask', createTask)
async function createTask(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    result = {}
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.sprintName } })
      if (sprintExists) {
        let sprintID = sprintExists._id.toString()
        let taskCollection = db.collection('tasks')
        let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: receivedPOST.name } })
        if (taskExists) {
          result = { status: "KO", result: "TASK ALREADY EXISTS" }
        } else {
          let task = {
            sprintID: sprintID,
            name: receivedPOST.name,
            status: "TO DO"
          }
          let insertedObject = await taskCollection.insertOne(task)
          insertedId = insertedObject.insertedId.toString()
          result = { status: "OK", result: "TASK CREATED" }
        }

      } else {
        result = { status: "KO", result: "SPRINT NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/getTasksInSprint', getTasksInSprint)
async function getTasksInSprint(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    result = {}
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.sprintName } })
      if (sprintExists) {
        let sprintID = sprintExists._id.toString()
        let taskCollection = db.collection('tasks')
        let tasks = await taskCollection.find({ sprintID: { $eq: sprintID } }).toArray()
        result = { status: "OK", result: tasks }

      } else {
        result = { status: "KO", result: "SPRINT NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/getTasksInProject', getTasksInProject)
async function getTasksInProject(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    result = {}
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprints = await sprintCollection.find({ projectID: { $eq: receivedPOST.projectID } }).toArray()
      if (sprints && sprints.length > 0) {
        let taskCollection = db.collection('tasks')
        let tasksInProject = []
        for (let i = 0; i < sprints.length; i++) {
          let sprintID = sprints[i]._id.toString()
          let tasksInSprint = await taskCollection.find({ sprintID: { $eq: sprintID } }).toArray()
          tasksInProject = tasksInProject.concat(tasksInSprint)
        }
        result = { status: "OK", result: tasksInProject }

      } else {
        result = { status: "KO", result: "SPRINTS NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/editTask', editTask)
async function editTask(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    result = {}
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.sprintName } })
      if (sprintExists) {
        let sprintID = sprintExists._id.toString()
        let taskCollection = db.collection('tasks')
        let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: receivedPOST.oldName } })
        if (taskExists) {
          let updateData = {}
          if (receivedPOST.newName) {
            updateData.name = receivedPOST.newName
          }
          if (receivedPOST.status) {
            updateData.status = receivedPOST.status
          }
          if (receivedPOST.description) {
            updateData.description = receivedPOST.description
          }
          if (receivedPOST.assignedMember) {
            updateData.assignedMember = receivedPOST.assignedMember
          }
          if (receivedPOST.estimatedDuration) {
            updateData.estimatedDuration = receivedPOST.estimatedDuration
          }
          if (receivedPOST.estimatedStartDate) {
            updateData.estimatedStartDate = receivedPOST.estimatedStartDate
          }
          taskCollection.updateOne({ sprintID: { $eq: sprintID }, name: { $eq: receivedPOST.oldName } }, { $set: updateData })
          result = { status: "OK", result: "TASK EDITED" }
        } else {
          result = { status: "KO", result: "TASK NOT FOUND" }
        }

      } else {
        result = { status: "KO", result: "SPRINT NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/deleteTask', deleteTask)
async function deleteTask(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    result = {}
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.sprintName } })
      if (sprintExists) {
        let sprintID = sprintExists._id.toString()
        let taskCollection = db.collection('tasks')
        let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: receivedPOST.taskName } })
        if (taskExists) {
          taskCollection.deleteOne({ sprintID: { $eq: sprintID }, name: { $eq: receivedPOST.taskName } })
          result = { status: "OK", result: "TASK DELETED" }
        } else {
          result = { status: "KO", result: "TASK NOT FOUND" }
        }

      } else {
        result = { status: "KO", result: "SPRINT NOT FOUND" }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/dades', getDades)
async function getDades(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    if (receivedPOST.type == "herois") {
      result = { result: "Has demanat dades tipus 'herois'" }
    }
    if (receivedPOST.type == "bounce") {
      result = { result: `Has demanat que et reboti el missatge: ${receivedPOST.text}` }
    }
    if (receivedPOST.type == "broadcast") {
      result = { result: `Has demanat fer un broadcast del missatge: ${receivedPOST.text}` }
      broadcast({ type: "broadcastResponse", text: receivedPOST.text })
    }
    if (receivedPOST.type == "listTables") {
      result = { result: await queryDatabase(`SHOW TABLES`) }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: httpServer })
const socketsClients = new Map()
console.log(`Example app listening for WebSocket queries on: http://localhost:${port}`)


wss.on('connection', (ws) => {
  console.log("Client connected")

  // Add client to the clients list
  const id = uuidv4()
  const color = Math.floor(Math.random() * 360)
  const metadata = { id, color }
  socketsClients.set(ws, metadata)

  // What to do when a client is disconnected
  ws.on("close", () => {
    socketsClients.delete(ws)
  })

  // What to do when a client message is received
  ws.on('message', (bufferedMessage) => {
    var messageAsString = bufferedMessage.toString()
    var messageAsObject = {}

    try { messageAsObject = JSON.parse(messageAsString) }
    catch (e) { console.log("Could not parse bufferedMessage from WS message") }

    if (messageAsObject.type == "bounce") {
      var rst = { type: "response", text: `Rebotar Websocket: '${messageAsObject.text}'` }
      ws.send(JSON.stringify(rst))
    } else if (messageAsObject.type == "broadcast") {
      var rst = { type: "response", text: `Broadcast Websocket: '${messageAsObject.text}'` }
      broadcast(rst)
    }
  })
})

// Send a message to all clients
async function broadcast(obj) {

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      var messageAsString = JSON.stringify(obj)
      client.send(messageAsString)
    }
  })
}
/*
// Get the list of database tables from mysql
function queryDatabase (query) {

  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host: process.env.MYSQLHOST || "localhost",
      port: process.env.MYSQLPORT || 3306,
      user: process.env.MYSQLUSER || "root",
      password: process.env.MYSQLPASSWORD || "",
      database: process.env.MYSQLDATABASE || "test"
    });

    connection.query(query, (error, results) => { 
      if (error) reject(error);
      resolve(results)
    });
     
    connection.end();
  })
}*/