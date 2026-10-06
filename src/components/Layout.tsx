import { LogOut, Package, Search, ShoppingCart, Store, User as UserIcon } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"

export function Layout() {
  const { user, logout } = useAuth()
  const { count, clearLocal } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    clearLocal()
    navigate("/")
  }

  const initials = user?.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Store className="h-5 w-5" />
            Tw4y
          </Link>

          <nav className="hidden flex-1 items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground">
              Catálogo
            </Link>
            {user && (
              <Link to="/pedidos" className="hover:text-foreground">
                Meus pedidos
              </Link>
            )}
            {(user?.role === "vendedor" || user?.role === "admin") && (
              <Link to="/vendedor" className="hover:text-foreground">
                Painel do vendedor
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-foreground">
                Administração
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild aria-label="Buscar">
              <Link to="/">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative" aria-label="Carrinho">
              <Link to="/carrinho">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                    {count}
                  </Badge>
                )}
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm sm:inline">{user.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil">
                      <UserIcon className="h-4 w-4" /> Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pedidos">
                      <Package className="h-4 w-4" /> Meus pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/cadastro">Criar conta</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Tw4y Marketplace — ambiente de treinamento para a aula de Web Hacking.
      </footer>

      <Toaster />
    </div>
  )
}
