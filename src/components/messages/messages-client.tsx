'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Paperclip,
  Smile,
  Building,
  Stethoscope,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    participant: {
      id: 'hosp1',
      name: 'Dr. Sarah Johnson',
      role: 'Recruiter',
      hospital: 'City General Hospital',
      avatar: '',
      online: true
    },
    lastMessage: {
      content: 'Thank you for your application. We would like to schedule an interview.',
      timestamp: '2 min ago',
      unread: true
    },
    messages: [
      {
        id: 'm1',
        senderId: 'hosp1',
        content: 'Hello! I reviewed your application for the Emergency Medicine position.',
        timestamp: '10:30 AM',
        read: true
      },
      {
        id: 'm2',
        senderId: 'current',
        content: 'Thank you for reaching out. I\'m very interested in the position.',
        timestamp: '10:35 AM',
        read: true
      },
      {
        id: 'm3',
        senderId: 'hosp1',
        content: 'Great! Your credentials are impressive. We would like to schedule an interview.',
        timestamp: '10:40 AM',
        read: false
      }
    ]
  },
  {
    id: '2',
    participant: {
      id: 'hosp2',
      name: 'Michael Chen',
      role: 'HR Director',
      hospital: 'Metropolitan Medical Center',
      avatar: '',
      online: false
    },
    lastMessage: {
      content: 'We have received your application and will review it shortly.',
      timestamp: '1 hour ago',
      unread: false
    },
    messages: [
      {
        id: 'm4',
        senderId: 'hosp2',
        content: 'We have received your application and will review it shortly.',
        timestamp: '9:30 AM',
        read: true
      }
    ]
  },
  {
    id: '3',
    participant: {
      id: 'doc1',
      name: 'Dr. Emily Rodriguez',
      role: 'Cardiologist',
      hospital: 'Heart Institute',
      avatar: '',
      online: true
    },
    lastMessage: {
      content: 'Would you be interested in a locum position?',
      timestamp: '3 hours ago',
      unread: false
    },
    messages: [
      {
        id: 'm5',
        senderId: 'doc1',
        content: 'Hi! I saw your profile and thought you might be interested in a locum position at our facility.',
        timestamp: '8:00 AM',
        read: true
      },
      {
        id: 'm6',
        senderId: 'doc1',
        content: 'Would you be interested in a locum position?',
        timestamp: '8:05 AM',
        read: true
      }
    ]
  }
]

export function MessagesClient() {
  const { user, profile } = useAuth()
  const [conversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // In a real app, this would send to Supabase and update via real-time subscription
    toast.success('Message sent!')
    setNewMessage('')
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user || !profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access your messages.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                      <AvatarFallback>
                        {conversation.participant.role === 'Recruiter' || conversation.participant.role === 'HR Director' ? (
                          <Building className="h-5 w-5" />
                        ) : (
                          <Stethoscope className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.participant.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.participant.hospital}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.lastMessage.content}
                      </p>
                      {conversation.lastMessage.unread && (
                        <div className="h-2 w-2 bg-primary rounded-full ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                    <AvatarFallback>
                      {selectedConversation.participant.role === 'Recruiter' || selectedConversation.participant.role === 'HR Director' ? (
                        <Building className="h-5 w-5" />
                      ) : (
                        <Stethoscope className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.participant.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{selectedConversation.participant.role}</span>
                    <span>•</span>
                    <span>{selectedConversation.participant.hospital}</span>
                    {selectedConversation.participant.online && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.senderId === 'current' ? 'order-2' : 'order-1'}`}>
                      {message.senderId !== 'current' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedConversation.participant.avatar} alt={selectedConversation.participant.name} />
                            <AvatarFallback className="text-xs">
                              {selectedConversation.participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {selectedConversation.participant.name}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.senderId === 'current'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 space-x-1 ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                        {message.senderId === 'current' && (
                          <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
