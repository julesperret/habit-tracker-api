const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb+srv://jules:Zrr23s5xDjdL6Ex6@cluster0.36joumz.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error Connecting to MongoDb", error);
  });

app.listen(port, () => {
  console.log("Server running on port 3000");
});

const todo = require("./models/todo");

//endpoint to create a todo in the backend
app.post("/todo", async (req, res) => {
  try {
    const { title, date } = req.body;

    const newtodo = new todo({
      title,
      date,
    });

    const savedtodo = await newtodo.save();
    res.status(200).json(savedtodo);
  } catch (error) {
    res.status(500).json({ error: "Network error" });
  }
});

app.get("/todoslist", async (req, res) => {
  try {
    const alltodos = await todo.find({});

    res.status(200).json(alltodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/todo/:todoId/", async (req, res) => {
  try {
    const { todoId } = req.params;
    if (!req.body.title || !req.body.date) {
      return response.status(400).send({
        message: "send all required fields : title and date",
      });
    }

    const updatedtodo = await todo.findByIdAndUpdate(todoId, req.body);

    if (!updatedtodo) {
      return res.status(404).json({ error: "todo not found" });
    }

    return res.status(200).json(updatedtodo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/todo/:todoId", async (req, res) => {
  try {
    const { todoId } = req.params;

    await todo.findByIdAndDelete(todoId);

    res.status(200).json({ message: "todo deleted succusfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete the todo" });
  }
});
