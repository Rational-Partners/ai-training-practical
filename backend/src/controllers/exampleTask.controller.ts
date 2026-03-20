import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '@prisma/client';
import { Prisma } from '@prisma/client'; // Import Prisma for error handling
import * as TaskService from '../services/exampleTask.service';

/**
 * Handles fetching all tasks, potentially filtered by status.
 */
export const handleGetAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract status from query parameters
    const statusQuery = req.query.status as string | undefined;

    // Validate and cast status query param to TaskStatus enum
    let status: TaskStatus | undefined = undefined;
    if (statusQuery && Object.values(TaskStatus).includes(statusQuery as TaskStatus)) {
      status = statusQuery as TaskStatus;
    }

    const tasks = await TaskService.getAllTasks(status);
    res.json(tasks);
  } catch (error) {
    next(error); // Pass errors to the central error handler
  }
};

/**
 * Handles fetching a single task by its ID.
 */
export const handleGetTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string; // Extract ID from URL parameters
    const task = await TaskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles creating a new task.
 */
export const handleCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validation is handled by middleware
    const newTaskData = req.body; 
    const createdTask = await TaskService.createTask(newTaskData);
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles updating an existing task by its ID.
 */
export const handleUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    // Basic check if updateData is empty
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedTask = await TaskService.updateTask(id, updateData);
    
    // TaskService.updateTask now returns null if not found (or we can catch Prisma P2025)
    // Let's rely on Prisma error for now, can adjust later if needed
    res.json(updatedTask);

  } catch (error) {
     // Handle Prisma's specific error for record not found during update/delete
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    next(error);
  }
};

/**
 * Handles deleting a task by its ID.
 */
export const handleDeleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    await TaskService.deleteTask(id);
    // TaskService.deleteTask returns the deleted task or throws P2025 if not found
    res.status(204).send(); // Send No Content on successful deletion
  } catch (error) {
     // Handle Prisma's specific error for record not found during update/delete
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    next(error);
  }
};

// We will add handlers for POST, PUT, DELETE later 