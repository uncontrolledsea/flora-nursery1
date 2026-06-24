import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import API from '../services/api';
import { Calendar, CheckCircle2, Circle, AlertCircle, Droplets, CheckCircle, Leaf, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyPlantCare() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('week'); // 'week' | 'month' | 'upcoming'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load orders and generate schedule
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    API.get('/orders/my')
      .then(({ data }) => {
        setOrders(data);
        initializeSchedule(data);
      })
      .catch(() => toast.error('Failed to load purchase history'))
      .finally(() => setLoading(false));
  }, [user]);

  // Get start of current week
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  // Helper to generate next 30 days tasks for a plant
  const generateTasksForPlant = (plant) => {
    const list = [];
    const today = new Date();
    const waterCycle = (plant.watering || '').toLowerCase();
    const difficulty = plant.difficulty || 'Easy';

    // Parse watering cycles
    let waterDaysInterval = 7; // Default weekly
    if (waterCycle.includes('daily')) {
      waterDaysInterval = 1;
    } else if (waterCycle.includes('twice per week') || waterCycle.includes('2 per week')) {
      waterDaysInterval = 3;
    } else if (waterCycle.includes('once every 2 weeks') || waterCycle.includes('2 weeks')) {
      waterDaysInterval = 14;
    } else if (waterCycle.includes('once every 3 weeks') || waterCycle.includes('3 weeks')) {
      waterDaysInterval = 21;
    }

    // Generate tasks for 30 days
    for (let i = 0; i < 30; i++) {
      const taskDate = new Date();
      taskDate.setDate(today.getDate() + i);
      const dateStr = taskDate.toISOString().split('T')[0];

      // 1. Watering Tasks
      if (i % waterDaysInterval === 0) {
        list.push({
          id: `${plant._id}-water-${i}`,
          plantId: plant._id,
          plantName: plant.name,
          date: dateStr,
          type: 'Watering',
          icon: '💧',
          description: `Water at the base until damp. ${plant.watering || ''}.`,
          completed: false
        });
      }

      // 2. Soil Moisture Check (Weekly on Wednesdays or offset)
      if (i % 7 === 2) {
        list.push({
          id: `${plant._id}-check-${i}`,
          plantId: plant._id,
          plantName: plant.name,
          date: dateStr,
          type: 'Soil Check',
          icon: '🔍',
          description: 'Insert finger 1-2 inches deep. Water only if soil feels dry.',
          completed: false
        });
      }

      // 3. Fertilization (Once every 15 days)
      if (i % 15 === 5) {
        list.push({
          id: `${plant._id}-fertilize-${i}`,
          plantId: plant._id,
          plantName: plant.name,
          date: dateStr,
          type: 'Fertilize',
          icon: '🌿',
          description: 'Apply organic liquid feed. Helps promote leaf growth and blooms.',
          completed: false
        });
      }

      // 4. Misting / Grooming (Bi-weekly)
      if (i % 14 === 9) {
        list.push({
          id: `${plant._id}-grooming-${i}`,
          plantId: plant._id,
          plantName: plant.name,
          date: dateStr,
          type: 'Grooming',
          icon: '✂️',
          description: `Prune yellowing leaves, clean leaf surfaces, check for pests. Difficulty: ${difficulty}.`,
          completed: false
        });
      }
    }
    return list;
  };

  const initializeSchedule = (myOrders) => {
    // Extract unique product items purchased
    const purchasedPlants = [];
    const seen = new Set();

    myOrders.forEach(order => {
      // Only generate tasks for successfully placed/delivered/processed orders
      if (order.status !== 'Cancelled' && order.items) {
        order.items.forEach(item => {
          if (!seen.has(item.name)) {
            seen.add(item.name);
            purchasedPlants.push(item);
          }
        });
      }
    });

    if (purchasedPlants.length === 0) {
      setTasks([]);
      return;
    }

    // Load existing tasks from localStorage
    const localKey = `care_schedule_${user._id}`;
    const stored = localStorage.getItem(localKey);
    let currentTasks = stored ? JSON.parse(stored) : [];

    // Check if new plants have been purchased that are not in tasks
    const existingPlantIds = new Set(currentTasks.map(t => t.plantId));
    let hasNewPlants = false;
    let newTasks = [...currentTasks];

    purchasedPlants.forEach(plant => {
      // In checkout, items might not have the full database properties.
      // We will look up product details or merge with seed properties if needed,
      // but plant.watering etc will be used if present, otherwise default is handled.
      if (!existingPlantIds.has(plant.productId) && !existingPlantIds.has(plant._id)) {
        hasNewPlants = true;
        const normalizedPlant = {
          _id: plant.productId || plant._id,
          name: plant.name,
          watering: plant.watering || 'Once per week',
          difficulty: plant.difficulty || 'Easy'
        };
        const generated = generateTasksForPlant(normalizedPlant);
        newTasks = [...newTasks, ...generated];
      }
    });

    // Save and set state
    if (hasNewPlants || !stored) {
      localStorage.setItem(localKey, JSON.stringify(newTasks));
    }
    setTasks(newTasks);
  };

  const toggleTaskCompleted = (taskId) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    localStorage.setItem(`care_schedule_${user._id}`, JSON.stringify(updated));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success(`Completed care task: ${task.type} for ${task.plantName}!`);
    }
  };

  // Filter tasks based on views
  const getFilteredTasks = () => {
    if (view === 'week') {
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startStr = startOfWeek.toISOString().split('T')[0];
      const endStr = endOfWeek.toISOString().split('T')[0];

      return tasks.filter(t => t.date >= startStr && t.date <= endStr);
    } else if (view === 'month') {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const startStr = new Date(year, month, 1).toISOString().split('T')[0];
      const endStr = new Date(year, month + 1, 0).toISOString().split('T')[0];

      return tasks.filter(t => t.date >= startStr && t.date <= endStr);
    } else { // 'upcoming' uncompleted
      const todayStr = new Date().toISOString().split('T')[0];
      return tasks.filter(t => !t.completed && t.date >= todayStr).slice(0, 10);
    }
  };

  if (loading) return <div className="spinner" style={{ paddingTop: '4rem' }} />;

  // Find unique plants currently in schedule
  const uniqueScheduledPlants = Array.from(new Set(tasks.map(t => t.plantName)));

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar /> My Plant Care Schedule
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
            Care activities automatically generated for your purchased botanical selection.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', background: 'white', borderRadius: 8, padding: '0.2rem', boxShadow: 'var(--shadow)' }}>
          <button className={`tab ${view === 'week' ? 'active' : ''}`} style={{ padding: '0.4rem 1rem', borderBottom: 'none' }} onClick={() => setView('week')}>Weekly</button>
          <button className={`tab ${view === 'month' ? 'active' : ''}`} style={{ padding: '0.4rem 1rem', borderBottom: 'none' }} onClick={() => setView('month')}>Monthly</button>
          <button className={`tab ${view === 'upcoming' ? 'active' : ''}`} style={{ padding: '0.4rem 1rem', borderBottom: 'none' }} onClick={() => setView('upcoming')}>Upcoming Reminders</button>
        </div>
      </div>

      {uniqueScheduledPlants.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
          <AlertCircle size={48} color="var(--gray)" style={{ margin: '0 auto 1rem' }} />
          <h2>No Managed Plants Yet</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', maxWidth: 450, margin: '0 auto 1.5rem' }}>
            Purchase a plant from our catalog, and we will automatically seed a care calendar detailing water requirements, check cycles, fertilizing guidelines, and misting tasks.
          </p>
          <a href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: 8, display: 'inline-block' }}>
            Shop Plants
          </a>
        </div>
      ) : (
        <div className="layout-row" style={{ gridTemplateColumns: '1fr 280px' }}>
          {/* Main Tasks List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ textTransform: 'capitalize' }}>
                {view} Care Duties ({getFilteredTasks().length} tasks)
              </h3>
              {view !== 'upcoming' && (
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: '0.35rem 0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem' }} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {getFilteredTasks().length === 0 ? (
                <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--gray)' }}>
                  No care tasks scheduled for this period. Enjoy your plant-owning downtime!
                </div>
              ) : (
                getFilteredTasks().map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', opacity: task.completed ? 0.65 : 1, transition: 'opacity 0.2s' }}>
                    {/* Checkbox */}
                    <button onClick={() => toggleTaskCompleted(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--green)' : '#ccc', display: 'flex', alignItems: 'center' }}>
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>

                    {/* Task Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1.1rem' }}>{task.icon}</span>
                        <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.type} {task.plantName}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--gray)', background: 'var(--beige)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                          {new Date(task.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', weekday: 'short' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{task.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar / Stats Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Summary statistics */}
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.2rem', boxShadow: 'var(--shadow)' }}>
              <h4 style={{ color: 'var(--green)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={18} /> Schedule Stats
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Managed Plants:</span>
                  <strong>{uniqueScheduledPlants.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Tasks (30 days):</span>
                  <strong>{tasks.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completed Tasks:</span>
                  <strong style={{ color: 'var(--green)' }}>{tasks.filter(t => t.completed).length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completion Rate:</span>
                  <strong>
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Managed plants quick-list */}
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.2rem', boxShadow: 'var(--shadow)' }}>
              <h4 style={{ color: 'var(--green)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Leaf size={16} /> Plants Checklist
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--gray)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {uniqueScheduledPlants.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
