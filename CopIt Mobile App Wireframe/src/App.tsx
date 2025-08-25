import { useState } from 'react';
import { Camera, Upload, ArrowLeft, Check, TrendingUp, Info, Link, Zap, FileImage, ExternalLink, DollarSign, Heart, Bookmark, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Separator } from './components/ui/separator';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { InteractivePriceSlider } from './components/InteractivePriceSlider';

type Screen = 'home' | 'input' | 'analyzing' | 'results' | 'collection' | 'savedItemDetails';
type InputMethod = 'photo' | 'listing';

interface SavedItem {
  id: string;
  name: string;
  size: string;
  year: string;
  condition: string;
  conditionScore: number;
  marketValue: number;
  confidence: number;
  savedAt: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [inputMethod, setInputMethod] = useState<InputMethod>('photo');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [listingUrl, setListingUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSavedItem, setSelectedSavedItem] = useState<SavedItem | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    // Sample saved item for demo
    {
      id: '1',
      name: 'Nike Air Jordan 1 High "Chicago"',
      size: '10.5 US',
      year: '2015',
      condition: 'Very Good',
      conditionScore: 8.5,
      marketValue: 285,
      confidence: 92,
      savedAt: new Date('2024-01-15'),
    }
  ]);

  const handleSaveItem = () => {
    const newItem: SavedItem = {
      id: Date.now().toString(),
      name: 'Nike Air Jordan 1 High "Chicago"',
      size: '10.5 US',
      year: '2015',
      condition: 'Very Good',
      conditionScore: 8.5,
      marketValue: 285,
      confidence: 92,
      savedAt: new Date(),
    };
    setSavedItems(prev => [newItem, ...prev]);
    toast("Item saved to your collection!");
  };

  const handleViewSavedItem = (item: SavedItem) => {
    setSelectedSavedItem(item);
    setCurrentScreen('savedItemDetails');
  };

  const handleRemoveItem = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
    toast("Item removed from collection");
  };

  const handleAnalyze = () => {
    setCurrentScreen('analyzing');
    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setCurrentScreen('results'), 500);
      }
    }, 800);
  };

  const handleGoBack = () => {
    if (currentScreen === 'results' || currentScreen === 'analyzing') {
      setCurrentScreen('home');
      setAnalysisProgress(0);
      setListingUrl('');
      setSelectedFile(null);
    } else if (currentScreen === 'input' || currentScreen === 'collection') {
      setCurrentScreen('home');
    } else if (currentScreen === 'savedItemDetails') {
      setCurrentScreen('collection');
      setSelectedSavedItem(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const detectPlatform = (url: string) => {
    if (url.includes('grailed.com')) return 'Grailed';
    if (url.includes('depop.com')) return 'Depop';
    if (url.includes('poshmark.com')) return 'Poshmark';
    if (url.includes('ebay.com')) return 'eBay';
    if (url.includes('mercari.com')) return 'Mercari';
    if (url.includes('vinted.com')) return 'Vinted';
    return 'Platform';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-border p-4 flex items-center justify-between">
        {currentScreen !== 'home' && (
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-2xl font-semibold text-black">
          Cop<span style={{ color: '#8FA876' }}>it</span>
        </h1>
        {currentScreen !== 'home' && <div className="w-8" />}
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {currentScreen === 'home' && <HomeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'input' && (
          <InputScreen 
            inputMethod={inputMethod}
            setInputMethod={setInputMethod}
            onAnalyze={handleAnalyze}
            listingUrl={listingUrl}
            setListingUrl={setListingUrl}
            detectPlatform={detectPlatform}
            selectedFile={selectedFile}
            onFileUpload={handleFileUpload}
          />
        )}
        {currentScreen === 'analyzing' && (
          <AnalyzingScreen 
            progress={analysisProgress} 
            inputMethod={inputMethod}
            listingUrl={listingUrl}
            detectPlatform={detectPlatform}
          />
        )}
        {currentScreen === 'results' && <ResultsScreen onNavigate={setCurrentScreen} onSaveItem={handleSaveItem} />}
        {currentScreen === 'collection' && (
          <CollectionScreen 
            savedItems={savedItems} 
            onViewItem={handleViewSavedItem}
            onRemoveItem={handleRemoveItem}
          />
        )}
        {currentScreen === 'savedItemDetails' && selectedSavedItem && (
          <SavedItemDetailsScreen 
            item={selectedSavedItem}
            onNavigate={setCurrentScreen}
          />
        )}
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="space-y-8 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Know Your Worth</h2>
          <p className="text-muted-foreground text-lg">
            AI-powered resale pricing for buyers and sellers
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-4">
        <Button 
          className="w-full h-16 text-lg"
          onClick={() => onNavigate('input')}
        >
          <Camera className="w-6 h-6 mr-3" />
          Start Analysis
        </Button>
        
        <Button 
          variant="outline"
          className="w-full h-12"
          onClick={() => onNavigate('collection')}
        >
          <Bookmark className="w-5 h-5 mr-2" />
          My Collection
        </Button>
      </div>

      {/* Quick Features */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-accent-foreground" />
          </div>
          <p className="text-sm">Brand Detection</p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-accent-foreground" />
          </div>
          <p className="text-sm">Condition Grade</p>
        </div>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6 text-accent-foreground" />
          </div>
          <p className="text-sm">Market Price</p>
        </div>
      </div>
    </div>
  );
}

function InputScreen({
  inputMethod,
  setInputMethod,
  onAnalyze,
  listingUrl,
  setListingUrl,
  detectPlatform,
  selectedFile,
  onFileUpload,
}: {
  inputMethod: InputMethod;
  setInputMethod: (method: InputMethod) => void;
  onAnalyze: () => void;
  listingUrl: string;
  setListingUrl: (url: string) => void;
  detectPlatform: (url: string) => string;
  selectedFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const canAnalyze = inputMethod === 'photo' ? selectedFile : listingUrl.trim();

  return (
    <div className="space-y-6 py-4">
      {/* Input Method Tabs */}
      <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as InputMethod)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Photo
          </TabsTrigger>
          <TabsTrigger value="listing" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Listing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photo" className="space-y-6">
          {/* Photo Upload Area */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative">
              {selectedFile ? (
                <div className="text-center space-y-2">
                  <FileImage className="w-12 h-12 text-primary mx-auto" />
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">Ready to analyze</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="hidden"
                  id="camera-input"
                  capture="environment"
                />
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => document.getElementById('camera-input')?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="hidden"
                  id="file-input"
                />
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Show full piece in good lighting
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing" className="space-y-6">
          {/* URL Input */}
          <div className="space-y-4">
            <Label htmlFor="listing-url">Paste listing URL</Label>
            <div className="flex gap-2">
              <Input
                id="listing-url"
                type="url"
                placeholder="https://..."
                value={listingUrl}
                onChange={(e) => setListingUrl(e.target.value)}
                className="h-12 flex-1"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-12 px-3"
                onClick={() => {
                  navigator.clipboard.readText().then(text => {
                    setListingUrl(text);
                  }).catch(() => {
                    // Handle clipboard error
                  });
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            {listingUrl && (
              <Badge variant="secondary" className="text-xs">
                {detectPlatform(listingUrl)} detected
              </Badge>
            )}
          </div>

          {/* Supported Info */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Works with Grailed, Depop, Poshmark & more
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analyze Button */}
      <Button 
        className="w-full h-14 text-base"
        onClick={onAnalyze}
        disabled={!canAnalyze}
      >
        Analyze Item
      </Button>
    </div>
  );
}

function AnalyzingScreen({ progress, inputMethod, listingUrl, detectPlatform }: { progress: number; inputMethod: InputMethod; listingUrl: string; detectPlatform: (url: string) => string }) {
  const getAnalysisStep = () => {
    if (inputMethod === 'listing') {
      if (progress <= 20) return 'Scraping listing data...';
      if (progress <= 40) return 'Identifying brand & model...';
      if (progress <= 60) return 'Assessing condition...';
      if (progress <= 80) return 'Comparing market prices...';
      return 'Finalizing analysis...';
    } else {
      if (progress <= 20) return 'Processing image...';
      if (progress <= 40) return 'Identifying brand & style...';
      if (progress <= 60) return 'Grading condition...';
      if (progress <= 80) return 'Calculating resale value...';
      return 'Finalizing analysis...';
    }
  };

  return (
    <div className="space-y-8 py-16">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
          {inputMethod === 'listing' ? (
            <Link className="w-10 h-10 text-primary-foreground" />
          ) : (
            <TrendingUp className="w-10 h-10 text-primary-foreground" />
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl">Analyzing...</h2>
          <p className="text-muted-foreground">
            {inputMethod === 'listing' && listingUrl 
              ? `Processing ${detectPlatform(listingUrl)} listing`
              : 'AI analysis in progress'
            }
          </p>
        </div>

        <div className="space-y-3 px-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{getAnalysisStep()}</p>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ onNavigate, onSaveItem }: { onNavigate: (screen: Screen) => void; onSaveItem: () => void }) {
  return (
    <div className="space-y-6 py-4">
      {/* Item Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">Nike Air Jordan 1 High "Chicago"</h3>
              <p className="text-sm text-muted-foreground">Size 10.5 US • 2015</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" style={{ backgroundColor: '#f2f6ee', color: '#8FA876' }}>
                  Verified
                </Badge>
                <Badge variant="outline" className="text-xs">
                  OG All
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Grade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condition Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Overall Grade</span>
            <Badge style={{ backgroundColor: '#f2f6ee', color: '#8FA876' }} className="font-semibold">
              8.5/10 - Very Good
            </Badge>
          </div>
          
          {/* Condition Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Upper Leather</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Good</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Midsole/Outsole</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Excellent</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Box & Accessories</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Missing</span>
              </div>
            </div>
          </div>

          {/* Notable Issues */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              • Minor creasing on toe box
              • Light wear on heel counter
              • Original laces included
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Market Analysis
            <Info className="w-4 h-4 ml-2 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Fair Value */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold" style={{ color: '#8FA876' }}>$285</div>
            <p className="text-sm text-muted-foreground">Market Value</p>
            <Badge variant="outline" className="text-xs">92% Confidence</Badge>
          </div>
          
          <Separator />
          
          {/* Seller Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-center">Seller Recommendations</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Quick Sale</p>
                <p className="font-semibold" style={{ color: '#8FA876' }}>$250-260</p>
              </div>
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Best Value</p>
                <p className="font-semibold" style={{ color: '#8FA876' }}>$280-300</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Price Range Visualization */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Full Range</span>
                <span>$250 - $320</span>
              </div>
              
              {/* Interactive Price Slider */}
              <InteractivePriceSlider 
                minPrice={250}
                maxPrice={320}
                currentPrice={285}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Market Data */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Recent Sales</p>
              <p className="font-medium">147 items</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg. Sale Time</p>
              <p className="font-medium">12 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price Trend</p>
              <p className="font-medium text-primary">+8.3% (30d)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">2 min ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button className="w-full h-12" style={{ backgroundColor: '#8FA876' }}>
          Share Analysis
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12"
            onClick={onSaveItem}
          >
            Save Item
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => onNavigate('input')}
          >
            Analyze Another
          </Button>
        </div>
      </div>
    </div>
  );
}

function CollectionScreen({ 
  savedItems, 
  onViewItem, 
  onRemoveItem 
}: { 
  savedItems: SavedItem[]; 
  onViewItem: (item: SavedItem) => void;
  onRemoveItem: (itemId: string) => void;
}) {
  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">My Collection</h2>
        <p className="text-muted-foreground">
          {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {/* Item List */}
      {savedItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No saved items yet</h3>
            <p className="text-sm text-muted-foreground">
              Items you save from analysis results will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center"
                    onClick={() => onViewItem(item)}
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onViewItem(item)}
                  >
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">Size {item.size} • {item.year}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" style={{ backgroundColor: '#f2f6ee', color: '#8FA876' }} className="text-xs">
                        ${item.marketValue}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {item.savedAt.toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedItemDetailsScreen({ 
  item, 
  onNavigate 
}: { 
  item: SavedItem; 
  onNavigate: (screen: Screen) => void;
}) {
  // Calculate price range based on market value
  const minPrice = Math.round(item.marketValue * 0.88); // ~12% below market value
  const maxPrice = Math.round(item.marketValue * 1.12); // ~12% above market value
  const quickSaleMin = Math.round(item.marketValue * 0.88);
  const quickSaleMax = Math.round(item.marketValue * 0.91);
  const bestValueMin = Math.round(item.marketValue * 0.98);
  const bestValueMax = Math.round(item.marketValue * 1.05);

  return (
    <div className="space-y-6 py-4">
      {/* Item Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">Size {item.size} • {item.year}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" style={{ backgroundColor: '#f2f6ee', color: '#8FA876' }}>
                  Verified
                </Badge>
                <Badge variant="outline" className="text-xs">
                  OG All
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Grade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condition Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Overall Grade</span>
            <Badge style={{ backgroundColor: '#f2f6ee', color: '#8FA876' }} className="font-semibold">
              {item.conditionScore}/10 - {item.condition}
            </Badge>
          </div>
          
          {/* Condition Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Upper Leather</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Good</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Midsole/Outsole</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Excellent</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Box & Accessories</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-xs">Missing</span>
              </div>
            </div>
          </div>

          {/* Notable Issues */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              • Minor creasing on toe box
              • Light wear on heel counter
              • Original laces included
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Market Analysis
            <Info className="w-4 h-4 ml-2 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Fair Value */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold" style={{ color: '#8FA876' }}>${item.marketValue}</div>
            <p className="text-sm text-muted-foreground">Market Value</p>
            <Badge variant="outline" className="text-xs">{item.confidence}% Confidence</Badge>
          </div>
          
          <Separator />
          
          {/* Seller Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-center">Seller Recommendations</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Quick Sale</p>
                <p className="font-semibold" style={{ color: '#8FA876' }}>${quickSaleMin}-{quickSaleMax}</p>
              </div>
              <div className="text-center p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Best Value</p>
                <p className="font-semibold" style={{ color: '#8FA876' }}>${bestValueMin}-{bestValueMax}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Price Range Visualization */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Full Range</span>
                <span>${minPrice} - ${maxPrice}</span>
              </div>
              
              {/* Interactive Price Slider */}
              <InteractivePriceSlider 
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentPrice={item.marketValue}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Market Data */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Recent Sales</p>
              <p className="font-medium">147 items</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg. Sale Time</p>
              <p className="font-medium">12 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price Trend</p>
              <p className="font-medium text-primary">+8.3% (30d)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Saved</p>
              <p className="font-medium">{item.savedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button className="w-full h-12" style={{ backgroundColor: '#8FA876' }}>
          Share Analysis
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12"
          onClick={() => onNavigate('input')}
        >
          Analyze Another Item
        </Button>
      </div>
    </div>
  );
}