import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Check, Code, FolderOpen, Search, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CobolFileUpload = () => {
  const [selectedFromList, setSelectedFromList] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'list' | 'upload'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample existing COBOL files
  const existingFiles = [
    { name: 'PAYROLL.CBL', size: '45.2 KB', modified: '2024-05-28' },
    { name: 'INVENTORY.CBL', size: '32.8 KB', modified: '2024-05-27' },
    { name: 'CUSTOMER.CPY', size: '12.4 KB', modified: '2024-05-26' },
    { name: 'ORDERS.CBL', size: '67.1 KB', modified: '2024-05-25' },
    { name: 'REPORTS.CPY', size: '28.9 KB', modified: '2024-05-24' },
    { name: 'BANKING.CBL', size: '54.3 KB', modified: '2024-05-23' },
    { name: 'UTILITIES.CPY', size: '19.7 KB', modified: '2024-05-22' },
    { name: 'MAINFRAME.CBL', size: '83.4 KB', modified: '2024-05-21' }
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
      <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="bg-muted p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">COBOL File Manager</h1>
              <p className="text-muted-foreground text-sm">Select existing files or upload new COBOL programs</p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-6 border-b">
          <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setUploadMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Select from Library
            </button>
            <button
              onClick={() => setUploadMode('upload')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMode === 'upload'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload New File
            </button>
          </div>
        </div>

        <div className="p-6">
          {uploadMode === 'list' ? (
            /* File List Mode */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Available COBOL Files</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handleListSelection(file.name)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedFromList === file.name
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md ${
                            file.name.endsWith('.CBL') 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            <File className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">{file.size} • Modified {file.modified}</p>
                          </div>
                        </div>
                        {selectedFromList === file.name && (
                          <div className="bg-primary text-primary-foreground p-1 rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No files found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Upload Mode */
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {isDragActive ? 'Drop your COBOL file here' : 'Drop your COBOL files here'}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      or{' '}
                      <span className="text-primary hover:underline font-medium">
                        browse to choose a file
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supports .CBL and .CPY files only
                  </p>
                </div>
              </div>

              {acceptedFiles.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-md">
                      <File className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800 dark:text-green-200">{acceptedFiles[0].name}</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {formatFileSize(acceptedFiles[0].size)} • Ready to upload
                      </p>
                    </div>
                    <div className="bg-green-600 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              disabled={acceptedFiles.length === 0 && !selectedFromList}
              className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
                acceptedFiles.length > 0 || selectedFromList
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {uploadMode === 'list' ? 'Load Selected File' : 'Upload File'}
            </button>
            <button className="px-6 py-3 border border-input text-foreground rounded-md hover:bg-muted transition-colors">
              Cancel
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default CobolFileUpload;
