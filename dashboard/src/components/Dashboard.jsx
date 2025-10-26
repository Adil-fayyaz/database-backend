import React, { useState, useEffect } from 'react'
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import { api } from '../utils/api'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    files: 0,
    activeUsers: 0,
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, messagesRes, filesRes] = await Promise.all([
        api.get('/users'),
        api.get('/messages'),
        api.get('/files'),
      ])

      const users = usersRes.data.data
      const messages = messagesRes.data.data
      const files = filesRes.data.data

      // Calculate stats
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const activeUsers = users.filter(
        (user) => new Date(user.registrationDate) >= sevenDaysAgo
      ).length

      setStats({
        users: users.length,
        messages: messages.length,
        files: files.length,
        activeUsers,
      })

      // Prepare chart data (last 7 days)
      const chartDataArray = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const messagesCount = messages.filter(
          (msg) => msg.timestamp.split('T')[0] === dateStr
        ).length

        chartDataArray.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          messages: messagesCount,
        })
      }

      setChartData(chartDataArray)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          color="bg-blue-500"
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={stats.messages}
          color="bg-green-500"
        />
        <StatCard
          icon={FileText}
          label="Files"
          value={stats.files}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Active (7d)"
          value={stats.activeUsers}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Messages Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="messages" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Messages by Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

