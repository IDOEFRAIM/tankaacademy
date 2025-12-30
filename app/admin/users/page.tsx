import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "./_components/role-select";
import { UserActions } from "./_components/user-actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "dd MMMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  <RoleSelect userId={user.id} initialRole={user.role} />
                </TableCell>
                <TableCell>
                  {user.isSuspended ? (
                    <div className="flex flex-col gap-1">
                      <Badge variant="destructive">Suspendu</Badge>
                      {user.suspendedReason && (
                        <span className="text-xs text-muted-foreground max-w-[200px] truncate" title={user.suspendedReason}>
                          {user.suspendedReason}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
