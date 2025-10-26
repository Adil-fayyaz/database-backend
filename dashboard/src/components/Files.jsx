import React, { useState, useEffect } from 'react'
import { Upload, Trash2, Download, FileText } from 'lucide-react'
import { api } from '../utils/api'

function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files')
      setFiles(response.data.data)
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      fetchFiles()
      alert('File uploaded successfully!')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    try {
      await api.delete(`/files/${id}`)
      setFiles(files.filter((file) => file._id !== id))
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Files</h1>
          <p className="text-gray-600">Upload and manage files</p>
        </div>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Upload className="w-5 h-5 mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <div
            key={file._id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {file.originalName}
                  </h3>
                  <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(file._id, file.fileUrl)}
                className="text-red-600 hover:text-red-900 transition-colors ml-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              <div>Uploaded by: {file.uploadedBy?.name || 'Unknown'}</div>
              <div>{new Date(file.date).toLocaleString()}</div>
            </div>
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
          No files uploaded yet
        </div>
      )}
    </div>
  )
}

export default Files

