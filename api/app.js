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
const nodemailer = require('nodemailer');
const projects = {}

const messageExpireTime = 2592000000 // 30 days in ms
const sessionTokenExpireTime = 3000


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
  var num;
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
app.use(session({ secret: 'mi romance con el chema', cookie: { maxAge: sessionTokenExpireTime } }))

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
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let collection = db.collection('users')

    result = { status: "OK", result: await collection.find().toArray() }
    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))

}

app.post('/googleLogin', googleLogin)
async function googleLogin(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let collection = db.collection('users')
    let dbUser = await collection.findOne({ email: { $eq: receivedPOST.email } })

    if (dbUser) {
      result = { status: "KO", result: "USER EXISTS" }
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
    let client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let projects = await projectCollection.find({$or: [ { creator: { $eq: user.email } }, { invitedUsers : user.email }]}).toArray()
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

app.post('/getUser', getUser)
async function getUser(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    let client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      result = { status: "OK", result: user }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/getProject', getProject)
async function getProject(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    let client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } })
      if (project) {
        chatHistory = project.chatHistory
        let now = new Date();
        if (chatHistory) {
          for (let i = 0; i < chatHistory.length; i++) {
            if (now - chatHistory[i].date > messageExpireTime) {
              chatHistory.splice(i, 1)
            }
          }
        }
        result = { status: "OK", result: project }
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

app.post('/createProject', createProject)
async function createProject(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}


  if (receivedPOST) {
    result = {}
    const client = new MongoClient(uri)
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
      if (projectCollection.findOne({ title: { $eq: receivedPOST.title }, creator: { $eq: user.email } })) {
        result = { status: "KO", result: "PROJECT ALREADY EXISTS" }
      } else {
        let insertedObject = await projectCollection.insertOne(project)
        insertedId = insertedObject.insertedId.toString()
        let sprintCollection = db.collection('sprintBoards')
        await insertSprintBoard(insertedId, "Backlog", sprintCollection)
        result = { status: "OK", result: "PROJECT CREATED", projectID: insertedId }
      }
    } else {
      result = { status: "KO", result: "TOKEN EXPIRED" }
    }

    await client.close()
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}

app.post('/inviteToProject', inviteToProject)
async function inviteToProject(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } })
      if (project) {
        let invitedUser = await userCollection.findOne({ email: { $eq: receivedPOST.email } })
        if (invitedUser) {
          let inviteCollection = db.collection('invites')
          let invite = {
            projectID: receivedPOST.projectID,
            email: receivedPOST.email,
            inviteCode: project.inviteCode
          }
          await inviteCollection.insertOne(invite)
          result = { status: "OK", result: "INVITE SENT" }
        } else {
          result = { status: "KO", result: "USER NOT FOUND" }
        }
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

app.post('/createSprintBoard', createSprintBoard)
async function createSprintBoard(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}

  if (receivedPOST) {
    result = {}
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } })
      if (project) {
        let sprintCollection = db.collection('sprintBoards')
        let sprintExists = await sprintCollection.findOne({ projectID: { $eq: receivedPOST.projectID }, name: { $eq: receivedPOST.newName } })
        if (sprintExists) {
          result = { status: "KO", result: "SPRINT ALREADY EXISTS" }
        } else {
          await insertSprintBoard(receivedPOST.projectID, receivedPOST.name, sprintCollection)
          result = { status: "OK", result: "SPRINT CREATED" }
        }
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
    creationDate: new Date().toDateString()
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
    let client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)

    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let sprintCollection = db.collection('sprintBoards')
      let sprints = await sprintCollection.find({ projectID: { $eq: receivedPOST.projectID } }).toArray()
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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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
    let client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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
    const client = new MongoClient(uri)
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

app.post('/sendInviteEmail', sendInviteEmail)
async function sendInviteEmail(req, res) {
  let receivedPOST = await post.getPostData(req)
  let result = {}
  if (receivedPOST) {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(databaseName)
    let userCollection = db.collection('users')
    let user = await userCollection.findOne({ token: { $eq: receivedPOST.token } })
    if (user) {
      let projectCollection = db.collection('projects')
      console.log(receivedPOST.projectID)
      let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } })
      if (project) {
        await projectCollection.updateOne({ _id: { $eq: new ObjectId(receivedPOST.projectID) } }, { $push: { invitedUsers: receivedPOST.email } })
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'agility@iesesteveterradas.cat',
            pass: 'Ag1l1ty!--'
          }
        });
        
        var mailOptions = {
          from: '"AGILITY" agility@iesesteveterradas.cat',
          to: receivedPOST.email,
          subject: 'Sending Email using Node.js',
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
          <head>
          <title></title>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <!--<![endif]-->
          <meta name="x-apple-disable-message-reformatting" content="" />
          <meta content="target-densitydpi=device-dpi" name="viewport" />
          <meta content="true" name="HandheldFriendly" />
          <meta content="width=device-width" name="viewport" />
          <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
          <style type="text/css">
          table {
          border-collapse: separate;
          table-layout: fixed;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt
          }
          table td {
          border-collapse: collapse
          }
          .ExternalClass {
          width: 100%
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
          line-height: 100%
          }
          body, a, li, p, h1, h2, h3 {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          }
          html {
          -webkit-text-size-adjust: none !important
          }
          body, #innerTable {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale
          }
          #innerTable img+div {
          display: none;
          display: none !important
          }
          img {
          Margin: 0;
          padding: 0;
          -ms-interpolation-mode: bicubic
          }
          h1, h2, h3, p, a {
          line-height: 1;
          overflow-wrap: normal;
          white-space: normal;
          word-break: break-word
          }
          a {
          text-decoration: none
          }
          h1, h2, h3, p {
          min-width: 100%!important;
          width: 100%!important;
          max-width: 100%!important;
          display: inline-block!important;
          border: 0;
          padding: 0;
          margin: 0
          }
          a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important
          }
          u + #body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
          }
          a[href^="mailto"],
          a[href^="tel"],
          a[href^="sms"] {
          color: inherit;
          text-decoration: none
          }
          img,p{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h1{margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:400;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h2{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:400;font-style:normal;font-size:24px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h3{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:26px;font-weight:400;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}
          </style>
          <style type="text/css">
          @media (min-width: 481px) {
          .hd { display: none!important }
          }
          </style>
          <style type="text/css">
          @media (max-width: 480px) {
          .hm { display: none!important }
          }
          </style>
          <style type="text/css">
          @media (min-width: 481px) {
          h1,img,p{margin:0;Margin:0}img,p{font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h1{font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:400;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h2,h3{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;font-weight:400;font-style:normal;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h2{line-height:30px;font-size:24px}h3{line-height:26px;font-size:20px}.t31{width:560px!important}.t29{width:558px!important}.t14,.t17,.t22,.t27,.t5,.t8{width:600px!important}
          }
          </style>
          <style type="text/css" media="screen and (min-width:481px)">.moz-text-html img,.moz-text-html p{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}.moz-text-html h1{margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:400;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}.moz-text-html h2{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:400;font-style:normal;font-size:24px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}.moz-text-html h3{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:26px;font-weight:400;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}.moz-text-html .t31{width:560px!important}.moz-text-html .t29{width:558px!important}.moz-text-html .t14,.moz-text-html .t17,.moz-text-html .t22,.moz-text-html .t27,.moz-text-html .t5,.moz-text-html .t8{width:600px!important}</style>
          <!--[if !mso]><!-->
          <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@700&amp;family=Montserrat:wght@400;700&amp;display=swap" rel="stylesheet" type="text/css" />
          <!--<![endif]-->
          <!--[if mso]>
          <style type="text/css">
          img,p{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h1{margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:400;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h2{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:400;font-style:normal;font-size:24px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}h3{margin:0;Margin:0;font-family:Lato,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:26px;font-weight:400;font-style:normal;font-size:20px;text-decoration:none;text-transform:none;letter-spacing:0;direction:ltr;color:#333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px}td.t14,td.t17,td.t22,td.t27,td.t29,td.t31,td.t5,td.t8{width:600px !important}
          </style>
          <![endif]-->
          <!--[if mso]>
          <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          </head>
          <body id="body" class="t35" style="min-width:100%;Margin:0px;padding:0px;background-color:#EEF2FF;"><div class="t34" style="background-color:#EEF2FF;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t33" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#EEF2FF;" valign="top" align="center">
          <!--[if mso]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
          <v:fill color="#EEF2FF"/>
          </v:background>
          <![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td>
          <table class="t32" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t31" style="width:440px;padding:20px 20px 20px 20px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t31" style="width:480px;padding:20px 20px 20px 20px;"><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>
          <table class="t30" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t29" style="background-color:#FFFFFF;border:1px solid #A1A1A1;overflow:hidden;width:438px;padding:20px 20px 20px 20px;border-radius:8px 8px 8px 8px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t29" style="background-color:#FFFFFF;border:1px solid #A1A1A1;overflow:hidden;width:480px;padding:20px 20px 20px 20px;border-radius:8px 8px 8px 8px;"><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>
          <table class="t2" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t1" style="width:270px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t1" style="width:270px;"><![endif]-->
          <div style="font-size:0px;"><img class="t0" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="270" height="57.34375" alt="" src="https://568693dd-b385-4af7-bcc9-02d5aaa3a2d4.b-cdn.net/e/09cdd235-a6c9-4cd4-b9ae-fdf3fceddffa/25b99f8b-4955-4596-bf39-d1e0cd08ae85.png"/></div></td>
          </tr></table>
          </td></tr><tr><td><div class="t4" style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
          <table class="t6" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t5" style="width:480px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t5" style="width:480px;"><![endif]-->
          <h2 class="t3" style="margin:0;Margin:0;font-family:Source Sans 3,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:30px;font-weight:700;font-style:normal;font-size:22px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;">${user.username} te ha invitado a colaborar en el proyecto ${project.title}</h2></td>
          </tr></table>
          </td></tr><tr><td><div class="t16" style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
          <table class="t18" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t17" style="width:480px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t17" style="width:480px;"><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>
          <table class="t15" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t14" style="border-bottom:1px solid #A1A1A1;border-top:1px solid #A1A1A1;width:480px;padding:0 0 7px 0;">
          <!--<![endif]-->
          <!--[if mso]><td class="t14" style="border-bottom:1px solid #A1A1A1;border-top:1px solid #A1A1A1;width:480px;padding:0 0 7px 0;"><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td>
          <table class="t9" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t8" style="width:480px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t8" style="width:480px;"><![endif]-->
          <p class="t7" style="margin:0;Margin:0;font-family:Montserrat,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;">${user.username} (${user.email}) te ha invitado a colaborar en el proyecto ${project.name} en Agility:</p></td>
          </tr></table>
          </td></tr><tr><td><div class="t11" style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
          <table class="t13" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t12" style="background-color:#4F46E5;overflow:hidden;width:380px;text-align:center;line-height:24px;mso-line-height-rule:exactly;mso-text-raise:2px;padding:10px 10px 10px 10px;border-radius:4px 4px 4px 4px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t12" style="background-color:#4F46E5;overflow:hidden;width:400px;text-align:center;line-height:24px;mso-line-height-rule:exactly;mso-text-raise:2px;padding:10px 10px 10px 10px;border-radius:4px 4px 4px 4px;"><![endif]-->
          <a href="http://localhost:5173/project/${receivedPOST.projectID}"><span class="t10" style="display:block;margin:0;Margin:0;font-family:Montserrat,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:24px;font-weight:700;font-style:normal;font-size:16px;text-decoration:none;direction:ltr;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">Abrir Proyecto</span></a></td>
          </tr></table>
          </td></tr></table></td>
          </tr></table>
          </td></tr></table></td>
          </tr></table>
          </td></tr><tr><td><div class="t21" style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
          <table class="t23" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t22" style="width:480px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t22" style="width:480px;"><![endif]-->
          <p class="t20" style="margin:0;Margin:0;font-family:Montserrat,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:14px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;"><span class="t19" style="margin:0;Margin:0;font-weight:700;mso-line-height-rule:exactly;">Si te aparece un error 404 o 403</span>, asegúrate de haber iniciado sesión como [Your Username]</p></td>
          </tr></table>
          </td></tr><tr><td><div class="t26" style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">&nbsp;</div></td></tr><tr><td>
          <table class="t28" role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          <!--[if !mso]><!--><td class="t27" style="width:480px;">
          <!--<![endif]-->
          <!--[if mso]><td class="t27" style="width:480px;"><![endif]-->
          <p class="t25" style="margin:0;Margin:0;font-family:Montserrat,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:14px;text-decoration:none;text-transform:none;direction:ltr;color:#333333;text-align:left;mso-line-height-rule:exactly;mso-text-raise:2px;"><span class="t24" style="margin:0;Margin:0;font-weight:700;mso-line-height-rule:exactly;">Si no funciona el botón</span>, prueba a acceder a la siguiente URL: [URL]</p></td>
          </tr></table>
          </td></tr></table></td>
          </tr></table>
          </td></tr></table></td>
          </tr></table>
          </td></tr></table></td></tr></table></div></body>
          </html>`
        };
        
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        result = { status: "OK", result: "EMAIL SENT" }
    }}
    res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result))
}
}

const WebSocket = require('ws')
const { get } = require('http')
const wss = new WebSocket.Server({ server: httpServer })
const socketsClients = new Map()
console.log(`Example app listening for WebSocket queries on: http://localhost:${port}`)


wss.on('connection', (ws) => {

  async function getProjectData(projectID) {
    const client = new MongoClient(uri)
    client.connect()
    const db = client.db(databaseName)
    const projectCollection = db.collection('projects')
    let projectData = await projectCollection.findOne({ _id: { $eq: new ObjectId(projectID) } })
    const sprintsCollection = db.collection('sprintBoards')
    let sprints = await sprintsCollection.find({ projectID: { $eq: projectID } }).toArray()
    let sprintsObject = {}
    for (let i = 0; i < sprints.length; i++) {
      const tasksCollection = db.collection('tasks')
      const tasks = await tasksCollection.find({ sprintID: { $eq: sprints[i]._id.toString() } }).toArray()
      tasksObject = {}
      tasks.forEach((task) => {
        tasksObject[task.name] = task
      })
      sprints[i].tasks = tasksObject
      sprintsObject[sprints[i].name] = sprints[i]
    }
    projectData.sprints = sprintsObject
    return projectData
  }

  function broadcastProjectChange(projectID) {
    console.log("PROJECT", projects[projectID])
    console.log("USERS", projects[projectID].data.users)
    projects[projectID].users.forEach((user) => {
      user.send(JSON.stringify({ type: "projectData", project: projects[projectID].data }))
    })
  }

  console.log("Client connected")

  // Add client to the clients list
  const id = uuidv4()
  const color = Math.floor(Math.random() * 360)
  const metadata = { id, projectID: null, token: null }
  socketsClients.set(ws, metadata)

  // What to do when a client is disconnected
  ws.on("close", () => {
    const projectID = socketsClients.get(ws).projectID
    console.log("USERSSSS", projects[projectID].users)
    console.log("USER TO DELETE", projects[projectID].data.users.filter((user) => user.token == socketsClients.get(ws).token))
    projects[projectID].data.users.splice(projects[projectID].data.users.indexOf(projects[projectID].data.users.filter((user) => user.token == socketsClients.get(ws).token)[0]), 1)
    projects[projectID].users.splice(projects[projectID].users.indexOf(ws), 1)
    if (projects[projectID].users.length == 0) {
      //delete projects[projectID]
    }
    console.log("TOKEN", socketsClients.get(ws).token)
    delete projects[projectID].users.filter((user) => user.token == socketsClients.get(ws).token)
    socketsClients.delete(ws)
  })

  // What to do when a client message is received
  ws.on('message', (bufferedMessage) => {
    var messageAsString = bufferedMessage.toString()
    var messageAsObject = {}

    try { messageAsObject = JSON.parse(messageAsString) }
    catch (e) { console.log("Could not parse bufferedMessage from WS message") }
    console.log(messageAsObject)
    if (messageAsObject.type == "bounce") {
      var rst = { type: "response", text: `Rebotar Websocket: '${messageAsObject.text}'` }
      console.log(rst)
      ws.send(JSON.stringify(rst))
    } else if (messageAsObject.type == "broadcast") {
      var rst = { type: "response", text: `Broadcast Websocket: '${messageAsObject.text}'` }
      broadcast(rst)
    } else if (messageAsObject.type == "joinProject") {
      socketsClients.get(ws).projectID = messageAsObject.projectID
      socketsClients.get(ws).token = messageAsObject.token
      let project = projects[messageAsObject.projectID]
      if (project) {
        let usersInProject = projects[messageAsObject.projectID].users
        if (!usersInProject) {
          usersInProject = []
        }
      } else {
        usersInProject = []
      }
      if (usersInProject.indexOf(ws) == -1) {
        usersInProject.push(ws)
      }
      if (!project) {
        getProjectData(messageAsObject.projectID).then((project) => {
          getUserDataWs(messageAsObject.token).then((user) => {
            if (!project.users) {
              project.users = []
            }
            project.users.push(user)
            projects[messageAsObject.projectID] = {data: project, users: usersInProject}
            broadcastProjectChange(messageAsObject.projectID)
          })
        })
      } else {
        getUserDataWs(messageAsObject.token).then((user) => {
          if (!project.data.users) {
            project.data.users = []
          }
          if (project.data.users.indexOf(user) == -1) {
            project.data.users.push(user)
          }
          projects[messageAsObject.projectID] = project
          broadcastProjectChange(messageAsObject.projectID)
        })
      }
    } else if (messageAsObject.type == "moveTask") {
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.taskName].status = messageAsObject.newStatus
      moveTask(messageAsObject.projectID, messageAsObject.sprintName, messageAsObject.taskName, messageAsObject.newStatus);
      broadcastProjectChange(messageAsObject.projectID)
    } else if (messageAsObject.type == "createTask") {
      createTaskWs(messageAsObject.projectID, messageAsObject.sprintName, messageAsObject.taskName).then(result => {
        projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.taskName] = result
        console.log("result", result)
        broadcastProjectChange(messageAsObject.projectID)
      })
    } else if (messageAsObject.type == "createSprintBoard") {
      createSprintBoardWs(messageAsObject.projectID, messageAsObject.sprintName).then(result => {
        console.log("tesult", result)
        projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName] = result
        broadcastProjectChange(messageAsObject.projectID)
        console.log(ws.bufferedAmount)
        ws.send(JSON.stringify({ type: "setLatestSprint" }))
      })
    } else if (messageAsObject.type == "deleteSprintBoard") {
      deleteSprintBoardWs(messageAsObject.projectID, messageAsObject.sprintName)
      delete projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName]
      broadcastProjectChange(messageAsObject.projectID)
    } else if (messageAsObject.type == "sendMessage") {
      if (!projects[messageAsObject.projectID].data.chat) {
        projects[messageAsObject.projectID].data.chat = []
      }
      getUserDataWs(messageAsObject.token).then((user) => {
        projects[messageAsObject.projectID].data.chat.push({ 
          message: messageAsObject.message,
          token: messageAsObject.token, 
          username: user.username,
          date: new Date()
        })

        // console.log("\n\n\n\n\n\n\n\n\n------------ CHAT:", projects[messageAsObject.projectID].data.chat)

        updateChatWs(messageAsObject.projectID, projects[messageAsObject.projectID].data.chat)
        broadcastProjectChange(messageAsObject.projectID)
      })
      // projects[messageAsObject.projectID].data.chat
    } else if (messageAsObject.type == "editSprintBoard") {
      editSprintBoardWs(messageAsObject.projectID, messageAsObject.oldName, messageAsObject.newName)
      projects[messageAsObject.projectID].data.sprints[messageAsObject.newName] = projects[messageAsObject.projectID].data.sprints[messageAsObject.oldName]
      projects[messageAsObject.projectID].data.sprints[messageAsObject.newName].name = messageAsObject.newName
      delete projects[messageAsObject.projectID].data.sprints[messageAsObject.oldName]
      broadcastProjectChange(messageAsObject.projectID)
    } else if (messageAsObject.type == "editTask") {
      editTaskWs(messageAsObject.projectID, messageAsObject.sprintName, messageAsObject.oldName, messageAsObject.newName, messageAsObject.description, messageAsObject.assignedMember, messageAsObject.status)
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.newName] = projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.oldName]
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.newName].name = messageAsObject.newName
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.newName].description = messageAsObject.description
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.newName].assignedMember = messageAsObject.assignedMember
      projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.newName].status = messageAsObject.status
      if (messageAsObject.oldName != messageAsObject.newName) {
        delete projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.oldName]
      }
      console.log("PROJECTS", projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName])
      broadcastProjectChange(messageAsObject.projectID)
    } else if (messageAsObject.type == "deleteTask") {
      deleteTaskWs(messageAsObject.projectID, messageAsObject.sprintName, messageAsObject.taskName)
      delete projects[messageAsObject.projectID].data.sprints[messageAsObject.sprintName].tasks[messageAsObject.taskName]
      broadcastProjectChange(messageAsObject.projectID)
    } else if (messageAsObject.type == "inviteUser") {
      projects[messageAsObject.projectID].data.invitedUsers.push(messageAsObject.email)
      broadcastProjectChange(messageAsObject.projectID)
      
    }
  })
})

// TODO: 
async function getUserDataWs(token) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let userCollection = db.collection('users')
  let user = await userCollection.findOne({ token: { $eq: token } })
  if (user) {
    return user
  }
}
async function moveTask(projectID, sprintName, taskName, newStatus) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let sprintCollection = db.collection('sprintBoards')
  let sprintExists = await sprintCollection.findOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
    if (sprintExists) {
      let sprintID = sprintExists._id.toString()
      let taskCollection = db.collection('tasks')
      let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: taskName } })
      if (taskExists) {
        taskCollection.updateOne({ sprintID: { $eq: sprintID }, name: { $eq: taskName } }, { $set: {status: newStatus} })
        result = { status: "OK", result: "TASK EDITED" }
      } else {
        result = { status: "KO", result: "TASK NOT FOUND" }
      }

    } else {
      result = { status: "KO", result: "SPRINT NOT FOUND" }
    }
}

async function createTaskWs(projectID, sprintName, taskName) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  console.log(sprintName)
  let sprintCollection = db.collection('sprintBoards')
  let sprintExists = await sprintCollection.findOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
  if (sprintExists) {
    let sprintID = sprintExists._id.toString()
    let taskCollection = db.collection('tasks')
    let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: taskName } })
    if (taskExists) {
      result = { status: "KO", result: "TASK ALREADY EXISTS" }
    } else {
      let task = {
        sprintID: sprintID,
        name: taskName,
        status: "TO DO"
      }
      let insertedObject = await taskCollection.insertOne(task)
      insertedId = insertedObject.insertedId
      return await taskCollection.findOne({ _id: { $eq: insertedId } })
    }

  } else {
    result = { status: "KO", result: "SPRINT NOT FOUND" }
  }
}

async function createSprintBoardWs(projectID, sprintName) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)

  let projectCollection = db.collection('projects')
  let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(projectID) } })
  if (project) {
    let sprintCollection = db.collection('sprintBoards')
    let sprintExists = await sprintCollection.findOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
    if (sprintExists) {
      result = { status: "KO", result: "SPRINT ALREADY EXISTS" }
    } else {
      let insertedId = await insertSprintBoard(projectID, sprintName, sprintCollection)
      return await sprintCollection.findOne({ _id: { $eq: new ObjectId(insertedId) } })
    }
  } else {
    result = { status: "KO", result: "PROJECT NOT FOUND" }
  }

  await client.close()
}

async function updateChatWs(projectID, chat) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let projectCollection = db.collection('projects')
  let project = await projectCollection.findOne({ _id: { $eq: new ObjectId(projectID) } })
  if (project) {
    projectCollection.updateOne({ _id: { $eq: new ObjectId(projectID) } }, { $set: { chat: chat } })
  }
}

async function editSprintBoardWs(projectID, oldName, newName) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let sprintCollection = db.collection('sprintBoards')
  console.log("NEW", newName)
  await sprintCollection.updateOne({ projectID: { $eq: projectID }, name: { $eq: oldName } }, { $set: { name: newName } })
}

async function deleteSprintBoardWs(projectID, sprintName) {
  result = {}
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let sprintCollection = db.collection('sprintBoards')
  await sprintCollection.deleteOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
  result = { status: "OK", result: "SPRINT DELETED" }
}

// Send a message to all clients
async function broadcast(obj) {

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      var messageAsString = JSON.stringify(obj)
      client.send(messageAsString)
    }
  })
}

async function editTaskWs(projectID, sprintName, oldName, newName, description, assignedMember, status) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let sprintCollection = db.collection('sprintBoards')
  let sprintExists = await sprintCollection.findOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
  if (sprintExists) {
    let sprintID = sprintExists._id.toString()
    let taskCollection = db.collection('tasks')
    let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: oldName } })
    if (taskExists) {
      let updateData = {
        name: newName,
        description: description,
        assignedMember: assignedMember,
        status: status
      }
      console.log("UPDATE", updateData)
      taskCollection.updateOne({ sprintID: { $eq: sprintID }, name: { $eq: oldName } }, { $set: updateData })
    }
  }
}

async function deleteTaskWs(projectID, sprintName, taskName) {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(databaseName)
  let sprintCollection = db.collection('sprintBoards')
  let sprintExists = await sprintCollection.findOne({ projectID: { $eq: projectID }, name: { $eq: sprintName } })
  if (sprintExists) {
    let sprintID = sprintExists._id.toString()
    let taskCollection = db.collection('tasks')
    let taskExists = await taskCollection.findOne({ sprintID: { $eq: sprintID }, name: { $eq: taskName } })
    if (taskExists) {
      taskCollection.deleteOne({ sprintID: { $eq: sprintID }, name: { $eq: taskName } })
    }
  }
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