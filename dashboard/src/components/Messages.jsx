import React, { useState, useEffect } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { api } from '../utils/api'

function Messages() {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.senderId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.receiverId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMessages(filtered)
  }, [searchTerm, messages])

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages')
      setMessages(response.data.data)
      setFilteredMessages(response.data.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    try {
      await api.delete(`/messages/${id}`)
      setMessages(messages.filter((msg) => msg._id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Error deleting message')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">View and manage all messages</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div key={message._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="text-sm">
                    <span className="font-semibold text-blue-600">
                      {message.senderId?.name || 'Unknown'}
                    </span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="font-semibold text-purple-600">
                      {message.receiverId?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-800">{message.content}</p>
              </div>
              <button
                onClick={() => handleDelete(message._id)}
                className="text-red-600 hover:text-red-900 transition-colors ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>{new Date(message.timestamp).toLocaleString()}</div>
              {message.read ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  Read
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                  Unread
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No messages found
        </div>
      )}
    </div>
  )
}

export default Messages

