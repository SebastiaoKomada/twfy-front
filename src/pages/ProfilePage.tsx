import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { formatDate } from "@/lib/format"

const ROLE_LABEL: Record<string, string> = {
  comprador: "Comprador",
  vendedor: "Vendedor",
  admin: "Administrador",
}

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Minha conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nome</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">E-mail</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo de conta</span>
            <Badge variant="secondary">{ROLE_LABEL[user.role] ?? user.role}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente desde</span>
            <span className="font-medium">{formatDate(user.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
