const express = require("express");

const server = express();

server.use(express.json());

/**
 * variavel project armazena todos os projetos
 * variavel lastProjectsId e lastTasksId permintem que a criação seja auto encremente
 * variavel countRequests armazena quantas chamadas foram feitas
 */
const projects = [];
let lastProjectsId = 0;
let lastTasksId = 0;
let countRequests = 0;

/**
 * middleware que exibe contagem de chamadas
 */
server.use((req, res, next) => {
  console.log(`${++countRequests} requestions was called`);
  return next();
});

/**
 * middleware que verifica se o projeto existe
 */
function checkIfProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(el => el.id === Number(id));
  const indexProject = projects.findIndex(el => el.id === Number(id));

  if (!project) {
    return res.status(400).json({ error: "project doesn't exist" });
  }

  req.project = project;
  req.indexProject = indexProject;

  return next();
}

/**
 * middleware que verifica se a tarefa existe
 */
function checkIfTaskExist(req, res, next) {
  const { project } = req;
  const { idTask } = req.params;
  const task = project.tasks.find(el => el.id === Number(idTask));
  const taskIndex = project.tasks.findIndex(el => el.id === Number(idTask));

  if (!task) {
    return res.status(400).json({ error: "task doesn't exist" });
  }

  req.taks = task;
  req.taskIndex = taskIndex;

  return next();
}

/**
 * request.body: title
 * cadastra um novo projeto
 */
server.post("/projects", (req, res) => {
  const { title } = req.body;

  const project = {
    id: lastProjectsId++,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/**
 * busca todos projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * resquest.params: id
 * request.body: title
 * atualiza o titulo de um projeto
 */
server.put("/projects/:id", checkIfProjectExist, (req, res) => {
  const { project } = req;
  const { title } = req.body;
  const { id } = req.params;

  project.title = title;

  return res.json(project);
});

/**
 * request.params: id
 * deleta um projeto
 */
server.delete("/projects/:id", checkIfProjectExist, (req, res) => {
  const { indexProject } = req;
  const { id } = req.params;

  projects.splice(indexProject, 1);

  return res.json({});
});

/**
 * resquest.params: id
 * request.body: title
 * criar uma nova tarefa
 */
server.post("/projects/:id/tasks", checkIfProjectExist, (req, res) => {
  const { project } = req;
  const { id } = req.params;
  const { title } = req.body;

  project.tasks.push({ id: lastTasksId++, title });

  return res.json(project);
});

/**
 * resquest.params: id, idTask
 * request.body: title
 * atualiza uma tarefa
 */
server.put(
  "/projects/:id/tasks/:idTask",
  checkIfProjectExist,
  checkIfTaskExist,
  (req, res) => {
    const { project, task } = req;
    const { title } = req.body;

    task.title = title;

    return res.json(project);
  }
);

/**
 * resquest.params: id, idTask
 * deleta uma tarefa
 */
server.delete(
  "/projects/:id/tasks/:idTask",
  checkIfProjectExist,
  checkIfTaskExist,
  (req, res) => {
    const { project, taskIndex } = req;

    project.tasks.splice(taskIndex, 1);

    return res.json({});
  }
);

server.listen(3000);
