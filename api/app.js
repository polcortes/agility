const express = require('express')
const fs = require('fs/promises')
const https = require('https')
//var mysql = require('mysql2');
const url = require('url')
const { v4: uuidv4 } = require('uuid')
const post = require('./post.js')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const session = require('express-session')

function generateInviteCode(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter ++
  }
  return result
}

// Iniciar servidors HTTP
const app = express()

// Use the session middleware
app.use(session({ secret: 'mi romance con el chema', cookie: { maxAge: 1000 }}))

// Access the session as req.session
app.get('/', function(req, res, next) {
  if (req.session.views) {
    console.log( req.session)
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

function appListen () {
  console.log(`Example app listening for HTTP queries on: ${port}`)
}

// Definir URLs del servidor HTTP
app.get('/direccioURL', getIndex)
async function getIndex (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end("Aquestes són les dades que el servidor retorna per un missatge 'GET' a la direcció '/direccioURL'")
}

// Definir URL per les dades tipus POST
app.post('/getAllUsers', getUsers)
async function getUsers (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    
    await client.connect()
    const db = client.db(databaseName)
    
    let collection = db.collection('users')
    
    result = {status:"OK", result: await collection.find().toArray()}
    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))

}

app.post('/googleLogin', testGoogle)
async function testGoogle (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}

    await client.connect()
    const db = client.db(databaseName)
    
    let collection = db.collection('users')

    dbUser = await collection.findOne({email: {$eq: receivedPOST.email}})
    if (dbUser) {
      await collection.updateOne({email: {$eq: receivedPOST.email}}, { $set: { token: req.session.id } })
      result = { status: "OK", result: "LOGIN", token: req.session.id}
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
      result = { status: "OK", result: "REGISTER OK", token: req.session.id}
    }
    //console.log(receivedPOST)
    await client.close()
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/login', login)
async function login (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    
    await client.connect();
    const db = client.db(databaseName)
    
    let collection = db.collection('users')
    
    let userData = await collection.findOne({email: {$eq: receivedPOST.email} })

    if (userData) {
      if (userData.type == "google") {
        result = { status: "KO", result: "GOOGLE REGISTER"}
      } else {
        if (userData.password != receivedPOST.password) {
          result = { status: "KO", result: "WRONG PASSWORD"}
        } else {
          await collection.updateOne({email: {$eq: receivedPOST.email}}, { $set: { token: req.session.id } })
          result = { status: "OK", result: "LOGIN OK", token: req.session.id}
        }
      }
    } else {
      result = { status: "KO", result: "L'usuari no existeix"}
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/register', register)
async function register (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    
    await client.connect()
    const db = client.db(databaseName)
    
    let collection = db.collection('users')
    let dbUser = await collection.findOne({email: {$eq: receivedPOST.email}})

    if (dbUser) {
      result = { status: "KO", result: "L'usuari ja existeix"}
    } else {
      let userData = receivedPOST
      receivedPOST.token = req.session.id
      await collection.insertOne(userData)
      result = { status: "OK", result: "Usuari registrat", token: req.session.id}
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/getProjects', getProjects)
async function getProjects (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    
    await client.connect()
    const db = client.db(databaseName)
    
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({token: {$eq: receivedPOST.token}})
    if (user) {
      let projectCollection = db.collection('projects')
      let projects = await projectCollection.find({creator: {$eq: user.email}}).toArray()
      if (projects) {
        result = { status: "OK", result: projects}
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED"}
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}


app.post('/createProject', createProject)
async function createProject (req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}


  if (receivedPOST) {
    result = {}
    
    await client.connect()
    const db = client.db(databaseName)
    
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({token: {$eq: receivedPOST.token}})
    if (user) {
      let projectCollection = db.collection('projects')
      let project = {
        creator: user.email,
        title: receivedPOST.title,
        description: receivedPOST.description,
        inviteCode: generateInviteCode(32),
        date: new Date().toDateString()
      }
      await projectCollection.insertOne(project)
      result = { status: "OK", result: "PROJECT CREATED"}
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED"}
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/dades', getDades)
async function getDades (req, res) {
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
async function broadcast (obj) {

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