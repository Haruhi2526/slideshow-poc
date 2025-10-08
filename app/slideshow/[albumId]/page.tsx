import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Play, Download, Share2, Music, Sparkles, Clock, Heart } from "lucide-react"

export default function SlideshowCreatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">スライドショー作成</h1>
                <p className="text-xs text-muted-foreground">夏の思い出 2024</p>
              </div>
            </div>
          </div>

          <Avatar className="border-2 border-primary/20">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-primary/10 text-primary">田中</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-muted via-accent/20 to-primary/20 relative flex items-center justify-center">
                  <img src="/beach-sunset-slideshow-preview.jpg" alt="Preview" className="w-full h-full object-cover" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="w-20 h-20 rounded-full shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Play className="w-10 h-10 fill-current" />
                    </Button>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-semibold mb-1">夏の思い出 2024</p>
                    <p className="text-white/80 text-sm">24枚の写真 • 約2分30秒</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 shadow-lg hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 mr-2" />
                動画を生成
              </Button>
              <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                <Download className="w-5 h-5 mr-2" />
                保存
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* BGM Selection */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  BGM選択
                </CardTitle>
                <CardDescription>スライドショーの雰囲気に合わせて音楽を選びましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="gentle">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="gentle" id="gentle" />
                      <Label htmlFor="gentle" className="flex-1 cursor-pointer">
                        <p className="font-medium">優しいピアノ</p>
                        <p className="text-xs text-muted-foreground">穏やかで温かい雰囲気</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="upbeat" id="upbeat" />
                      <Label htmlFor="upbeat" className="flex-1 cursor-pointer">
                        <p className="font-medium">明るいアコースティック</p>
                        <p className="text-xs text-muted-foreground">楽しく元気な雰囲気</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="emotional" id="emotional" />
                      <Label htmlFor="emotional" className="flex-1 cursor-pointer">
                        <p className="font-medium">感動的なストリングス</p>
                        <p className="text-xs text-muted-foreground">心に響く感動的な雰囲気</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none" className="flex-1 cursor-pointer">
                        <p className="font-medium">BGMなし</p>
                        <p className="text-xs text-muted-foreground">音楽を使用しない</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Transition Effects */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  トランジション効果
                </CardTitle>
                <CardDescription>写真の切り替わり方を選択</CardDescription>
              </CardHeader>
              <CardContent>
                <Select defaultValue="fade">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">フェード</SelectItem>
                    <SelectItem value="slide">スライド</SelectItem>
                    <SelectItem value="zoom">ズーム</SelectItem>
                    <SelectItem value="dissolve">ディゾルブ</SelectItem>
                    <SelectItem value="wipe">ワイプ</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Display Duration */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  表示時間
                </CardTitle>
                <CardDescription>各写真の表示時間: 3秒</CardDescription>
              </CardHeader>
              <CardContent>
                <Slider defaultValue={[3]} min={1} max={5} step={0.5} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1秒</span>
                  <span>5秒</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
