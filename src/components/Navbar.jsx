import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "./ui/dropdown-menu"
  import { Button } from "./ui/button"
  
  export default function Navbar() {
    return (
      <nav className="flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-md shadow text-sm font-medium text-white">
        <div className="flex items-center space-x-4">
          <img src="/src/assets/images/logo_no_bg.png" alt="Logo" className="h-8" />
          <span className="text-lg font-bold">VNA</span>
          <span className="text-xs">ONLINE AUCTION</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Trang chủ</Button>
  
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Danh mục đấu giá <span className="ml-1">⌄</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black">
              <DropdownMenuItem>Xe cộ</DropdownMenuItem>
              <DropdownMenuItem>Đồ điện tử</DropdownMenuItem>
              <DropdownMenuItem>Bất động sản</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  
          <Button variant="ghost">Thông báo và Tin tức</Button>
          <Button variant="ghost">Về chúng tôi</Button>
        </div>
      </nav>
    )
  }
  