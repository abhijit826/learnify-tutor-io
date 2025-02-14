
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  // Sample performance data
  const performanceData = [
    { date: "Mon", score: 85 },
    { date: "Tue", score: 82 },
    { date: "Wed", score: 89 },
    { date: "Thu", score: 87 },
    { date: "Fri", score: 92 },
    { date: "Sat", score: 90 },
    { date: "Sun", score: 94 },
  ];

  // Pomodoro Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      toast({
        title: "Time's up!",
        description: "Take a break and start fresh.",
      });
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsActive(false);
  };

  // Task Management
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="todo">To-Do List</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro Timer</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Problems Solved</span>
                    <span className="font-semibold">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Study Time</span>
                    <span className="font-semibold">14.5 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Current Streak</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="todo" className="space-y-4">
            <Card className="glass-card p-6">
              <form onSubmit={addTask} className="flex gap-2 mb-4">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1"
                />
                <Button type="submit">Add Task</Button>
              </form>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="rounded"
                    />
                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4">
            <Card className="glass-card p-6 text-center">
              <div className="mb-8">
                <Timer className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-4xl font-bold mb-4">{formatTime(timeLeft)}</h2>
                <div className="space-x-4">
                  <Button onClick={toggleTimer}>
                    {isActive ? "Pause" : "Start"}
                  </Button>
                  <Button variant="outline" onClick={resetTimer}>
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
