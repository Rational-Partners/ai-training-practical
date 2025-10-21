import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Button,
  Table,
  Badge,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

// Import backend types (adjust path if needed, or define locally/shared)
// Assuming types might be manually defined or generated elsewhere if not directly importable
// For demonstration, let's define simplified versions inline or assume they exist
// import { ExampleTask, TaskStatus, TaskPriority } from "../../../../../backend/src/types/prisma-types"; // Keep commented out

import { fetchApi } from "../../../utils/apiClient"; // Path should be correct relative to new location

// UNCOMMENTED: Manual type definitions based on Prisma schema:
enum TaskStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}
interface ExampleTask {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string; // Dates will be strings from JSON
  updatedAt: string;
}

const priorityVariantMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "success",
  [TaskPriority.MEDIUM]: "warning",
  [TaskPriority.HIGH]: "danger",
};

const statusMap: Record<TaskStatus, string> = {
  [TaskStatus.UPCOMING]: "Upcoming",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.COMPLETED]: "Completed",
};

interface TaskTableProps {
  tasks: ExampleTask[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskTable = ({ tasks, onStatusChange }: TaskTableProps) => {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th className="align-middle w-25px">
          </th>
          <th className="align-middle w-50">Name</th>
          <th className="align-middle d-none d-xl-table-cell">Description</th>
          <th className="align-middle d-none d-xxl-table-cell">Created</th>
          <th className="align-middle">Priority</th>
          <th className="align-middle">Status</th>
          <th className="align-middle text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
            </td>
            <td>
              <strong>{task.name}</strong>
            </td>
            <td className="d-none d-xl-table-cell">{task.description || '-'}</td>
            <td className="d-none d-xxl-table-cell">{new Date(task.createdAt).toLocaleDateString()}</td>
            <td>
              <Badge bg="" className={`badge-subtle-${priorityVariantMap[task.priority]}`}>
                {task.priority}
              </Badge>
            </td>
            <td>
              <Form.Select
                size="sm"
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
              >
                <option value={TaskStatus.UPCOMING}>Upcoming</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </Form.Select>
            </td>
            <td className="text-end">
              {" "}
              <Button variant="light" size="sm">View</Button>{" "}
            </td>
          </tr>
        ))}
        {tasks.length === 0 && (
            <tr>
                <td colSpan={7} className="text-center p-3">No tasks in this category.</td>
            </tr>
        )}
      </tbody>
    </Table>
  );
};

interface TaskBoardProps {
  title: string;
  tasks: ExampleTask[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onNewTask: () => void;
}

const TaskBoard = ({ title, tasks, onStatusChange, onNewTask }: TaskBoardProps) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="mb-2">
          <Col xs={6}>
            <Card.Title as="h5">{title}</Card.Title>
          </Col>
          <Col xs={6}>
            <div className="text-sm-end">
              <Button
                variant="primary"
                size="sm"
                onClick={onNewTask}
              >
                <Plus size={18} /> New Task
              </Button>
            </div>
          </Col>
        </Row>
        <TaskTable tasks={tasks} onStatusChange={onStatusChange} />
      </Card.Body>
    </Card>
  );
};

const ExerciseTaskList = () => {
  const [tasks, setTasks] = useState<ExampleTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showIntroAlert, setShowIntroAlert] = useState<boolean>(true);

  // New Task Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.UPCOMING,
  });

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTasks = await fetchApi<ExampleTask[]>('/exercises/tasks');
        setTasks(fetchedTasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Modal handlers
  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      name: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.UPCOMING,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.UPCOMING,
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newTask = await fetchApi<ExampleTask>('/exercises/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setTasks(prev => [...prev, newTask]);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update task status
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = await fetchApi<ExampleTask>(`/exercises/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const upcomingTasks = tasks.filter((task) => task.status === TaskStatus.UPCOMING);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED);

  return (
    <React.Fragment>
      <Helmet title="Task List Exercise" />
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Task List Exercise</h1>

        {/* Introductory Blurb */}
        {showIntroAlert && (
          <Alert 
            variant="primary" 
            className="alert-outline"
            onClose={() => setShowIntroAlert(false)}
            dismissible
          >
            <div className="alert-icon">
              <FontAwesomeIcon icon={faBell} fixedWidth />
            </div>
            <div className="alert-message">
              <strong>Welcome to the Task List Exercise!</strong>
              <p className="mb-2">
                This page demonstrates a basic task list connected to a backend API. 
                The tasks you see below are fetched live from the database via 
                <code>/api/exercises/tasks</code>.
              </p>
              <p className="mb-1">
                While the read functionality is complete, there are still features 
                to implement as outlined in the project plan (
                <a href="/docs/plans/01-Task-Exercise-API.md" target="_blank" rel="noopener noreferrer"><code>docs/plans/01-Task-Exercise-API.md</code></a>).
                Your next steps are to implement the following, using AI assistance:
              </p>
              <ul>
                <li>Connect the 'New Task' button to the POST endpoint.</li>
                <li>Implement functionality to update task status (mark complete/incomplete) via the PUT endpoint.</li>
                <li>Implement functionality to delete tasks via the DELETE endpoint.</li>
                <li>Replace the 'View' button with an 'Edit' button and implement task editing functionality.</li>
              </ul>
            </div>
          </Alert>
        )}

        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            <TaskBoard
              title={statusMap[TaskStatus.UPCOMING]}
              tasks={upcomingTasks}
              onStatusChange={handleStatusChange}
              onNewTask={handleOpenModal}
            />
            <TaskBoard
              title={statusMap[TaskStatus.IN_PROGRESS]}
              tasks={inProgressTasks}
              onStatusChange={handleStatusChange}
              onNewTask={handleOpenModal}
            />
            <TaskBoard
              title={statusMap[TaskStatus.COMPLETED]}
              tasks={completedTasks}
              onStatusChange={handleStatusChange}
              onNewTask={handleOpenModal}
            />
          </>
        )}

        {/* New Task Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateTask}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Task Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description (optional)"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value)}
                >
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value={TaskStatus.UPCOMING}>Upcoming</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting || !formData.name.trim()}>
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </React.Fragment>
  );
};

export default ExerciseTaskList; 