import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ImageIcon, Calendar, LogOut, Heart } from "lucide-react"

export default function DashboardPage() {
  const albums = [
    {
      id: 1,
      title: "夏の思い出 2024",
      description: "海辺での家族旅行",
      photoCount: 24,
      thumbnail: "/summer-beach-family.jpg",
      updatedAt: "2024年8月15日",
    },
    {
      id: 2,
      title: "子供の成長記録",
      description: "1歳の誕生日",
      photoCount: 18,
      thumbnail: "/baby-birthday-celebration.jpg",
      updatedAt: "2024年7月20日",
    },
    {
      id: 3,
      title: "桜の季節",
      description: "お花見ピクニック",
      photoCount: 32,
      thumbnail: "/cherry-blossom-picnic.png",
      updatedAt: "2024年4月5日",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">思い出アルバム</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback className="bg-primary/10 text-primary">田中</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">田中 太郎</p>
                <p className="text-xs text-muted-foreground">テストユーザー</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">あなたのアルバム</h2>
            <p className="text-muted-foreground">大切な思い出を整理して、美しいスライドショーを作成しましょう</p>
          </div>
          <Button size="lg" className="shadow-lg hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 mr-2" />
            新しいアルバム
          </Button>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-0"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={album.thumbnail || "/placeholder.svg"}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-balance">{album.title}</CardTitle>
                <CardDescription className="text-pretty">{album.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>{album.photoCount}枚</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{album.updatedAt}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  variant="secondary"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  アルバムを開く
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Album Card */}
          <Card className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">新しいアルバムを作成</h3>
              <p className="text-muted-foreground text-sm">
                写真をアップロードして
                <br />
                思い出を整理しましょう
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
