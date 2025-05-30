import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Check, Code, FolderOpen, Search, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const CobolFileUpload = () => {
  const [selectedFromList, setSelectedFromList] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'list' | 'upload'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample existing COBOL files
  const existingFiles = [
    { name: 'PAYROLL.CBL', size: '45.2 KB', modified: '2024-05-28', type: 'CBL' },
    { name: 'INVENTORY.CBL', size: '32.8 KB', modified: '2024-05-27', type: 'CBL' },
    { name: 'CUSTOMER.CPY', size: '12.4 KB', modified: '2024-05-26', type: 'CPY' },
    { name: 'ORDERS.CBL', size: '67.1 KB', modified: '2024-05-25', type: 'CBL' },
    { name: 'REPORTS.CPY', size: '28.9 KB', modified: '2024-05-24', type: 'CPY' },
    { name: 'BANKING.CBL', size: '54.3 KB', modified: '2024-05-23', type: 'CBL' },
    { name: 'UTILITIES.CPY', size: '19.7 KB', modified: '2024-05-22', type: 'CPY' },
    { name: 'MAINFRAME.CBL', size: '83.4 KB', modified: '2024-05-21', type: 'CBL' }
  ];

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    return existingFiles.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      console.log('File uploaded:', acceptedFiles[0]);
      setSelectedFromList('');
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.cbl', '.cpy']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleListSelection = (fileName: string) => {
    setSelectedFromList(fileName);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-muted/30 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">COBOL File Manager</CardTitle>
              <CardDescription>Select existing files or upload new COBOL programs</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'list' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Select from Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload New File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available COBOL Files</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="h-96 w-full rounded-md border p-2">
                <div className="space-y-2">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedFromList === file.name
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleListSelection(file.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-md bg-muted">
                                <File className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{file.name}</h4>
                                  <Badge variant={file.type === 'CBL' ? 'default' : 'secondary'}>
                                    {file.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {file.size} • Modified {file.modified}
                                </p>
                              </div>
                            </div>
                            {selectedFromList === file.name && (
                              <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <File className="w-12 h-12 mb-2 opacity-50" />
                      <p>No files found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card
                {...getRootProps()}
                className={`cursor-pointer transition-all border-2 border-dashed ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input {...getInputProps()} />
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {isDragActive ? 'Drop your COBOL file here' : 'Drop your COBOL files here'}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        or{' '}
                        <span className="text-primary hover:underline font-medium">
                          browse to choose a file
                        </span>
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Supports .CBL and .CPY files only
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {acceptedFiles.length > 0 && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-green-800 dark:text-green-200">
                        {acceptedFiles[0].name}
                      </span>
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        ({formatFileSize(acceptedFiles[0].size)}) • Ready to upload
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <Button
              disabled={acceptedFiles.length === 0 && !selectedFromList}
              className="flex-1"
              size="lg"
            >
              {uploadMode === 'list' ? 'Load Selected File' : 'Upload File'}
            </Button>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </div>

          {/* Status Alert */}
          {(acceptedFiles.length > 0 || selectedFromList) && (
            <Alert className="mt-4">
              <AlertDescription>
                {uploadMode === 'list'
                  ? `Selected: ${selectedFromList}`
                  : `Ready to upload: ${acceptedFiles[0]?.name}`
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CobolFileUpload;
