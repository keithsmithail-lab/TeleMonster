'use client'

import { useState } from 'react'
import { Upload, Search, FileText, Download, Trash2, Eye, Tag } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

interface KBDocument {
  id: string
  title: string
  source: string
  wordCount: number
  nepqStages: string[]
  topics: string[]
  lastProcessed: Date
  isActive: boolean
}

// Mock KB documents - TODO: Replace with real data from API
const mockDocuments: KBDocument[] = [
  {
    id: '1',
    title: 'Discount Card Script',
    source: 'discount_card_script.pdf',
    wordCount: 1250,
    nepqStages: ['Connection', 'Situation'],
    topics: ['discount', 'benefits', 'savings'],
    lastProcessed: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: '2',
    title: 'Union Benefits Guide',
    source: 'union_benefits.docx',
    wordCount: 3200,
    nepqStages: ['Solution Awareness', 'Presentation'],
    topics: ['union', 'benefits', 'coverage'],
    lastProcessed: new Date('2024-01-14'),
    isActive: true,
  },
  {
    id: '3',
    title: 'POS Guidelines',
    source: 'pos_guidelines.pdf',
    wordCount: 890,
    nepqStages: ['Presentation', 'Commitment'],
    topics: ['point of sale', 'process', 'paperwork'],
    lastProcessed: new Date('2024-01-12'),
    isActive: true,
  },
  {
    id: '4',
    title: 'Objection Responses',
    source: 'objection_responses.pdf',
    wordCount: 2100,
    nepqStages: ['Problem Awareness', 'Consequence'],
    topics: ['objections', 'responses', 'comebacks'],
    lastProcessed: new Date('2024-01-10'),
    isActive: true,
  },
  {
    id: '5',
    title: 'NEPQ Black Book',
    source: 'nepq_black_book.pdf',
    wordCount: 4500,
    nepqStages: ['Connection', 'Situation', 'Problem Awareness', 'Solution Awareness'],
    topics: ['nepq', 'methodology', 'training'],
    lastProcessed: new Date('2024-01-08'),
    isActive: true,
  },
]

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStage = !selectedStage || doc.nepqStages.includes(selectedStage)
    return matchesSearch && matchesStage
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    // TODO: Implement real file upload and processing
    setTimeout(() => {
      setIsUploading(false)
      // Mock success - would normally process with OCR/text extraction
      console.log('Files uploaded:', Array.from(files).map(f => f.name))
    }, 2000)
  }

  const nepqStages = [
    'All Stages',
    'Connection',
    'Situation', 
    'Problem Awareness',
    'Solution Awareness',
    'Consequence',
    'Transition',
    'Presentation',
    'Commitment'
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage training documents and study materials
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="file-upload">
              <Button disabled={isUploading} asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Processing...' : 'Upload Documents'}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDocuments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Words</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDocuments.reduce((sum, doc) => sum + doc.wordCount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NEPQ Coverage</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8/8</div>
              <p className="text-xs text-muted-foreground">All stages covered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value === 'All Stages' ? '' : e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {nepqStages.map(stage => (
              <option key={stage} value={stage === 'All Stages' ? '' : stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Documents Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>NEPQ Stages</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead>Word Count</TableHead>
                <TableHead>Last Processed</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-muted-foreground">{doc.source}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.nepqStages.map((stage) => (
                        <Badge key={stage} variant="outline" className="text-xs">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {doc.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.wordCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(doc.lastProcessed)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3 w-3" />
                        <span className="sr-only">View document</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3 w-3" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedStage
                ? 'Try adjusting your search filters'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && !selectedStage && (
              <label htmlFor="file-upload-empty">
                <Button asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </span>
                </Button>
              </label>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}