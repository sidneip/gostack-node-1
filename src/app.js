const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body
  
  repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(repository)
  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  id = request.params.id
  const {title, url, techs} = request.body
  repositoryIndex = repositories.findIndex( repo => repo.id == id)
  repositoryLikes = likes.find(like => like.repository_id == id) || []
  likesCount = repositoryLikes.length
  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: likesCount
  }
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'})
  }else{
    repositories[repositoryIndex] = repository
    return response.status(200).json(repository)
  }
});

app.delete("/repositories/:id", (request, response) => {
  id = request.params.id
  repositoryIndex = repositories.findIndex(repository => repository.id == id)
  console.log(repositoryIndex)
  if(repositoryIndex < 0){
    response.status(400).json({error: 'Repository not found'})
  }else{
    repositories.splice(repositoryIndex, 1)
    return response.status(204).send()
  }
});

app.post("/repositories/:id/like", (request, response) => {
  id = request.params.id
  likes.push({id: uuid(), repository_id: id})
  repositoryLikes = likes.filter((like) => like.repository_id == id) || []
  // return response.json(repositoryLikes)
  likesCount = repositoryLikes.length
  repositoryIndex = repositories.findIndex(repository => repository.id == id)
  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'})
  }
  return response.status(200).json({likes: likesCount})
});

module.exports = app;
